import colors from "vuetify/es5/util/colors";
var webpack = require("webpack");
var path = require("path");
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
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
      },
      {
        rel: "stylesheet",
        href:
          "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.3.0/codemirror.min.css"
      }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    //   // add required css:
    //   "../node_modules/@ionic/core/css/core.css",
    //   "../node_modules/@ionic/core/css/normalize.css",
    //   "../node_modules/@ionic/core/css/structure.css",
    //   "../node_modules/@ionic/core/css/typography.css",
    //   "../node_modules/@ionic/core/css/ionic.bundle.css",
    "~/node_modules/froala-editor/css/froala_editor.pkgd.css",
    "~/node_modules/froala-editor/css/froala_style.min.css",
    "~/node_modules/froala-editor/css/plugins/char_counter.min.css",
    "~/node_modules/froala-editor/css/plugins/code_view.min.css",
    "~/node_modules/froala-editor/css/plugins/colors.min.css",
    "~/node_modules/froala-editor/css/plugins/draggable.min.css",
    "~/node_modules/froala-editor/css/plugins/emoticons.min.css",
    "~/node_modules/froala-editor/css/plugins/image.min.css",
    "~/node_modules/froala-editor/css/plugins/image_manager.min.css",
    "~/node_modules/froala-editor/css/plugins/quick_insert.min.css",
    "~/node_modules/froala-editor/css/plugins/line_breaker.css",
    "~/node_modules/froala-editor/css/plugins/special_characters.css",
    "~/node_modules/froala-editor/css/third_party/spell_checker.min.css",
    "~/node_modules/froala-editor/css/plugins/table.min.css",
    "~/node_modules/froala-editor/css/plugins/video.min.css",
    "~/assets/style.css"
  ],

  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: "node_modules/**"
    }
  },

  loaders: {
    vue: {
      compilerOptions: {
        preserveWhitespace: false
      }
    }
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    // add created plugin:
    "~/plugins/v-mask.js",
    "~/plugins/v-snackbars.js",
    { src: "~/plugins/froala-editor.js", mode: "client" }
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
    transpile: [/^v-snackbars($|\/)/],
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      })
    ],
    extend(config, { isDev, isClient }) {
      config.node = {
        fs: "empty"
      };
    }
  }
};
