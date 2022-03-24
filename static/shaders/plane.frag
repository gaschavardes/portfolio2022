precision highp float;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vMPos;
uniform vec2 u_mapResolution;
uniform vec2 u_resolution;
uniform sampler2D tMap;
uniform sampler2D tMap1;
uniform sampler2D tNormal;
uniform float uNormalScale;
uniform float uNormalUVScale;

void main() {
    vec2 ratioImg = vec2(
    min((u_resolution.x / u_resolution.y) / (u_mapResolution.x / u_mapResolution.y), 1.0),
    min((u_resolution.y / u_resolution.x) / (u_mapResolution.y / u_mapResolution.x), 1.0)
  );
 
  vec2 uv = vec2(
    vUv.x * ratioImg.x + (1.0 - ratioImg.x) * 0.5,
    vUv.y * ratioImg.y + (1.0 - ratioImg.y) * 0.5
  );

  vec4 texture = texture2D( tMap, vUv);

	gl_FragColor = texture;
 
}