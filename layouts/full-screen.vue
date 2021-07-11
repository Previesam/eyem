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
    <v-main>
      <v-container fluid class="page-container">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>

  <!-- End Application default view -->
</template>

<script>
import VSnackbars from "v-snackbars";

export default {
  components: {
    "v-snackbars": VSnackbars,
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },

  methods: {
    closeSnackbar(index) {
      this.$store.dispatch("toast/callCloseSnackbar", index);
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
  },
  async mounted() {
    await this.initDarkMode();
  },
};
</script>

<style >
.body {
  height: 100vh;
  width: 100vh;
  overflow-y: scroll;
}

.page-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: scroll;
}
</style>
