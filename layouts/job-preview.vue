<template>
  <!-- Begin Application default view -->
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <v-main>
      <v-app-bar flat tile dense fixed app
        ><v-app-bar-title
          ><a href="https://eyemastersng.com" style="text-decoration: none"
            ><v-img width="180px" src="/logo.png"></v-img></a></v-app-bar-title
        ><v-spacer></v-spacer>
        <a
          href="https://facebook.com"
          style="text-decoration: none"
          class="mr-2"
          ><v-icon size="19" color="primary">mdi-facebook</v-icon></a
        >
        <a href="https://twitter.com" style="text-decoration: none" class="mr-2"
          ><v-icon size="19" color="accent">mdi-twitter</v-icon></a
        >
        <a
          href="https://instagram.com"
          style="text-decoration: none"
          class="mr-2"
          ><v-icon size="19" color="orange">mdi-instagram</v-icon></a
        >
        <a href="https://youtube.com" class="mr-2" style="text-decoration: none"
          ><v-icon size="19" color="red">mdi-youtube</v-icon></a
        >
        <a href="https://whatsapp.com" style="text-decoration: none"
          ><v-icon size="19" color="green">mdi-whatsapp</v-icon></a
        >
      </v-app-bar>
      <v-container style="height:100%; width:100%" fluid>
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
    await this.initDarkMode();
  }
};
</script>

<style>
.body {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
}
</style>
