<template>
  <v-navigation-drawer
    v-model="drawer"
    :bottom="$vuetify.breakpoint.width < 600"
    app
    :class="$vuetify.breakpoint.width < 600 ? 'rounded-top' : ''"
  >
    <v-list dense>
      <v-list-item dense>
        <span class="text-caption" style="font-weight: bold">App Menu</span>
        <v-spacer></v-spacer
        ><v-icon @click="toggleDrawer()">mdi-close</v-icon></v-list-item
      >
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        v-show="$auth.loggedIn && checkPermission(item.to)"
        exact
      >
        <v-list-item-action class="mr-5">
          <v-icon small>{{ item.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
        <v-spacer></v-spacer>
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
    callToggleDrawer: Boolean,
    user: Object
  },

  data() {
    return {
      drawer: false
    };
  },

  computed: {
    permissions() {
      return this.user.role.permissions;
    }
  },

  watch: {
    callToggleDrawer: function(newVal, oldVal) {
      this.toggleDrawer();
    }
  },

  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    checkPermission(item) {
      if (item === "/") return true;
      if (this.permissions[item].view) return true;
      return false;
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
