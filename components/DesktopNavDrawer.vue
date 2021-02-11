<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="miniVariant"
    clipped-top
    fixed
    height="92vh"
    app
    class="mt-2 mb-8 mx-2 rounded-xl"
  >
    <v-list dense>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        exact
        class="primary--text rounded-xl"
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    items: [],
    miniVariant: Boolean,
  },

  data() {
    return {
      drawer: true,
    }
  }
};
</script>

<style>
</style>