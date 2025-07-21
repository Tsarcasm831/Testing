export const terrainVertexShader = `
    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;
    varying float vNoise;
    varying float vTemperature;
    varying float vMoisture;
    
    // Using a simple noise function in the shader
    // https://www.shadertoy.com/view/4sfGzS
    float simpleNoise(vec3 p) {
        vec3 ip = floor(p);
        vec3 fp = fract(p);
        fp = fp*fp*(3.0-2.0*fp);
        vec2 tap = (ip.xy+vec2(37.0,17.0)*ip.z) + fp.xy;
        vec2 o = floor(tap);
        o = mod(o, 289.0);
        vec4 T = floor(o.x*vec4(1.0, 1.0, 1.0, 0.0) + o.y*vec4(1.0, 1.0, 1.0, 0.0) + vec4(0.0, 1.0, 289.0, 290.0));
        vec4 V = mod(T, 289.0);
        V = V / 289.0;
        V = fract(V*exp2(8.5));
        return dot(V.xz, fp.yx*fp.yx*(3.0-2.0*fp.yx));
    }

    // FBM function for more complex noise
    float fbm(vec3 p) {
        float total = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 4; i++) {
            total += simpleNoise(p) * amplitude;
            p *= 2.0;
            amplitude *= 0.5;
        }
        return total;
    }

    void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        
        // Add a bit of noise to the height for color blending variation
        vNoise = simpleNoise(vWorldPosition * 0.1) * 4.0;

        // Pass biome noise values to fragment shader
        vTemperature = fbm(worldPos.xyz / 2000.0 + vec3(30.0));
        vMoisture = fbm(worldPos.xyz / 1500.0 + vec3(100.0));


        gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
`;

export const terrainFragmentShader = `
    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;
    varying float vNoise;
    varying float vTemperature;
    varying float vMoisture;

    uniform sampler2D sandTexture;
    uniform sampler2D grassTexture;
    uniform sampler2D dirtTexture;
    uniform sampler2D rockTexture;
    uniform sampler2D snowTexture;
    uniform sampler2D badlandsTexture;
    
    uniform sampler2D sandNormal;
    uniform sampler2D grassNormal;
    uniform sampler2D dirtNormal;
    uniform sampler2D rockNormal;
    uniform sampler2D snowNormal;
    uniform sampler2D badlandsNormal;

    uniform vec3 sunDirection;
    uniform vec3 sunColor;
    uniform vec3 hemisphereSkyColor;
    
    uniform float textureScale;

    // Tri-planar mapping function
    vec4 triplanar(sampler2D tex, sampler2D normalMap, vec3 worldPos, vec3 worldNormal) {
        vec3 scaledPos = worldPos / textureScale;
        
        vec3 blendWeights = abs(worldNormal);
        blendWeights = normalize(max(blendWeights, 0.00001));

        // Blend contributions from all three axes
        vec4 totalColor = vec4(0.0);
        vec4 totalNormal = vec4(0.0);

        // X-axis
        vec2 uvX = scaledPos.zy;
        float weightX = blendWeights.x;
        totalColor += texture(tex, uvX) * weightX;
        totalNormal += texture(normalMap, uvX) * weightX;

        // Y-axis
        vec2 uvY = scaledPos.xz;
        float weighty = blendWeights.y;
        totalColor += texture(tex, uvY) * weighty;
        totalNormal += texture(normalMap, uvY) * weighty;

        // Z-axis
        vec2 uvZ = scaledPos.xy;
        float weightZ = blendWeights.z;
        totalColor += texture(tex, uvZ) * weightZ;
        totalNormal += texture(normalMap, uvZ) * weightZ;
        
        return vec4(totalColor.rgb, (totalNormal.r + totalNormal.g + totalNormal.b)/3.0);
    }
    
    vec4 triplanarSample(vec3 worldPos, vec3 worldNormal, sampler2D tex, sampler2D norm) {
        vec3 blendWeights = abs(worldNormal);
        blendWeights = blendWeights*blendWeights*blendWeights;
        blendWeights = blendWeights / (blendWeights.x + blendWeights.y + blendWeights.z);

        vec3 scaledPos = worldPos / textureScale;

        vec4 cX = texture(tex, scaledPos.yz); vec4 nX = texture(norm, scaledPos.yz);
        vec4 cY = texture(tex, scaledPos.xz); vec4 nY = texture(norm, scaledPos.xz);
        vec4 cZ = texture(tex, scaledPos.xy); vec4 nZ = texture(norm, scaledPos.xy);

        vec4 diffuseColor = cX * blendWeights.x + cY * blendWeights.y + cZ * blendWeights.z;
        vec4 normalColor = nX * blendWeights.x + nY * blendWeights.y + nZ * blendWeights.z;

        return vec4(diffuseColor.rgb, normalColor.g); // pack normal into alpha
    }


    float getBlend(float h, float lower, float upper) {
        return smoothstep(lower, upper, h);
    }

    void main() {
        float height = vWorldPosition.y + vNoise;
        float slope = 1.0 - vWorldNormal.y;
        
        vec4 sand = triplanarSample(vWorldPosition, vWorldNormal, sandTexture, sandNormal);
        vec4 grass = triplanarSample(vWorldPosition, vWorldNormal, grassTexture, grassNormal);
        vec4 dirt = triplanarSample(vWorldPosition, vWorldNormal, dirtTexture, dirtNormal);
        vec4 rock = triplanarSample(vWorldPosition, vWorldNormal, rockTexture, rockNormal);
        vec4 snow = triplanarSample(vWorldPosition, vWorldNormal, snowTexture, snowNormal);
        vec4 badlands = triplanarSample(vWorldPosition, vWorldNormal, badlandsTexture, badlandsNormal);

        // --- Biome-based Texture Blending ---
        float temp = vTemperature;
        float moist = vMoisture;

        // Base texture
        vec4 finalColor;

        // Determine base texture based on biome
        if (temp < 0.35) { // Cold
            if (moist < 0.4) finalColor = snow; // Tundra
            else finalColor = mix(snow, dirt, 0.5); // Taiga ground
        } else if (temp < 0.65) { // Temperate
            if (moist < 0.3) finalColor = dirt; // Plains
            else finalColor = grass; // Forest/Hills
        } else { // Hot
            if (moist < 0.3) finalColor = sand; // Desert
            else if (moist < 0.5) finalColor = badlands; // Badlands
            else finalColor = mix(grass, dirt, 0.7); // Jungle floor
        }

        // --- Layering based on height and slope ---
        // Blend sand near water level
        float sandFactor = 1.0 - getBlend(height, 0.5, 5.0);
        finalColor = mix(finalColor, sand, sandFactor);

        // Blend dirt on non-steep, mid-altitude areas (override grass)
        float dirtFactor = getBlend(height, 40.0, 50.0) * (1.0-getBlend(slope, 0.3, 0.4));
        if(temp >= 0.35) { // Don't put dirt over snow
             finalColor = mix(finalColor, dirt, dirtFactor);
        }

        // Blend rock on steep slopes
        float rockFactor = getBlend(slope, 0.3, 0.6);
        finalColor = mix(finalColor, rock, rockFactor);
        
        // Blend snow at high altitudes
        float snowFactor = getBlend(height, 80.0, 95.0);
        finalColor = mix(finalColor, snow, snowFactor);


        // --- Lighting Calculation ---
        vec3 N = vWorldNormal; // For now, use vertex normal. A decoded normal map would go here.
        
        // Ambient light
        // Use a fixed, neutral ambient color to avoid tinting from the sky.
        vec3 neutralAmbientColor = vec3(0.55, 0.55, 0.6);
        vec3 ambient = neutralAmbientColor * 0.5;

        // Diffuse light
        float NdotL = max(dot(N, sunDirection), 0.0);
        vec3 diffuse = sunColor * NdotL;

        // Combine lighting
        vec3 lighting = ambient + diffuse;
        
        vec3 finalFragColor = finalColor.rgb * lighting;

        gl_FragColor = vec4(finalFragColor, 1.0);
        gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0/2.2)); // Gamma correction
    }
`;