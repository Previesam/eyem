<template>
  <!-- Begin Application default view -->
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <v-snackbar
      :transition="
        snackbar ? 'slide-x-transition' : 'slide-x-reverse-transition'
      "
      outlined
      top
      right
      v-model="snackbar"
      :timeout="timeout"
      :color="type"
    >
      {{ toastMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn small icon text v-bind="attrs" @click="snackbar = false">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <!-- Begin Mobile Navigation Drawer -->

    <MobileNavDrawer
      v-if="$vuetify.breakpoint.mobile"
      :items="items"
      :callToggleDrawer="drawer"
    />

    <!-- End Mobile Naviagtion Drawer -->

    <!-- Begin Desktop Navigation Drawer -->

    <DesktopNavDrawer
      v-else
      :items="items"
      :callToggleMiniVariant="miniVariant"
    />

    <!-- End Desktop Navigation Drawer -->

    <!-- Begin App Toolbar -->

    <v-app-bar
      fixed
      max-width="100%"
      class="rounded"
      :class="$vuetify.breakpoint.mobile ? 'mx-0 my-0' : 'ml-4 mr-2 my-2'"
      :height="$vuetify.breakpoint.mobile ? '50px' : '40px'"
      app
    >
      <!-- Begin Mobile Navbar Icon -->

      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.mobile"
        @click.stop="drawer = !drawer"
      />

      <!-- End Mobile Navbar Icon -->

      <!-- Begin Desktop Navbar Icon -->

      <v-app-bar-nav-icon v-else @click.stop="miniVariant = !miniVariant" />
      
    <v-icon @click.stop="$router.push(`/`)" color="primary" nuxt-link="/">mdi-home</v-icon>

      <BreadCrumb />

      <!-- End Desktop Navbar Icon -->

      <!-- Begin Toolbar Title -->

      <!-- <v-toolbar-title class="body-1" v-text="$store.state.branch.Name" /> -->

      <!-- End Toolbar Title -->

      <v-spacer />

      <!-- Begin User Menu -->

      <LocationsMenu :items="branches" />

      <v-btn icon text>
        <v-icon small>mdi-bell</v-icon>
      </v-btn>

      <UserMenu :userMenu="userMenu" />

      <!-- End User Menu -->
    </v-app-bar>

    <v-progress-linear
      :active="$store.state.loading"
      :indeterminate="$store.state.loading"
      bottom
      color="accent"
    ></v-progress-linear>
    <!-- End App Toolbar -->

    <!-- Begin Main Area -->

    <v-main class="mt-2" :class="$vuetify.breakpoint.mobile ? '' : 'ml-2'">
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>

    <!-- End Main Area -->

    <!-- Begin App Footer -->

    <v-footer fixed app class="my-1 rounded mx-2">
      <span class="ma-auto">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <v-progress-linear
      :active="$store.state.loading"
      :indeterminate="$store.state.loading"
      bottom
      color="accent"
    ></v-progress-linear>

    <!-- End App Footer -->
  </v-app>

  <!-- End Application default view -->
</template>

<script>
import MobileNavDrawer from "../components/MobileNavDrawer";
import DesktopNavDrawer from "../components/DesktopNavDrawer";
import UserMenu from "../components/UserMenu.vue";
import LocationsMenu from "../components/LocationsMenu.vue";
import BreadCrumb from "../components/BreadCrumb.vue";

export default {
  components: {
    LocationsMenu,
    MobileNavDrawer,
    DesktopNavDrawer,
    UserMenu,
    LocationsMenu,
    BreadCrumb
  },
  name: "DefaultView",
  data() {
    return {
      fav: false,
      items: [
        {
          icon: "mdi-view-dashboard",
          title: "Dashboard",
          to: "/"
        },
        {
          icon: "mdi-android-messages",
          title: "Messages",
          to: "/messages"
        },
        {
          icon: "mdi-inbox-multiple",
          title: "Jobs",
          to: "/jobs"
        },
        {
          icon: "mdi-account-multiple-plus",
          title: "Appointments",
          to: "/appointments"
        },
        {
          icon: "mdi-account-clock",
          title: "Clock In/Out",
          to: "/clock-in-out"
        },
        {
          icon: "mdi-help",
          title: "IT Help Desk",
          to: "/it-helpdesk"
        }
      ],
      miniVariant: false,
      userMenu: false,
      drawer: false,
      branches: []
    };
  },

  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
    timeout() {
      return this.$store.state.toast.timeout;
    },
    snackbar: {
      get() {
        return this.$store.state.toast.snackbar;
      },
      set() {
        this.$store.commit("toast/closeSnackbar");
      }
    },
    type() {
      return this.$store.state.toast.type;
    },
    toastMessage() {
      return this.$store.state.toast.message;
    }
  },

  methods: {
    // Implementing Dark Mode and Auto Light or Dark Mode

    initDarkMode() {
      const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      console.log(darkMediaQuery);

      darkMediaQuery.addEventListener("change", e => {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      });

      if (darkMediaQuery.matches) {
        console.log("change default light to dark theme");
        // need to set 0 sec timeout to set the dark more after mounted event, due to some bug in the framework
        setTimeout(() => (this.$vuetify.theme.dark = true), 0);
      }
    },

    async getBranches() {
      let branches = await this.$axios("/branches", {
        method: "GET"
      })
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log(err);
        });

      this.branches = branches;
    }
  },

  async mounted() {
    await this.initDarkMode();

    await this.$store.commit("toggleLoading", true);

    await this.getBranches();

    await this.$store.commit("updateClients");

    await this.$store.commit("toggleLoading", false);
  }
};
</script>
<style>
.search-box {
  max-width: 50%;
  margin-right: 0;
}

.app-loader {
  width: 96%;
  top: 59px;
}

.v-dialog > .v-card > .v-card__text {
  padding: 0 5px 5px;
}
</style>
