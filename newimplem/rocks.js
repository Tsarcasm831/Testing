import * as THREE from 'three';

const rockVertexShader = `
    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;

    void main() {
        vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        vWorldNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
`;

const rockFragmentShader = `
    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;

    uniform sampler2D rockTexture;
    uniform sampler2D rockNormalMap;
    
    uniform vec3 sunDirection;
    uniform vec3 sunColor;
    uniform vec3 hemisphereSkyColor;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    uniform float textureScale;

    // A simplified tri-planar mapping for normals that works without complex TBN matrices.
    // It perturbs the world normal based on the normal map texture.
    vec3 getTriplanarNormal(vec3 worldPos, vec3 worldNormal, sampler2D normalMap) {
        vec3 blendWeights = pow(abs(worldNormal), vec3(2.0));
        blendWeights /= dot(blendWeights, vec3(1.0));

        vec3 scaledPos = worldPos / textureScale;

        // Sample normal maps from 3 axes
        vec3 nX = (texture(normalMap, scaledPos.yz).rgb * 2.0 - 1.0);
        vec3 nY = (texture(normalMap, scaledPos.xz).rgb * 2.0 - 1.0);
        vec3 nZ = (texture(normalMap, scaledPos.xy).rgb * 2.0 - 1.0);

        // Perturb the world normal by the blended normal map values
        // This is not physically accurate but gives a good visual result for noisy surfaces like rock.
        vec3 blendedNormal = nX * blendWeights.x + nY * blendWeights.y + nZ * blendWeights.z;
        return normalize(vWorldNormal + blendedNormal * 0.5);
    }
    
    vec3 getTriplanarColor(vec3 worldPos, vec3 worldNormal, sampler2D tex) {
        vec3 blendWeights = pow(abs(worldNormal), vec3(2.0));
        blendWeights /= dot(blendWeights, vec3(1.0));

        vec3 scaledPos = worldPos / textureScale;

        vec3 cX = texture(tex, scaledPos.yz).rgb;
        vec3 cY = texture(tex, scaledPos.xz).rgb;
        vec3 cZ = texture(tex, scaledPos.xy).rgb;
        
        return cX * blendWeights.x + cY * blendWeights.y + cZ * blendWeights.z;
    }

    void main() {
        vec3 diffuseColor = getTriplanarColor(vWorldPosition, vWorldNormal, rockTexture);
        vec3 N = getTriplanarNormal(vWorldPosition, vWorldNormal, rockNormalMap);

        // --- Lighting Calculation ---
        // Ambient light
        // Use a fixed, neutral ambient color to avoid tinting from the sky.
        vec3 neutralAmbientColor = vec3(0.6, 0.6, 0.65);
        vec3 ambient = neutralAmbientColor * 0.6;

        // Diffuse light
        float NdotL = max(dot(N, sunDirection), 0.0);
        vec3 diffuse = sunColor * NdotL;

        vec3 lighting = ambient + diffuse;
        
        vec3 litColor = diffuseColor * lighting;

        // Apply fog
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(fogNear, fogFar, depth);
        
        // Desaturate the fog color to avoid tinting the rocks blue
        float fogLuminance = dot(fogColor, vec3(0.299, 0.587, 0.114));
        vec3 desaturatedFogColor = mix(fogColor, vec3(fogLuminance), 0.75); // strong desaturation

        vec3 finalColor = mix(litColor, desaturatedFogColor, fogFactor);
        
        gl_FragColor = vec4(finalColor, 1.0);
        gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0/2.2)); // Gamma correction
    }
`;


export function createRockMaterial(assets, sky) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            // Use the main rock textures, not the scatter image
            rockTexture: { value: assets.rock },
            rockNormalMap: { value: assets.rock_normal },
            textureScale: { value: 5.0 }, // Smaller scale for more detail on rocks

            sunDirection: { value: sky.dirLight.position.clone().normalize() },
            sunColor: { value: sky.dirLight.color.clone() },
            hemisphereSkyColor: { value: sky.hemiLight.color.clone() },
            fogColor: { value: sky.scene.fog.color },
            fogNear: { value: sky.scene.fog.near },
            fogFar: { value: sky.scene.fog.far },
        },
        vertexShader: rockVertexShader,
        fragmentShader: rockFragmentShader,
        side: THREE.DoubleSide // Ensure collision works even if player passes through in one frame
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