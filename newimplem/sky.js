import * as THREE from 'three';
import { RENDER_DISTANCE, CHUNK_SIZE } from './config.js';
import { settings } from './settings.js';

const skyColors = {
    day: {
        fog: new THREE.Color(0x87ceeb),
        hemiSky: new THREE.Color(0xffffff),
        dirLight: new THREE.Color(0xffffff),
        skyTop: new THREE.Color(0x0077ff),
        skyBottom: new THREE.Color(0x87ceeb),
    },
    sunset: {
        fog: new THREE.Color(0xffa500),
        hemiSky: new THREE.Color(0xff8c00),
        dirLight: new THREE.Color(0xffaa33),
        skyTop: new THREE.Color(0xee6b3b),
        skyBottom: new THREE.Color(0xf2b54a),
    },
    night: {
        fog: new THREE.Color(0x000000),
        hemiSky: new THREE.Color(0x404080),
        dirLight: new THREE.Color(0x404060),
        skyTop: new THREE.Color(0x08102a),
        skyBottom: new THREE.Color(0x04081a),
    }
};

const biomeFogColors = {
    'Tundra': new THREE.Color(0xb0c4de),
    'Taiga': new THREE.Color(0x9ab8d1),
    'Forest': new THREE.Color(0x5a7a5a),
    'Dense Forest': new THREE.Color(0x4a6b4a),
    'Desert': new THREE.Color(0xdaa520),
    'Badlands': new THREE.Color(0xd2b48c),
    'Jungle': new THREE.Color(0x2e8b57),
    'Default': new THREE.Color(0x87ceeb),
};

const skyVertexShader = `
    varying vec3 vWorldPosition;
    varying vec3 vLocalPosition;
    void main() {
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;
        vLocalPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;

const skyFragmentShader = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    uniform vec3 sunDirection;
    uniform float sunIntensity;
    
    varying vec3 vWorldPosition;
    varying vec3 vLocalPosition;

    void main() {
        vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
        float h = normalize(vLocalPosition).y;
        vec3 skyColor = mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) );

        // Sun
        float sunDot = max(dot(viewDirection, sunDirection), 0.0);
        vec3 sunColor = vec3(1.0, 0.95, 0.85);
        float sunDisc = smoothstep(0.999, 0.9995, sunDot);
        float sunFlare = pow(sunDot, 35.0) * 0.4;
        vec3 finalSun = (sunDisc + sunFlare) * sunColor * sunIntensity;

        gl_FragColor = vec4( skyColor + finalSun, 1.0 );
    }
`;

export class Sky {
    constructor(scene) {
        this.scene = scene;
        this.lightUpdateCallbacks = [];
        this.fogUpdateCallbacks = [];

        // Internal state for day/night cycle
        this.cyclePosition = 0;
        this.isUnderwater = false;
        this.currentBiome = 'Default';
        this.underwaterFogColor = new THREE.Color(0x0a2f51);
        this.underwaterHemiColor = new THREE.Color(0x0a2f51);
        this.underwaterDirColor = new THREE.Color(0x1a4a6f);

        // Lighting
        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
        this.hemiLight.color.copy(skyColors.day.hemiSky);
        this.hemiLight.position.set(0, 200, 0);
        this.scene.add(this.hemiLight);

        this.dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        this.dirLight.color.copy(skyColors.day.dirLight);
        this.dirLight.position.set(-100, 150, -120);
        
        const shadowQuality = settings.get('shadowQuality');
        this.dirLight.castShadow = shadowQuality > 0;
        if (shadowQuality > 0) {
            this.dirLight.shadow.mapSize.width = shadowQuality;
            this.dirLight.shadow.mapSize.height = shadowQuality;
        }

        const shadowCamSize = 128;
        this.dirLight.shadow.camera.top = shadowCamSize;
        this.dirLight.shadow.camera.bottom = -shadowCamSize;
        this.dirLight.shadow.camera.left = -shadowCamSize;
        this.dirLight.shadow.camera.right = shadowCamSize;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.bias = -0.0001;
        this.scene.add(this.dirLight);

        // Skysphere
        const skyGeo = new THREE.SphereGeometry(RENDER_DISTANCE * CHUNK_SIZE, 64, 32);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color().copy(skyColors.day.skyTop) },
                bottomColor: { value: new THREE.Color().copy(skyColors.day.skyBottom) },
                offset: { value: 33 },
                exponent: { value: 0.6 },
                sunDirection: { value: new THREE.Vector3() },
                sunIntensity: { value: 1.0 },
            },
            vertexShader: skyVertexShader,
            fragmentShader: skyFragmentShader,
            side: THREE.BackSide
        });
        this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(this.skyMesh);

        // Stars
        const starCount = 5000;
        const starPositions = [];
        for (let i = 0; i < starCount; i++) {
            const vec = new THREE.Vector3(
                THREE.MathUtils.randFloatSpread(2),
                THREE.MathUtils.randFloatSpread(2),
                THREE.MathUtils.randFloatSpread(2)
            ).normalize().multiplyScalar(RENDER_DISTANCE * CHUNK_SIZE * 0.9);
            starPositions.push(vec.x, vec.y, vec.z);
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.5,
            transparent: true,
            opacity: 0,
            sizeAttenuation: false,
            blending: THREE.AdditiveBlending
        });
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);

        this.scene.fog = new THREE.Fog(skyColors.day.fog, 100, RENDER_DISTANCE * CHUNK_SIZE);
        
        this.initSettingsListeners();
    }

    initSettingsListeners() {
        settings.onChange('shadowQuality', (value) => {
            this.dirLight.castShadow = value > 0;
            if (value > 0) {
                this.dirLight.shadow.mapSize.width = value;
                this.dirLight.shadow.mapSize.height = value;
                if (this.dirLight.shadow.map) {
                    this.dirLight.shadow.map.dispose();
                    this.dirLight.shadow.map = null;
                }
            }
            this.dirLight.shadow.camera.updateProjectionMatrix();
        });
    }

    onLightUpdate(callback) {
        this.lightUpdateCallbacks.push(callback);
    }
    
    onFogUpdate(callback) {
        this.fogUpdateCallbacks.push(callback);
    }

    setBiome(biomeName) {
        if (this.currentBiome !== biomeName) {
            this.currentBiome = biomeName;
        }
    }

    setUnderwater(isUnderwater, cameraY, waterY) {
        if (this.isUnderwater === isUnderwater) return; // No change
        this.isUnderwater = isUnderwater;
        this.skyMesh.visible = !isUnderwater;
        this.stars.visible = !isUnderwater;
    }

    getCyclePosition() {
        return this.cyclePosition;
    }

    update(playerPosition, elapsedTime, water, terrain) {
        // Center sky elements on player
        this.skyMesh.position.copy(playerPosition);
        this.stars.position.copy(playerPosition);

        if (this.isUnderwater) {
            const transitionSpeed = 0.05;
            this.scene.fog.color.lerp(this.underwaterFogColor, transitionSpeed);
            this.scene.fog.near = 1;
            this.scene.fog.far = 40;

            this.hemiLight.color.lerp(this.underwaterHemiColor, transitionSpeed);
            this.dirLight.color.lerp(this.underwaterDirColor, transitionSpeed);

            const depthFactor = Math.max(0, Math.min(1, (water.position.y - playerPosition.y) / 20));
            this.hemiLight.intensity = THREE.MathUtils.lerp(0.5, 0.1, depthFactor);
            this.dirLight.intensity = THREE.MathUtils.lerp(0.4, 0.05, depthFactor);

        } else {
            this.updateDayNightCycle(elapsedTime, playerPosition);
        }

        // Update water sun direction and color
        if (water && water.material.uniforms.sunDirection) {
             water.material.uniforms.sunDirection.value.copy( this.dirLight.position ).normalize();
             water.material.uniforms.sunColor.value.copy( this.dirLight.color );
        }
        
        // Update terrain shader uniforms
        if (terrain && terrain.material) {
            terrain.material.uniforms.sunDirection.value.copy(this.dirLight.position).normalize();
            terrain.material.uniforms.sunColor.value.copy(this.dirLight.color);
            terrain.material.uniforms.hemisphereSkyColor.value.copy(this.hemiLight.color);
        }

        // Fire callbacks for other materials (like grass)
        this.lightUpdateCallbacks.forEach(cb => cb(this.dirLight, this.hemiLight));
        this.fogUpdateCallbacks.forEach(cb => cb(this.scene.fog));
    }

    updateDayNightCycle(elapsedTime, playerPosition) {
        const cycleDuration = 300; // 5 minutes
        this.cyclePosition = (elapsedTime % cycleDuration) / cycleDuration;

        const sunAngle = this.cyclePosition * Math.PI * 2;
        const sunYPosition = Math.sin(sunAngle) * 400;

        this.dirLight.position.set(
            playerPosition.x + Math.cos(sunAngle) * 400,
            sunYPosition,
            playerPosition.z + Math.sin(sunAngle) * 400 * 0.7
        );
        this.dirLight.target.position.copy(playerPosition);
        this.dirLight.target.updateMatrixWorld();
        this.dirLight.shadow.camera.updateProjectionMatrix();

        this.skyMesh.material.uniforms.sunDirection.value.copy(this.dirLight.position).normalize();

        let from, to, lerpFactor;
        const dayStart = 0.0, sunriseEnd = 0.25;
        const dayEnd = 0.5, sunsetEnd = 0.75;
        
        if (this.cyclePosition >= dayStart && this.cyclePosition < sunriseEnd) {
            from = skyColors.night; to = skyColors.day;
            lerpFactor = this.cyclePosition / sunriseEnd;
        } else if (this.cyclePosition >= sunriseEnd && this.cyclePosition < dayEnd) {
            from = skyColors.day; to = skyColors.day;
            lerpFactor = 1;
        } else if (this.cyclePosition >= dayEnd && this.cyclePosition < sunsetEnd) {
            from = skyColors.day; to = skyColors.sunset;
            lerpFactor = (this.cyclePosition - dayEnd) / (sunsetEnd - dayEnd);
        } else {
            from = skyColors.sunset; to = skyColors.night;
            lerpFactor = (this.cyclePosition - sunsetEnd) / (1.0 - sunsetEnd);
        }

        // Fog color blending
        const dayFog = skyColors.day.fog;
        const targetBiomeFog = biomeFogColors[this.currentBiome] || biomeFogColors.Default;
        
        // Only use biome fog during the day
        const daytimeFogColor = settings.get('biomeFog') ? targetBiomeFog : dayFog;
        
        let fromFog = from.fog;
        let toFog = to.fog;

        if (from === skyColors.day) fromFog = daytimeFogColor;
        if (to === skyColors.day) toFog = daytimeFogColor;
        if (from === skyColors.sunset && to === skyColors.day) fromFog = daytimeFogColor;
        
        this.scene.fog.color.lerpColors(fromFog, toFog, lerpFactor);

        this.hemiLight.color.lerpColors(from.hemiSky, to.hemiSky, lerpFactor);
        this.dirLight.color.lerpColors(from.dirLight, to.dirLight, lerpFactor);
        
        this.skyMesh.material.uniforms.topColor.value.lerpColors(from.skyTop, to.skyTop, lerpFactor);
        this.skyMesh.material.uniforms.bottomColor.value.lerpColors(from.skyBottom, to.skyBottom, lerpFactor);

        const intensity = Math.max(0, sunYPosition / 400) * 1.5;
        this.dirLight.intensity = intensity + 0.05;
        this.hemiLight.intensity = intensity * 0.8 + 0.3;
        
        this.skyMesh.material.uniforms.sunIntensity.value = Math.max(0.0, Math.min(1.0, sunYPosition / 100.0));

        const nightFactor = 1.0 - Math.min(1.0, Math.max(0, sunYPosition / 200.0));
        this.stars.material.opacity = nightFactor * (0.8 + Math.sin(elapsedTime * 2) * 0.2);
    }
}