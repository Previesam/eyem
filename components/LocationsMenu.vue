<template>
  <div class="text-center mr-2">
    <v-menu max-height="500px" max-width="400px">
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              small
              class="text-capitalize"
              text
              outlined
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-icon small :left="$vuetify.breakpoint.width > 450">
                mdi-source-branch </v-icon
              ><span :hidden="$vuetify.breakpoint.width < 450">{{
                $store.state.branch.Name
              }}</span>
            </v-btn>
          </template>
          <span>Switch Branch</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" link @click.prevent="switchBranch(item)">
          <v-list-item-title>{{
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
    items: Array
  },

  methods: {
    async switchBranch(branch) {
      await this.$store.commit("switchBranch", branch);
    }
  }
};
</script>

<style>
/* width */
v-menu::-webkit-scrollbar {
  width: 0.2rem;
}

/* Track */
v-menu::-webkit-scrollbar-track {
  /* background: #424242e3; */
  background: transparent;
  border-radius: 2px;
}

/* Handle */
v-menu::-webkit-scrollbar-thumb {
  background: #888;
  width: 2px;
  border-radius: 2px;
}

/* Handle on hover */
v-menu::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
