import * as THREE from 'three';

const scatterVertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;

    void main() {
        vUv = uv;
        
        vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        vWorldNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
        
        gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
`;

const scatterFragmentShader = `
    uniform sampler2D map; // Now will be rock texture
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    
    uniform vec3 sunDirection;
    uniform vec3 sunColor;
    uniform vec3 hemisphereSkyColor;

    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;

    vec3 getTriplanarColor(vec3 worldPos, vec3 worldNormal, sampler2D tex) {
        vec3 blendWeights = pow(abs(worldNormal), vec3(2.0));
        blendWeights /= dot(blendWeights, vec3(1.0));

        vec3 scaledPos = worldPos / 5.0; // Use a scale appropriate for small rocks

        vec3 cX = texture(tex, scaledPos.yz).rgb;
        vec3 cY = texture(tex, scaledPos.xz).rgb;
        vec3 cZ = texture(tex, scaledPos.xy).rgb;
        
        return cX * blendWeights.x + cY * blendWeights.y + cZ * blendWeights.z;
    }


    void main() {
        vec3 diffuseColor = getTriplanarColor(vWorldPosition, vWorldNormal, map);
        vec3 N = normalize(vWorldNormal);
        
        // --- Lighting Calculation ---
        // Ambient light from hemisphere light
        vec3 neutralAmbientColor = vec3(0.6, 0.6, 0.65);
        vec3 ambient = neutralAmbientColor * 0.6;
        
        // Diffuse light
        float NdotL = max(dot(N, sunDirection), 0.0);
        vec3 diffuse = sunColor * NdotL;

        vec3 litColor = diffuseColor * (ambient + diffuse);
        
        // Apply fog
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(fogNear, fogFar, depth);
        vec3 finalColor = mix(litColor, fogColor, fogFactor);

        // Gamma correction
        finalColor = pow(finalColor, vec3(1.0/2.2));

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;


export function createScatterRockMaterial(assets, sky) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: assets.rock }, // Use main rock texture
            sunDirection: { value: sky.dirLight.position.clone().normalize() },
            sunColor: { value: sky.dirLight.color.clone() },
            hemisphereSkyColor: { value: sky.hemiLight.color.clone() },
            fogColor: { value: sky.scene.fog.color },
            fogNear: { value: sky.scene.fog.near },
            fogFar: { value: sky.scene.fog.far },
        },
        vertexShader: scatterVertexShader,
        fragmentShader: scatterFragmentShader,
        side: THREE.DoubleSide,
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