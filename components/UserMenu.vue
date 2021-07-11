<template>
  <div id="userMenu">
    <div class="text-center">
      <v-menu
        v-model="userMenu"
        :close-on-content-click="true"
        :nudge-width="200"
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
            v-if="$auth.loggedIn"
            color="primary"
            size="30"
            v-bind="attrs"
            v-on="on"
            class="white--text"
            >{{ user.firstname[0] + user.lastname[0] }}</v-avatar
          >
        </template>
        <v-card>
          <v-list>
            <v-list-item v-if="$auth.loggedIn">
              <v-list-item-avatar>
                <v-avatar color="primary" size="40" class="white--text">{{
                  user.firstname[0] + user.lastname[0]
                }}</v-avatar>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{
                  user.firstname + " " + user.lastname
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  user.designation
                }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action
                ><v-tooltip buttom>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      v-on="{ ...tooltip }"
                      :class="$vuetify.theme.dark ? 'red--text' : ''"
                      icon
                      @click="$vuetify.theme.dark = !$vuetify.theme.dark"
                    >
                      <v-icon>mdi-lightbulb-on</v-icon>
                    </v-btn> </template
                  ><span>{{ $vuetify.theme.dark ? "Light" : "Dark" }}</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list dense>
            <v-list-item to="/user-profile" link>
              <v-list-item-icon
                ><v-icon medium>mdi-account</v-icon></v-list-item-icon
              >
              <v-list-item-title> User Profile </v-list-item-title>
            </v-list-item>
            <v-list-item link @click="toggleSettingsDrawer()">
              <v-list-item-icon
                ><v-icon medium>mdi-cog</v-icon></v-list-item-icon
              >
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="logout()">
              <v-list-item-icon
                ><v-icon medium>mdi-logout</v-icon></v-list-item-icon
              >
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    callToggleUserMenu: Boolean,
    user: Object,
  },
  data() {
    return {
      userMenu: false,
    };
  },

  watch: {
    callToggleUserMenu: function (newVal, oldVal) {
      this.toggleDrawer();
    },
  },

  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push("/login");
      this.sendToast();
    },
    sendToast() {
      this.$store.dispatch("toast/callAddSnackbar", {
        ccolor: "success",
        message: "You have logged out successfully",
      });
    },
    toggleSettingsDrawer() {
      this.$emit("toggleSettingsDrawer");
    },
    toggleMenu() {
      this.userMenu = !this.userMenu;
    },
  },
};
</script>

<style></style>
