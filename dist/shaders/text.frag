#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;
uniform sampler2D tMap;
uniform bool uMobile;
varying vec2 vUv;
void main() {
    vec3 tex = texture2D(tMap, vUv).rgb;
    float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
    float d = fwidth(signedDist);
    float alpha = smoothstep(-d, d, signedDist);
    if (alpha < 0.01) discard;
    if(uMobile) {
        gl_FragColor.rgb = vec3( (signedDist - 0.1)) * 5.;
    } else {
        gl_FragColor.rgb = vec3(1.) * signedDist * 5.;
        
    }

    gl_FragColor.a = alpha;
}

