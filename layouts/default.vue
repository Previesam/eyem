<template>
  <!-- Begin Application default view -->
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <v-snackbars
      outlined
      top
      right
      :objects.sync="$store.state.toast.snackbars"
      timeout="10000"
    >
      <template v-slot:action="{ index }">
        <v-btn small icon text @click="closeSnackbar(index)">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbars>
    <!-- Begin Mobile Navigation Drawer -->

    <MobileNavDrawer
      v-if="$vuetify.breakpoint.mobile"
      :items="items"
      :callToggleDrawer="drawer"
      :user="user"
    />

    <!-- End Mobile Naviagtion Drawer -->

    <!-- Begin Desktop Navigation Drawer -->

    <DesktopNavDrawer
      v-else
      :items="items"
      :user="user"
      :callToggleMiniVariant="miniVariant"
      class="ml-2"
    />

    <!-- End Desktop Navigation Drawer -->

    <!-- Settings Drawer -->

    <SettingsDrawer :callToggleDrawer="settingsDrawer" :user="user" />

    <!-- End Settings Drawer -->

    <!-- Begin App Toolbar -->

    <v-app-bar
      fixed
      max-width="100%"
      :class="
        $vuetify.breakpoint.mobile ? 'mx-0 my-0' : 'rounded ml-4 mr-2 my-1'
      "
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

      <v-icon @click.stop="$router.push(`/`)" color="primary" nuxt-link="/"
        >mdi-home</v-icon
      >

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

      <UserMenu
        @toggleSettingsDrawer="toggleSettingsDrawer"
        :callToggleDrawer="userMenu"
        :user="user"
      />

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

    <v-main
      style="
        background-attachment: fixed;
        background-image: url('https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg');
      "
    >
      <v-container
        style="overflow-x: hidden"
        :class="$vuetify.breakpoint.mobile ? 'mx-0 px-2 py-2' : 'pl-4 pr-2'"
        fluid
      >
        <nuxt />
      </v-container>
    </v-main>

    <!-- End Main Area -->

    <!-- Begin App Footer -->

    <v-footer
      fixed
      app
      :class="
        $vuetify.breakpoint.mobile ? 'mx-0 my-0' : 'rounded ml-2 mr-2 my-1'
      "
    >
      <span class="ma-auto text-caption"
        >&copy; {{ new Date().getFullYear() }}. Eyemasters Limited</span
      >
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
import UserMenu from "../components/UserMenu";
import LocationsMenu from "../components/LocationsMenu";
import BreadCrumb from "../components/BreadCrumb";
import SettingsDrawer from "../components/SettingsDrawer";
import VSnackbars from "v-snackbars";

export default {
  components: {
    LocationsMenu,
    MobileNavDrawer,
    DesktopNavDrawer,
    UserMenu,
    LocationsMenu,
    BreadCrumb,
    SettingsDrawer,
    "v-snackbars": VSnackbars,
  },
  name: "DefaultView",
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
        {
          icon: "mdi-account-clock",
          title: "Clock In/Out",
          to: "/clock-in-out",
        },
        {
          icon: "mdi-help",
          title: "IT Help Desk",
          to: "/it-helpdesk",
        },
      ],
      miniVariant: false,
      userMenu: false,
      drawer: false,
      settingsDrawer: false,
    };
  },

  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
    user() {
      return this.$auth.user;
    },
    branches() {
      return this.$auth.user.branches;
    },
  },

  methods: {
    closeSnackbar(index) {
      this.$store.dispatch("toast/callCloseSnackbar", index);
    },

    toggleSettingsDrawer() {
      this.settingsDrawer = !this.settingsDrawer;
    },

    // Implementing Dark Mode and Auto Light or Dark Mode

    initDarkMode() {
      const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      console.log(darkMediaQuery);

      darkMediaQuery.addEventListener("change", (e) => {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      });

      if (darkMediaQuery.matches) {
        console.log("change default light to dark theme");
        // need to set 0 sec timeout to set the dark more after mounted event, due to some bug in the framework
        setTimeout(() => (this.$vuetify.theme.dark = true), 0);
      }
    },

    async getBranches() {
      // let branches = await this.$axios("/branches", {
      //   method: "GET"
      // })
      //   .then(res => {
      //     return res.data;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      this.$store.commit("switchBranch", this.$auth.user.defaultBranch);
    },
  },

  async mounted() {
    await this.initDarkMode();
  },

  async beforeMount() {
    await this.$store.commit("toggleLoading", true);

    await this.getBranches();

    await this.$store.commit("updateClients");

    await this.$store.commit("toggleLoading", false);
  },
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
