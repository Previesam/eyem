<template>
  <!-- Begin Application default view -->
  <v-app dark>
    <!-- Begin Mobile Navigation Drawer -->

    <MobileNavDrawer v-if="$vuetify.breakpoint.mobile" :items="items" :callToggleDrawer="drawer" />

    <!-- End Mobile Naviagtion Drawer -->

    <!-- Begin Desktop Navigation Drawer -->

    <DesktopNavDrawer v-else :items="items" :miniVariant="miniVariant" />

    <!-- End Desktop Navigation Drawer -->

    <!-- Begin App Toolbar -->

    <v-app-bar :clipped-left="true" fixed app dense>
      <v-toolbar-title class="mr-5 hidden-sm-and-down" v-text="title" />

      <!-- Begin Mobile Navbar Icon -->

      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.mobile"
        @click.stop="drawer = !drawer"
      />

      <!-- End Mobile Navbar Icon -->

      <!-- Begin Desktop Navbar Icon -->

      <v-app-bar-nav-icon v-else @click.stop="miniVariant = !miniVariant" />

      <!-- End Desktop Navbar Icon -->

      <!-- Begin Toolbar Title -->

      <v-toolbar-title class="ml-5" v-text="'Message'" />

      <!-- End Toolbar Title -->

      <v-spacer />

      <!-- Begin User Menu -->

      <LocationsMenu :items="items" />

      <UserMenu :userMenu="userMenu" :fav="fav" />

      <!-- End User Menu -->
    </v-app-bar>

    <!-- End App Toolbar -->

    <!-- Begin Main Area -->

    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>

    <!-- End Main Area -->

    <!-- Begin App Footer -->

    <v-footer fixed app>
      <span class="ma-auto">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

    <!-- End App Footer -->
  </v-app>

  <!-- End Application default view -->
</template>

<script>
import MobileNavDrawer from "../components/MobileNavDrawer";
import DesktopNavDrawer from "../components/DesktopNavDrawer";
import UserMenu from "../components/UserMenu.vue";
import LocationsMenu from "../components/LocationsMenu.vue";
import { mapMutations } from 'vuex';

export default {
  components: {
    LocationsMenu,
    MobileNavDrawer,
    DesktopNavDrawer,
    UserMenu,
    LocationsMenu,
  },
  name: "Default View",
  data() {
    return {
      fav: false,
      items: [
        {
          icon: "mdi-view-dashboard",
          title: "Dashboard",
          to: "/",
        },
        {
          icon: "mdi-android-messages",
          title: "Messages",
          to: "/messages",
        },
        {
          icon: "mdi-inbox-multiple",
          title: "Jobs",
          to: "/jobs",
        },
        {
          icon: "mdi-account-multiple-plus",
          title: "Appointments",
          to: "/appointments",
        },
      ],
      miniVariant: false,
      title: "Eyemasters Osapa",
      userMenu: false,
      message: false,
      drawer: false,
    };
  },

  methods: {

    // Implementing Dark Mode and Auto Light or Dark Mode

    initDarkMode() {
      const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      darkMediaQuery.addEventListener("change", (e) => {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      });

      if (darkMediaQuery.matches) {
        console.log("change default light to dark theme");
        // need to set 0 sec timeout to set the dark more after mounted event, due to some bug in the framework
        setTimeout(() => (this.$vuetify.theme.dark = true), 0);
      }
    },

  },

  mounted() {
    this.initDarkMode();
  },
};
</script>
<style>
/* width */
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #424242e3;
  border-radius: 4px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
