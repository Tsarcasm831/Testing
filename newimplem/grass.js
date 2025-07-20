import * as THREE from 'three';

const grassVertexShader = `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vLighting;

    uniform vec3 sunDirection;
    uniform vec3 sunColor;
    uniform vec3 hemisphereSkyColor;

    // Simple pseudo-random function
    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
        vUv = uv;
        vec3 pos = position;

        // Sway animation, stronger at the top (uv.y == 1)
        float swayFactor = pow(uv.y, 2.5);
        float windSpeed = 1.5;
        float windStrength = 0.25;
        
        // Use instance position for noise seed to vary sway per blade
        vec3 instancePos = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        
        float noise = (random(instancePos.xz) - 0.5) * 2.0;
        float angle = sin(time * windSpeed + noise * 6.28) * windStrength * swayFactor;
        
        pos.x += angle;
        pos.z += cos(time * windSpeed * 0.8 + noise * 6.28) * windStrength * swayFactor * 0.5;

        vec4 modelPos = modelMatrix * instanceMatrix * vec4(pos, 1.0);
        vec4 viewPos = viewMatrix * modelPos;
        gl_Position = projectionMatrix * viewPos;

        // Simple diffuse lighting
        vec3 worldNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
        float NdotL = max(dot(worldNormal, sunDirection), 0.0);
        
        // Ambient light from hemisphere light
        float skyFactor = 0.5 + 0.5 * worldNormal.y;
        
        // Use a fixed, neutral ambient color to prevent unnatural tinting from the sky.
        vec3 neutralAmbientColor = vec3(0.6, 0.6, 0.65);
        vec3 ambient = neutralAmbientColor * skyFactor * 0.8;
        
        vec3 diffuse = sunColor * NdotL;

        vLighting = ambient + diffuse;
    }
`;

const grassFragmentShader = `
    uniform sampler2D map;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    varying vec2 vUv;
    varying vec3 vLighting;

    void main() {
        vec4 texColor = texture(map, vUv);
        if (texColor.a < 0.3) {
            discard;
        }

        vec3 finalColor = texColor.rgb * vLighting;
        
        // Apply fog
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(fogNear, fogFar, depth);
        finalColor = mix(finalColor, fogColor, fogFactor);

        // Set alpha to 1.0 for correct depth writing and fog blending with alphaTest
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;


export function createGrassMaterial(assets, sky) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: assets.grass_blade },
            time: { value: 0 },
            sunDirection: { value: sky.dirLight.position.clone().normalize() },
            sunColor: { value: sky.dirLight.color.clone() },
            hemisphereSkyColor: { value: sky.hemiLight.color.clone() },
            fogColor: { value: sky.scene.fog.color },
            fogNear: { value: sky.scene.fog.near },
            fogFar: { value: sky.scene.fog.far },
        },
        vertexShader: grassVertexShader,
        fragmentShader: grassFragmentShader,
        side: THREE.DoubleSide,
        transparent: false,
        alphaTest: 0.3,
    });

    // Periodically update lighting uniforms
    sky.onLightUpdate((dirLight, hemiLight) => {
        material.uniforms.sunDirection.value.copy(dirLight.position).normalize();
        material.uniforms.sunColor.value.copy(dirLight.color);
        material.uniforms.hemisphereSkyColor.value.copy(hemiLight.color);
    });

     // Periodically update fog uniforms
    sky.onFogUpdate((fog) => {
        material.uniforms.fogColor.value.copy(fog.color);
        material.uniforms.fogNear.value = fog.near;
        material.uniforms.fogFar.value = fog.far;
    });

    return material;
}