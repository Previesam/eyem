<template>
  <v-navigation-drawer
    v-model="settingsDrawer"
    :height="$vuetify.breakpoint.mobile ? '100%' : '92.5vh'"
    :width="$vuetify.breakpoint.mobile ? 'auto' : '200'"
    :bottom="$vuetify.breakpoint.width < 600"
    right
    app
    :style="
      $vuetify.breakpoint.width < 600
        ? 'border-top-left-radius: 1rem; border-top-right-radius: 1rem;'
        : ''
    "
    :class="$vuetify.breakpoint.mobile ? '' : 'mt-1 mb-7 mx-1 rounded'"
  >
    <v-list dense>
      <v-list-item dense>
        <span class="text-caption" style="font-weight: bold">Settings</span>
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
        class="primary--text rounded pr-5"
        @click="toggleDrawer(item.to)"
      >
        <v-list-item-action class="mr-5">
          <v-icon small>{{ item.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>

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
    callToggleDrawer: Boolean,
    user: Object
  },

  data() {
    return {
      items: [
        {
          icon: "mdi-source-branch",
          title: "Manage Branches",
          to: "/branches"
        },
        {
          icon: "mdi-account-settings",
          title: "Manage Users",
          to: "/users"
        },
        {
          icon: "mdi-account-key",
          title: "Permissions",
          to: "/user-permissions"
        },
        {
          icon: "mdi-email-edit",
          title: "Email Templates",
          to: "/email-templates"
        }
      ],
      settingsDrawer: false
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
    toggleDrawer(link) {
      if (link) {
        this.$router.push(link);
        this.settingsDrawer = !this.settingsDrawer;
      }
      this.settingsDrawer = !this.settingsDrawer;
    },
    checkPermission(item) {
      if (item === "/") return true;
      if (this.permissions[item].view) return true;
      return false;
    }
  }
};
</script>

<style scoped></style>
