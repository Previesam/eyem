<template>
  <div class="text-center mr-2">
    <v-menu max-height="500px" max-width="400px">
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
        <v-list-item v-for="(item, index) in items" :key="index" link>
          <v-list-item-title @click="getClients(item)">{{
            item.Name
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
  },

  methods: {
    async getClients(branch) {
      await this.$store.commit("toggleLoading", true);

      await this.$store.commit("switchBranch", branch);

      await this.$store.commit("clearClients");

      let clients = [];

      let Key = await branch.Key;

      let links = await this.$axios(
        `https://manager.eyemastersng.com/api/${Key}/ec37c11e-2b67-49c6-8a58-6eccb7dd75ee/index.json`,
        {
          method: "GET",
          headers: {
            Authorization: "Basic cHJldmllc2FtOlNhbUBAMjAxNSE=",
          },
        }
      )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });

      for (let i = 0; i < links.length; i++) {
        let client = await this.$axios(
          `https://manager.eyemastersng.com/api/${Key}/${links[i]}.json`,
          {
            method: "GET",
            headers: {
              Authorization: "Basic cHJldmllc2FtOlNhbUBAMjAxNSE=",
            },
          }
        )
          .then((res) => {
            res.data.id = links[i];
            return res.data;
          })
          .catch((err) => {
            console.log(err);
          });

        let newCustomFeilds = {};

        let entries = Object.entries(client.CustomFields);

        for (const [prop, val] of entries) {
          let Name = await this.$axios(
            `https://manager.eyemastersng.com/api/${Key}/${prop}.json`,
            {
              method: "GET",
              headers: {
                Authorization: "Basic cHJldmllc2FtOlNhbUBAMjAxNSE=",
              },
            }
          )
            .then((res) => {
              return res.data.Name;
            })
            .catch((err) => {
              console.log(err);
            });

          newCustomFeilds[Name] = { key: prop, value: val };
        }

        client.CustomFields = newCustomFeilds;

        // Send data to store

        await this.$store.commit("updateClients", client);

        this.$store.commit("clearClients");

        return;
      }

      await this.$store.commit("toggleLoading", false);
    },
  },
};
</script>

<style>
</style>