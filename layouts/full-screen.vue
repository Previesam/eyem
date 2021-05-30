<template>
  <!-- Begin Application default view -->
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <v-main>
      <v-container fluid class="page-container">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>

  <!-- End Application default view -->
</template>

<script>
export default {
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
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
    }
  },
  async mounted() {
    // await this.initDarkMode();
  }
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
