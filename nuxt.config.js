import colors from "vuetify/es5/util/colors";
// const baseHref = process.env.BASE_HREF || '/';

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: "%s - Messages",
    title: "Eymasters App",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    //   // add required css:
    //   "../node_modules/@ionic/core/css/core.css",
    //   "../node_modules/@ionic/core/css/normalize.css",
    //   "../node_modules/@ionic/core/css/structure.css",
    //   "../node_modules/@ionic/core/css/typography.css",
    //   "../node_modules/@ionic/core/css/ionic.bundle.css"
    "~/assets/style.css"
  ],

  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: "node_modules/**"
    }
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    // add created plugin:
    "~/plugins/v-mask.js"
    // { src: "~/plugins/ionic.js", mode: "client" }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify"
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    [
      "nuxt-i18n",
      {
        locales: ["en", "es"],
        defaultLocale: "en",
        vueI18n: {
          fallbackLocale: "en",
          messages: {
            en: {
              greeting: "Hello world!"
            },
            es: {
              greeting: "¡Hola mundo!"
            }
          }
        }
      }
    ]
  ],

  // Axios Options
  axios: {
    baseURL: "http://localhost:3000/api"
  },

  auth: {
    strategies: {
      local: {
        scheme: "refresh",
        token: {
          property: "access_token",
          maxAge: 1800
          // type: 'Bearer'
        },
        refreshToken: {
          property: "refresh_token",
          data: "refresh_token",
          maxAge: 60 * 60 * 24 * 30
        },
        user: {
          property: "user",
          autoFetch: true
        },
        autoLogout: false,
        endpoints: {
          login: { url: "/auth/login", method: "post" },
          refresh: { url: "/auth/refresh", method: "post" },
          // logout: { url: "/auth/logout", method: "post" },
          user: { url: "/auth/user", method: "get" }
        }
      }
    }
  },

  // generate: {
  //   routes: [
  //     '/',
  //   ],
  // },

  // router: {
  //   // router with correct public path
  //   base: baseHref,
  //   mode: 'history',
  // },

  router: {
    middleware: ["auth"]
  },

  // Server Middleware

  serverMiddleware: ["~/api/index"],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      // themes: {
      //   dark: {
      //     primary: colors.blue.darken2,
      //     accent: colors.grey.darken3,
      //     secondary: colors.amber.darken3,
      //     info: colors.teal.lighten1,
      //     warning: colors.amber.base,
      //     error: colors.deepOrange.accent4,
      //     success: colors.green.accent3
      //   }
      // }
      themes: {
        dark: {
          primary: colors.blue,
          secondary: colors.teal.darken4,
          accent: colors.teal.accent4,
          background: "#1b2836",

          error: colors.deepOrange.accent2,
          info: colors.grey.darken3,
          success: colors.green.accent3,
          warning: colors.amber.base
        },
        light: {
          primary: "#1976D2",
          secondary: colors.teal.lighten3,
          accent: colors.teal.accent4,
          background: colors.grey.lighten2,

          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107"
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config, { isDev, isClient }) {
      config.node = {
        fs: "empty"
      };
    }
  }
};
