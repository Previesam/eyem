<template>
  <v-navigation-drawer
    v-model="drawer"
    :bottom="$vuetify.breakpoint.width < 600"
    app
    :class="$vuetify.breakpoint.width < 600 ? 'rounded-top' : ''"
  >
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        exact
      >
        <v-list-item-action class="mr-5">
          <v-icon small>{{ item.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
        <v-space></v-space>
        <v-list-item-action v-if="$vuetify.breakpoint.width < 600">
          <v-icon small>mdi-chevron-right</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    items: Array,
    callToggleDrawer: Boolean
  },

  data() {
    return {
      drawer: false
    };
  },

  watch: {
    callToggleDrawer: function(newVal, oldVal) {
      this.toggleDrawer();
    }
  },

  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    }
  }
};
</script>

<style scoped>
.rounded-top {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}
</style>
