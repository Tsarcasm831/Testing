export const leafVertexShader = `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vLighting;
    varying vec3 vWorldPosition;

    uniform vec3 sunDirection;
    uniform vec3 sunColor;
    uniform vec3 hemisphereSkyColor;

    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
        vUv = uv;
        vec3 pos = position;

        float swayFactor = pow(uv.y, 2.0); // Sway more at the tip
        float windSpeed = 1.0;
        float windStrength = 0.15;
        
        vec3 instancePos = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        
        float noise = (random(instancePos.xz) - 0.5) * 2.0;
        float angle = sin(time * windSpeed + noise * 6.28) * windStrength * swayFactor;
        
        pos.x += angle;
        pos.z += cos(time * windSpeed * 0.8 + noise * 6.28) * windStrength * swayFactor * 0.5;

        vec4 modelPos = modelMatrix * instanceMatrix * vec4(pos, 1.0);
        vWorldPosition = modelPos.xyz;
        vec4 viewPos = viewMatrix * modelPos;
        gl_Position = projectionMatrix * viewPos;

        vec3 worldNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
        float NdotL = max(dot(worldNormal, sunDirection), 0.0);
        
        float skyFactor = 0.5 + 0.5 * worldNormal.y;
        
        // Use a fixed, neutral ambient color to prevent unnatural tinting from the sky.
        vec3 neutralAmbientColor = vec3(0.6, 0.6, 0.65);
        vec3 ambient = neutralAmbientColor * skyFactor * 0.6;
        
        vec3 diffuse = sunColor * NdotL;

        vLighting = ambient + diffuse;
    }
`;

export const leafFragmentShader = `
    uniform sampler2D map;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    varying vec2 vUv;
    varying vec3 vLighting;
    varying vec3 vWorldPosition;

    void main() {
        vec4 texColor = texture(map, vUv);
        if (texColor.a < 0.5) {
            discard;
        }

        vec3 finalColor = texColor.rgb * vLighting;
        
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(fogNear, fogFar, depth);
        finalColor = mix(finalColor, fogColor, fogFactor);

        // Gamma correction
        finalColor = pow(finalColor, vec3(1.0/2.2));

        // Set alpha to 1.0 for correct depth writing and fog blending with alphaTest
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

export const trunkVertexShader = `
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

export const trunkFragmentShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;

    uniform sampler2D trunkTexture;
    
    uniform vec3 sunDirection;
    uniform vec3 sunColor;
    uniform vec3 hemisphereSkyColor;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    void main() {
        // OPTIMIZATION: Switched from expensive tri-planar mapping to standard UV mapping.
        // Swap U and V to rotate texture and make rings wrap horizontally.
        vec3 diffuseColor = texture(trunkTexture, vUv.yx).rgb;

        // Lighting
        vec3 N = normalize(vWorldNormal);
        
        // Use a fixed, neutral ambient color to avoid tinting from the sky.
        vec3 neutralAmbientColor = vec3(0.6, 0.6, 0.65);
        vec3 ambient = neutralAmbientColor * 0.6;

        float NdotL = max(dot(N, sunDirection), 0.0);
        vec3 diffuse = sunColor * NdotL;
        vec3 lighting = ambient + diffuse;
        
        vec3 litColor = diffuseColor * lighting;

        // Fog
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(fogNear, fogFar, depth);
        vec3 finalColor = mix(litColor, fogColor, fogFactor);
        
        gl_FragColor = vec4(finalColor, 1.0);
        gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0/2.2));
    }
`;