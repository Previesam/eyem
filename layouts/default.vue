<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      clipped
      fixed
      app
    >
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
    <v-app-bar :clipped-left="true" fixed app dense>
      <v-toolbar-title class="mr-5 hidden-sm-and-down" v-text="title" />
      <v-app-bar-nav-icon @click.stop="miniVariant = !miniVariant" />
      <v-toolbar-title class="ml-5" v-text="'Dashboard'" />
      <v-spacer />
      <div class="text-center mr-2">
        <v-menu>
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-icon v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  mdi-map
                </v-icon>
              </template>
              <span>Change Location</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="text-center">
        <v-menu
          v-model="menu"
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
                  <v-list-item-subtitle
                    >Founder of Vuetify</v-list-item-subtitle
                  >
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    :class="fav ? 'red--text' : ''"
                    icon
                    @click="fav = !fav"
                  >
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
                  <v-switch v-model="hints" color="purple"></v-switch>
                </v-list-item-action>
                <v-list-item-title>Enable hints</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text @click="menu = false"> Cancel </v-btn>
              <v-btn color="primary" text @click="menu = false"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer fixed app>
      <span class="ma-auto">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      fav: false,
      items: [
        {
          icon: "mdi-view-dashboard",
          title: "Dashboard",
          to: "/",
        },
        {
          icon: "mdi-inbox",
          title: "Messages",
          to: "/message",
        },
        {
          icon: "mdi-inbox-multiple",
          title: "Jobs",
          to: "/jobs",
        },
        {
          icon: "mdi-account-multiple-plus",
          title: "Appointments",
          to: "/appointments",
        },
      ],
      miniVariant: false,
      title: "Eyemasters Osapa",
    };
  },
};
</script>
