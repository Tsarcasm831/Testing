uniform sampler2D grassTexture;
uniform sampler2D sandTexture;
varying vec2 vUv;
void main() {
  vec4 grass = texture2D(grassTexture, vUv);
  vec4 sand = texture2D(sandTexture, vUv);
  gl_FragColor = mix(grass, sand, vUv.y);
}
