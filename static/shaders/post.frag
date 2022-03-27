precision highp float;
varying vec2 vUv;
varying vec3 vNormal;
uniform bool uMobile;
uniform sampler2D tMap;
uniform sampler2D tMap1;
uniform sampler2D uVid;x
uniform vec2 u_mapResolution;
uniform float uLight;
uniform float uOpacity;
uniform float uTagOpacity;
uniform float uIntensity;
void main() {

    vec2 ratioVid = vec2(
      min(1./ (u_mapResolution.x / u_mapResolution.y), 1.0),
      min(1./ (u_mapResolution.y / u_mapResolution.x), 1.0)
    );
    vec2 vidUv = vec2(
     vUv.x * ratioVid.x + (1.0 - ratioVid.x) * 0.5,
      vUv.y * ratioVid.y + (1.0 - ratioVid.y) * 0.5
    );

    vec3 textPattern;
    if(uMobile) {
      textPattern = texture2D(uVid, ((vidUv + vec2(0., 0.))) * 1.4).rgb;
    } else {
      textPattern = texture2D(uVid, ((vidUv + vec2(-.25, -0.25))) * 1.8).rgb;
    }
    vec3 text1 = texture2D(tMap, vUv).rgb;
    vec3 text2 = texture2D(tMap1, vUv).rgb;
    float alpha1 = texture2D(tMap, vUv).a;
    float alpha2 = texture2D(tMap1, vUv).a;


    vec3 video = vec3(1.) - textPattern.rgb;
    //gl_FragColor.rgb = video;
    gl_FragColor.rgb = 
    text1 * (alpha1 - alpha2 + (alpha2 * alpha1) * textPattern.r * text2 ) +
    + (1.) * (alpha2 - text2.r)
    + (alpha2 - alpha1) * alpha2 * vec3(0.)
    + (alpha2 * alpha1) * video 
    ;

    gl_FragColor.a = alpha1 + alpha2 ;
    
    //gl_FragColor = vec4(vec3(10.), alpha2 - ( text2.r));
}
