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
            >{{
              $auth.user.fullname.split(" ")[0][0] +
                $auth.user.fullname.split(" ")[1][0]
            }}</v-avatar
          >
        </template>
        <v-card>
          <v-list>
            <v-list-item v-if="$auth.loggedIn">
              <v-list-item-avatar>
                <v-avatar color="primary" size="40">{{
                  $auth.user.fullname.split(" ")[0][0] +
                    $auth.user.fullname.split(" ")[1][0]
                }}</v-avatar>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ $auth.user.fullname }}</v-list-item-title>
                <v-list-item-subtitle>{{ "I.T Support" }}</v-list-item-subtitle>
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
                      <v-icon>mdi-theme-light-dark</v-icon>
                    </v-btn> </template
                  ><span>{{ $vuetify.theme.dark ? "Light" : "Dark" }}</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list dense>
            <v-list-item link>
              <v-list-item-icon
                ><v-icon medium>mdi-account</v-icon></v-list-item-icon
              >
              <v-list-item-title>User Profile</v-list-item-title>
            </v-list-item>
            <v-list-item link>
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
    userMenu: Boolean
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push("/login");
      this.sendToast();
    },
    sendToast() {
      this.$store.dispatch("toast/snackbar", {
        type: "success",
        message: "You have logged out successfully"
      });
    }
  }
};
</script>

<style></style>
