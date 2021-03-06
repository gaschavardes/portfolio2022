
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  target: 'static',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Gaspard Chavardes',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'description', name: 'description', content: 'Creative Developer' },
      { name: 'og:url', content: 'https://gaspardchavardes.com' },
      { name: 'og:type', content: 'website' },
      { name: 'og:description', content: 'Creative Developer' },
      { name: 'og:image', content: 'https://gaspardchavardes.com/share.png' },
    ],
    link: [
      
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@100;200;300;700&display=swap' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  router: {
    base: '/',
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'home',
        path: '/',
        component: `~/pages/home/home.vue`
      })
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    transpile: ['gsap', 'ogl', 'Raf'],
    extend (config, {
      isDev,
      isClient
    }) {
      // ..
      config.module.rules.push({
        test: /\.(glsl|vs|fs|frag|vert)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader'
        ]
      })
      // Sets webpack's mode to development if `isDev` is true.
      if (isDev) {
        config.mode = 'development'
      }
    }
  }
}
