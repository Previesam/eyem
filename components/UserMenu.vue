<template>
  <div id="userMenu">
    <div class="text-center">
      <v-menu
        v-model="userMenu"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-avatar color="primary" size="40" v-bind="attrs" v-on="on"
            >AS</v-avatar
          >
        </template>
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <v-avatar color="primary" size="40">AS</v-avatar>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>John Leider</v-list-item-title>
                <v-list-item-subtitle>Founder of Vuetify</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn :class="fav ? 'red--text' : ''" icon @click="fav = !fav">
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-switch v-model="message" color="purple"></v-switch>
              </v-list-item-action>
              <v-list-item-title>Enable messages</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-switch
                  v-model="$vuetify.theme.dark"
                  color="purple"
                ></v-switch>
              </v-list-item-action>
              <v-list-item-title>Dark Theme</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="userMenu = false"> Cancel </v-btn>
            <v-btn color="primary" text @click="userMenu = false"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        userMenu: Boolean,
        fav: Boolean,
    }
};
</script>

<style>
</style>