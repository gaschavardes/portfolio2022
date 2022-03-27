<template>
  <div class="tpl-home">
     <button class="about-btn" @click="toggleAbout">
      <span :class='{show : !isAbout }' v-html="spanify('about')"></span>
      <span :class='{show : isAbout }' v-html="spanify('close')"></span>
    </button>
    <div class="first-screen" :class='{isAbout : isAbout }' >
      <h1 :class='{show : !scrollBegin || isAbout }' v-html="spanify('Gaspard Chavardes')"></h1>
      <p :class='{show : !scrollBegin || isAbout }' v-html="spanify('Creative developper', true, 0.02)">Creative developper</p>
      <transition name="fade" >
        <div class="content" v-show="isAbout" >
          <div class="description">
            <p> Hi there !</p>
            <p> I'm Gaspard, a french creative developper working in Paris. I enjoy working on innovative projects that shape the way people see brands or institutions.</p>
            <p>Always reducing the gap between 3D immersive experiments and institutional or e-commerce websites in order to create an emotional impact while providing the best user experience possible.</p>
            <p>Currently working at Hands Agency, I had the chance to work previously at Hello Monday ands 84 Paris.</p>
            <p>Feel free to ping me for some freelance work ! </p>
          </div>
        
          <ul>
            <li><a href="mailto:chavardes.gaspard@gmail.com">Contact</a></li>
            <li><a href=""></a> </li>
            <li></li>
          </ul>
        </div>
      </transition>
    
      <button class="scroll-cta" @click="scrollTo" :class='{show : !scrollBegin && !isAbout }'>Scroll to the projects</button>
    </div>
    <video ref='video' :src='videoFile' muted='true' autoplay='true' loop="true"></video>
    <video ref='projectVideo' v-for="(el, i) in videos" :key="i" :src="`/video/${el}.mp4`"  muted='true' autoplay='true' loop="true"></video>
    <!-- <img :src="require(`../../static/images/${datas.projects[0].image}`)" alt=""> -->

    <button class='scrollTop' :class='{show : isEnd }' @click="scrollTop">scroll top</button>
  </div>
</template>



<script>
import './style.less'
import planeFrag from '@/static/shaders/plane.frag'
import planeVert from '@/static/shaders/plane.vert'
import textFrag from '@/static/shaders/text.frag'
import textVert from '@/static/shaders/text.vert'
import postFrag from '@/static/shaders/post.frag'
import postVert from '@/static/shaders/post.vert'
import SplitText from '../../assets/js/_libs/greensock/SplitText'
import {Texture, Plane, Mesh, Program, Vec2, Geometry, Text, RenderTarget, Triangle, Raycast }  from 'ogl'
import Emitter from 'event-emitter'
import Data from '@/assets/data/data.json'
import Bowser from 'bowser'
import gsap, {Power2} from 'gsap'

import pattern from '@/static/video/text-pattern.mp4'
import airshifumi from '@/static/video/text-pattern.mp4'
import plane from '@/static/model/plane.json'

const vertexNull = /* glsl */ `
    attribute vec3 position;
    attribute vec3 normal;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

const fragmentNull = /* glsl */ `
    precision highp float;
    varying vec3 vNormal;
    void main() {
        vec3 normal = normalize(vNormal);
        float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));
        gl_FragColor.rgb = vec3(0.);
        gl_FragColor.a = 0.;
    }
`

export default {
  name: 'Home',
  data(){
    return {
      time: 0,
      datas: Data,
      introEnded: true,
      isEnd: false,
      scrollBegin: true,
      scroll: 0,
      scrollTarget: 0,
      planes: [],
      texts: [],
      videos: [],
      videoFile: pattern,
      isAbout: false
    }
  },
  mounted() {
    // this.splitTexts()
    this.emitter = {}
    Emitter(this.emitter)
    this.on = this.emitter.on.bind(this.emitter)
    this.off = this.emitter.off.bind(this.emitter)
    this.isMobile = Bowser.getParser(window.navigator.userAgent).parsedResult.platform.type !== 'desktop'
    this.initOgl()
    window.addEventListener('wheel', this.scrollListen.bind(this), false, false)
    
    let vh = window.innerHeight * 0.01
    document.querySelector('body').style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      vh = window.innerHeight * 0.01
      this.$el.style.setProperty('--vh', `${vh}px`)
    })
    import('../../assets/js/mouse').then((el) => {
      this.Mouse = el.default
      
      // this.scrollTarget = 2500 * (this.datas.projects.length) 
      // this.scroll = 2500 * (this.datas.projects.length) 
      // gsap.to(this, { scroll : -2500, delay: 4, duration: 3, ease: Power2.easeInOut, onComplete: () => {
      //   this.scrollTarget = -2500
      // }})
      gsap
      if(this.isMobile){
        this.Mouse.on('drag', (e) => {
            this.scrollListen(e)
          })
      }
      this.Mouse.on('move', () => {

      })
    })
  },
  methods: {
    // splitTexts () {
    //   this.split = new SplitText(('.to-split'), {type: 'chars', charsClass:"char"} )
    //   console.log(this.split)
    //   this.split.elements.forEach(el => {
    //     console.log(el.children)
    //     Array.from(el.children).forEach((char, i) => {
    //       char.style.transitionDelay = i * 0.05 + 's'
    //     })
    //   })
    toggleAbout() {
      this.isAbout = !this.isAbout
    },
    spanify (text, inline, delay = 0.04 ) {
      const t = text.split(' ')
      let out = ''
      let tmp = 0
      t.forEach((l) => {
        out += ' <span class="word"> '
        const w = l.split('')
        w.forEach((c, i) => {
          out += `<span class='char-container'><span style="transition-delay:${inline ? tmp * delay : i * delay }s" class="char">`
          out += c
          out += '</span></span>'
          tmp++
        })
        out += '</span>'
      })

      return out
    },
        // this.$refs.title.querySelectorAll('span').forEach(el => {
        //   el.querySelectorAll('div').forEach((elm,i) => {
        //        elm.style.transitionDelay = i * 0.05 + 's'
        //   })
        // })
    initOgl() {
       import('../../assets/js/mainScene').then((el) => {
        this.Scene = el.default
        this.raycast = new Raycast(this.Scene.gl);
        this.Scene.init()
        this.Scene.resume()
        // this.initOgl()
        requestAnimationFrame(() => {
          this.target = new RenderTarget(this.Scene.gl, {
          width: 4096,
          height: 4096
        })
        this.target1 = new RenderTarget(this.Scene.gl, {
          width: 4096,
          height: 4096
        })

        this.videoTexture = new Texture(this.Scene.gl, {
          generateMipmaps: false,
          width: 4096,
          height: 4096,
        })
          this.initNull()
          this.initNull1()
          this.initPlanes()
          this.initTexts()
          this.setPost()
          import('../../assets/js/Raf').then((el) => {
            this.Raf = el.default
            this.Raf.suscribe('home', () => { this.update()})
          })
        })
      })
      this.mouse = new Vec2();
      document.addEventListener('mousemove', this.move.bind(this), false);
      document.addEventListener('touchmove', this.move.bind(this), false);
    },
      initNull () {
    const program = new Program(this.Scene.gl, {
      vertex: vertexNull,
      fragment: fragmentNull,
      cullFace: null,
      transparent: true
    })
    const geometry = new Plane(this.Scene.gl)
    this.null = new Mesh(this.Scene.gl, { geometry, program })
    this.null.position.set(0, 0, -1)
    // this.null.setParent(this.scene)
  },

  initNull1 () {
    const program = new Program(this.Scene.gl, {
      vertex: vertexNull,
      fragment: fragmentNull,
      cullFace: null,
      transparent: true
    })
    const geometry = new Plane(this.Scene.gl)
    this.null1 = new Mesh(this.Scene.gl, { geometry, program })
    this.null1.position.set(0, 0, 0)
    // this.null.setParent(this.scene)
  },
    initPlanes(){
      this.planeGeometry = new Plane(this.Scene.gl, {
        widthSegments: 200,
        heightSegments: 200
      })

      this.datas.projects.forEach((el, i) => {
      let texture = new Texture(this.Scene.gl)
      
      let img = new Image()
      img.src = require(`../../static/images/${el.image}`)
      img.onload = () => {
        let planeProgram = new Program(this.Scene.gl, {
          vertex: planeVert,
          fragment: planeFrag,
          cullFace: false,
          transparent: true,
          uniforms: {
            progress: { value: 1 },
            tMap: {
            },
            u_mapResolution: {
              value: new Vec2(window.innerWidth, window.innerHeight)
            },
            u_resolution: {
              value: new Vec2(0, 0)
            },
            uOpacity: {
              value: 0
            },
            uZFact: {
              value: 0.1
            },
            uNormalScale: { value: 2 },
            uNormalUVScale: { value: 1 },
            uTime: {
              value: this.time
            }
          }
        })
        texture.image = img
        planeProgram.uniforms.tMap.value = texture
        planeProgram.uniforms.u_resolution.value = new Vec2(img.naturalWidth, img.naturalHeight)
      // REPLACE BY VECTORED PLANE
     
      let mesh = new Mesh(this.Scene.gl, {
        geometry: this.planeGeometry,
        program: planeProgram
      })
      mesh.initTime = Math.random() * 30
      // mesh.position.set(0, 0, -0.207)
      mesh.position.set(0, 0, 0)
      mesh.targetFact = 0.1
      mesh.link = el.link
      // mesh.rotation.set(0.8, 0, 0)
      let scale = this.isMobile ? 1 : 1.2
      scale = 1.2
      mesh.scale.set(scale, scale * (img.naturalHeight / img.naturalWidth), 1)
      mesh.setParent(this.null)
      mesh.index = i
      this.plane = mesh
      this.planes[i] = mesh
      this.planes.link = el.link
      this.planes[i].radius = -i*2.5
      mesh.onBeforeRender(this.updateHitUniform);

      if(el.type === 'video') {
        this.videos.push(el.media)
        this.planes[i].video =  this.videos.length
        setTimeout(() => {
          let videoSize = this.$refs.projectVideo[0].getBoundingClientRect()
          planeProgram.uniforms.u_resolution.value = new Vec2(videoSize.width, videoSize.height)
          mesh.scale.set(scale, scale * (videoSize.height / videoSize.width) , 1)
        }, 300)
      } 
      this.emitter.emit('plane-created')
      }
      // this.texture2 = new Texture(this.Scene.gl)
      
      });
    },
    initTexts() {
      this.textureFont = new Texture(this.Scene.gl), {
        generateMipmaps: false,
      }
       let img = new Image()
      img.src = require(`../../static/3DFont/Oswald-Bold.png`)
      img.onload = () => {
        this.textureFont.image = img
      }
      
      const program = new Program(this.Scene.gl, {
        // Get fallback shader for WebGL1 - needed for OES_standard_derivatives ext
        vertex: textVert,
        fragment: textFrag,
        uniforms: {
            tMap: { value: this.textureFont },
            uMobile: { value: this.isMobile}
        },
        transparent: true,
        cullFace: null,
        depthWrite: false,
      });
      this.datas.projects.forEach((el, i) => {
        const font = require('../../static/3DFont/Oswald-Bold-msdf.json');
        const text = new Text({
            font,
            text: el.name.toUpperCase(),
            width:  1.3,
            align: 'center',
            letterSpacing: 0,
            size:  0.2,
            lineHeight: 1.1,
        });
        // Pass the generated buffers into a geometry
        const geometry = new Geometry(this.Scene.gl, {
            position: { size: 3, data: text.buffers.position },
            uv: { size: 2, data: text.buffers.uv },
            // id provides a per-character index, for effects that may require it
            id: { size: 1, data: text.buffers.id },
            index: { data: text.buffers.index },
        });
        

        const mesh = new Mesh(this.Scene.gl, { geometry, program });
        this.texts[i] = mesh
        this.texts[i].radius =  i * 2.5
        this.texts[i].height = text.height * 0.5
        // Use the height value to position text vertically. Here it is centered.
        mesh.position.y = text.height * 0.5;
        mesh.position.x = i * 2.5
        mesh.setParent(this.null1);
      })
    },

    move(e) {
      if(this.isAbout) return
      this.mouse.set(2.0 * (e.x / this.Scene.renderer.width) - 1.0, 2.0 * (1.0 - e.y / this.Scene.renderer.height) - 1.0);
      this.raycast.castMouse(this.Scene.camera, this.mouse);

      // Just for the feedback in this example - reset each mesh's hit to false
      this.planes.forEach((mesh) => {
        mesh.isHit = false
        mesh.targetFact = 0.1
      });

      // raycast.intersectBounds will test against the bounds of each mesh, and
      // return an array of intersected meshes in order of closest to farthest
      const hits = this.raycast.intersectBounds(this.planes);

      // Can intersect with geometry if the bounds aren't enough, or if you need
      // to find out the uv or normal value at the hit point.
      // Optional arguments include backface culling `cullFace`, and `maxDistance`
      // Both useful for doing early exits to help optimise.
      // const hits = raycast.intersectMeshes(meshes, {
      //     cullFace: true,
      //     maxDistance: 10,
      //     includeUV: true,
      //     includeNormal: true,
      // });
      // if (hits.length) console.log(hits[0].hit.uv);

      // Update our feedback using this array
      this.currenLink = null
      if(hits.length === 0) {
        this.$el.classList.remove('clickable')
        this.hoverItem = undefined
      }
      hits.forEach((mesh) => {
        mesh.isHit = true
        this.currenLink = mesh.link
        this.hoverItem = mesh.index
        mesh.targetFact = 0.3
        this.$el.classList.add('clickable')
      });
    },

    setPost(){
    

    const geometry = new Triangle(this.Scene.gl)
    const texture = new Texture(this.Scene.gl, {
      generateMipmaps: false
    })
    this.postProgram = new Program(this.Scene.gl, {
      vertex: postVert,
      fragment: postFrag,
      cullFace: null,
      transparent: true,
      uniforms: {
        tMap: { value: this.target.texture },
        tMap1: { value: this.target1.texture },
        uVid: {value: this.videoTexture},
        uLight: { value: -0.5 },
        uOpacity: { value: -0.5 },
        uMobile: { value: this.isMobile},
        u_mapResolution: {
          value: new Vec2( window.innerHeight, window.innerWidth)
        },
        // tMap1: {
        //   value: this.target1.textures[0]
        // },
      }
    })
    this.post = new Mesh(this.Scene.gl, {
      geometry,
      program: this.postProgram
    })
    this.post.texture = texture
    this.post.setParent(this.Scene.scene)
    },

  scrollListen (e) {
    if(!this.introEnded || this.isAbout) return
    if (e && this.isMobile ) {
        if(e.dragedVal){
          console.log(e.velocity[1])
          this.scrollTarget += -e.velocity[1] * 1300
        }
    } else { this.scrollTarget += e.deltaY }
    if (this.scrollTarget <= -2000) {
      this.scrollTarget = -2000
      this.scrollBegin = false
    } else if(this.scrollTarget >= 2500 * (this.datas.projects.length - 1) ){
      this.scrollTarget = 2500 * (this.datas.projects.length - 1) 
      this.isEnd = true
    } else {
      this.scrollBegin = true
      this.isEnd = false
    }
    this.showLink = this.scroll > this.maxScroll
  },

  scrollTop() {
    this.isEnd = false
    gsap.to(this, { scroll : -4000, duration: 3, ease: Power2.easeInOut, onComplete: () => {
        this.scrollTarget = -2000
        this.scrollBegin = false
      }})
  },
   scrollTo() {
    this.scrollBegin = true
    gsap.to(this, { scroll : 0, duration: 1, ease: Power2.easeInOut, onUpdate: () => {
          this.scrollTarget = this.scroll
      }})
  },
    
    update() {
      this.time++
      let tmp = this.scrollTarget - this.scroll
      tmp *= 0.1
      this.scroll += tmp

      let progress = this.scroll * 0.001
      let angle = 0.1 - Math.sin(this.scroll * 0.0002) * 0.2
      
      this.planes.forEach( el => {
        el.position.y = (el.radius + progress) * Math.cos(angle) - this.Mouse.dampedCursor[1] * 0.01
        el.position.x = (el.radius + progress) * Math.sin(angle) + this.Mouse.dampedCursor[0] * 0.01
        el.rotation.z = -angle


        let fact = el.targetFact - el.program.uniforms.uZFact.value
        fact *= 0.1
        el.program.uniforms.uZFact.value += fact

        //el.position.z = (el.position.z) - (el.position.z - el.targetPos ) * 0.1
        el.program.uniforms.uTime.value = this.time * 0.01
        if(el.video) {
          el.program.uniforms.tMap.value.image = this.$refs.projectVideo[el.video - 1]
          el.program.uniforms.tMap.value.needsUpdate = true
        }
      })
      this.texts.forEach( (el, i) => {
        // el.position.x = Math.pow(el.initialPos - progress, 1)

        // el.position.y = (el.radius + progress) * Math.cos(0.1)
        el.position.x = (el.radius - progress) * Math.cos(angle * 0.5) + this.Mouse.dampedCursor[0] * 0.02
        el.position.y = (el.radius - progress) * Math.sin(angle * 0.5) + el.height - this.Mouse.dampedCursor[1] * 0.02
        el.rotation.z = angle * 0.5
        
        let scale
        if(i === this.hoverItem)  {
          scale = 0.4 - el.position.z
          scale *= 0.1
          el.position.z += scale
        } else {
          scale = 0.2 - el.position.z
          scale *= 0.1
          el.position.z += scale
        }
       
      })

      this.Scene.renderer.render({
        scene: this.null,
        camera: this.Scene.camera,
        target: this.target
      })
      this.Scene.renderer.render({
        scene: this.null1,
        camera: this.Scene.camera,
        target: this.target1
      })

      // this.planeProgram.uniforms.uTime.value = this.time * 0.01
      this.videoTexture.image = this.$refs.video
      this.videoTexture.needsUpdate = true

    }
  }
 
}
</script>
