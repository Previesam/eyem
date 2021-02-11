<template>
  <!-- Begin Application default view -->
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <!-- Begin Mobile Navigation Drawer -->

    <MobileNavDrawer
      v-if="$vuetify.breakpoint.smAndDown"
      :items="items"
      :callToggleDrawer="drawer"
    />

    <!-- End Mobile Naviagtion Drawer -->

    <!-- Begin Desktop Navigation Drawer -->

    <DesktopNavDrawer v-else :items="items" :miniVariant="miniVariant" />

    <!-- End Desktop Navigation Drawer -->

    <!-- Begin App Toolbar -->

    <v-app-bar fixed max-width="100%" class="my-2 rounded-xl mr-2 ml-4" app>
      <!-- Begin Mobile Navbar Icon -->

      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        @click.stop="drawer = !drawer"
      />

      <!-- End Mobile Navbar Icon -->

      <!-- Begin Desktop Navbar Icon -->

      <v-app-bar-nav-icon v-else @click.stop="miniVariant = !miniVariant" />

      <!-- End Desktop Navbar Icon -->

      <v-spacer />

      <!-- Begin Toolbar Title -->

      <v-toolbar-title class="body-1" v-text="$store.state.branch.Name" />

      <!-- End Toolbar Title -->

      <v-spacer />

      <!-- Begin User Menu -->

      <LocationsMenu :items="branches" />

      <UserMenu :userMenu="userMenu" :fav="fav" :message="message" />

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

    <v-main class="mt-2 ml-2">
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>

    <!-- End Main Area -->

    <!-- Begin App Footer -->

    <v-footer fixed app class="my-1 rounded-xl mx-2">
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

export default {
  components: {
    LocationsMenu,
    MobileNavDrawer,
    DesktopNavDrawer,
    UserMenu,
    LocationsMenu,
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
      title: "Eyemasters Osapa",
      userMenu: false,
      message: false,
      drawer: false,
      branches: [],
    };
  },

  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
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

    async getBranches() {
      let branches = await this.$axios(
        "https://manager.eyemastersng.com/api/index.json",
        {
          method: "GET",
          headers: {
            Authorization: "Basic cHJldmllc2FtOlNhbUBAMjAxNSE=",
          },
        }
      )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          consol.log(err);
        });

      this.branches = branches.filter(
        (branch) =>
          branch.Name.includes("Eyemasters") ||
          branch.Name.includes("1st Contact")
      );
    },

    async getClients() {
      await this.$store.commit("toggleLoading", true);

      await this.$store.commit("clearClients");

      let clients = [];

      let Key = await this.$store.state.branch.Key;

      let links = await this.$axios(
        `https://manager.eyemastersng.com/api/${Key}/ec37c11e-2b67-49c6-8a58-6eccb7dd75ee/index.json`,
        {
          method: "GET",
          headers: {
            Authorization: "Basic cHJldmllc2FtOlNhbUBAMjAxNSE=",
          },
        }
      )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });

      for (let i = 0; i < links.length; i++) {
        let client = await this.$axios(
          `https://manager.eyemastersng.com/api/${Key}/${links[i]}.json`,
          {
            method: "GET",
            headers: {
              Authorization: "Basic cHJldmllc2FtOlNhbUBAMjAxNSE=",
            },
          }
        )
          .then((res) => {
            res.data.id = links[i];
            return res.data;
          })
          .catch((err) => {
            console.log(err);
          });

        let newCustomFeilds = {};

        let entries = Object.entries(client.CustomFields);

        for (const [prop, val] of entries) {
          let Name = await this.$axios(
            `https://manager.eyemastersng.com/api/${Key}/${prop}.json`,
            {
              method: "GET",
              headers: {
                Authorization: "Basic cHJldmllc2FtOlNhbUBAMjAxNSE=",
              },
            }
          )
            .then((res) => {
              return res.data.Name;
            })
            .catch((err) => {
              console.log(err);
            });

          newCustomFeilds[Name] = { key: prop, value: val };

        }

        client.CustomFields = newCustomFeilds;

        // Send data to store

        await this.$store.commit("updateClients", client);
      }

      await this.$store.commit("toggleLoading", false);
    },
  },

  mounted() {
    console.log(this.$vuetify.breakpoint);
    this.initDarkMode();
  },

  created() {
    this.getBranches();
    this.getClients();
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
  /* background: #424242e3; */
  background: transparent;
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

.search-box {
  max-width: 30%;
  margin-right: 0;
}

.app-loader {
  width: 96%;
  top: 59px;
}
</style>
