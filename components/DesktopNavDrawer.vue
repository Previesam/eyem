<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="$vuetify.breakpoint.width < 800 ? true : miniVariant"
    height="92vh"
    width="200"
    app
    class="mt-1 mb-7 mx-2 rounded"
  >
    <v-list dense>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        exact
        class="primary--text rounded pr-5"
      >
        <v-list-item-action class="mr-5">
          <v-icon small>{{ item.icon }}</v-icon>
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
    items: Array,
    callToggleMiniVariant: Boolean
  },

  data() {
    return {
      drawer: true,
      miniVariant: false
    };
  },

  watch: {
    callToggleMiniVariant: function(newVal, oldVal) {
      this.toggleMiniVariant();
    }
  },
  methods: {
    toggleMiniVariant() {
      this.miniVariant = !this.miniVariant;
    }
  }
};
</script>

<style></style>
