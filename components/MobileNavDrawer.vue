<template>
  <v-navigation-drawer v-model="drawer" clipped fixed app class="mt-2 mb-8 mx-2 rounded-xl">
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        exact
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
    items: Array,
    callToggleDrawer: Boolean,
  },

  data () {
    return {
      drawer: false,
    }
  },

  watch: {
    callToggleDrawer: function (newVal, oldVal) {
      this.toggleDrawer()
    }
  },

  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    }
  }
};
</script>

<style>
</style>