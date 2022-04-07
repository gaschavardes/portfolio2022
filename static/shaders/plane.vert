precision highp float;
attribute vec2 uv;
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float progress;
uniform float uYDistort;
uniform float uTime;
uniform float uZFact;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vMPos;

float pixelsize = 1.0;
float PI = 3.14159265359;

vec2 hash22(vec2 p) {
    p = p*mat2(127.1,311.7,269.5,183.3);
	p = -1.0 + 20.0 * fract(sin(p)*43758.5453123);
	return sin(p*5.283 + uTime);
}

float perlin_noise(vec2 p) {
	vec2 pi = floor(p);
    vec2 pf = p - pi;
    
    // interpolation
    vec2 w = pf * pf * (3.0 - 2.0 * pf);
    
    float f00 = dot(hash22(pi + vec2(0.0, 0.0)), pf - vec2(0.0, 0.0));
    float f01 = dot(hash22(pi + vec2(0.0, 1.0)), pf - vec2(0.0, 1.0));
    float f10 = dot(hash22(pi + vec2(1.0, 0.0)), pf - vec2(1.0, 0.0));
    float f11 = dot(hash22(pi + vec2(1.0, 1.0)), pf - vec2(1.0, 1.0));
    
    // mixing top & bottom edges
    float xm1 = mix(f00, f10, w.x);
    float xm2 = mix(f01, f11, w.x);
    
    // mixing to point
    float ym = mix(xm1, xm2, w.y); 
    
    return ym;
}

float fBM2(float size, int octaves, float persistence, float scale, vec2 coord) {
    float c = 0.0;
    float p = 1.0;
    float n = p;
    
    for (int i = 1; i <= 1; i++) {
        c += perlin_noise(coord * size) * p * 3.;
        n    += p;
        size *= scale;
        p    *= persistence;
    }
    // normalize c
    c /= n;
    
    return c;
}

vec3 orthogonal(vec3 v) {
        return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
        : vec3(0.0, -v.z, v.y));
      }

// photoshop blend modes: https://www.shadertoy.com/view/XdS3RW
vec4 blend_lighten(vec4 s, vec4 d) {
    return max(s,d);
}

void main() {
     vUv = uv;
    // noise-based reflections
	  float n = fBM2(6.0, 3, 0.5, 2.5, vec2(vUv.x, vUv.y) * 0.2);
    //  tweak the reflection curve
    n = sin(n * PI/.8) * abs(pow(progress, 12.));

    vec3 newPos = position;
    newPos.z = position.z + n * uZFact;
    newPos.y = position.y - n * uYDistort;

    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
} 