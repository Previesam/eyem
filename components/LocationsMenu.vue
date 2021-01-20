<template>
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
</template>

<script>
export default {
    props: {
        items: Array,
    }
};
</script>

<style>
</style>