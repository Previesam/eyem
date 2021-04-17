<!-- <div class="d-flex">
    <v-icon color="primary" @click="$router.back()">mdi-chevron-left</v-icon>
    <v-breadcrumbs
      class="pl-2 pr-5 text-capitalize primary--text"
      :items="crumbs"
      large
    ></v-breadcrumbs>
  </div> -->

<template>
  <!-- <ol class="breadcrumb d-flex">
    <v-icon color="secondary" @click="$router.back()">mdi-chevron-left</v-icon>
    <li class="item">
      <nuxt-link :to="'/'" class="title">
        Home
      </nuxt-link>
    </li>
    <li v-for="(item, i) in crumbs" :key="i" class="item">
      <nuxt-link :to="item.to" class="title">
        {{ item.title }}
      </nuxt-link>
      v-ic
    </li>
  </ol> -->
  <div class="d-flex">
    <v-breadcrumbs
      class="pl-0 text-capitalize primary--text"
      :items="[{ href: '/', text: 'Home', link: true }]"
      small
    ></v-breadcrumbs>
    <v-icon v-if="$route.path !== '/'" small>mdi-chevron-right</v-icon>
    <v-breadcrumbs
      class="pl-2 pr-5 text-capitalize primary--text breadcrumb"
      :items="crumbs"
      small
    ></v-breadcrumbs>
  </div>
</template>

<script>
import startCase from "lodash.startcase";

export default {
  name: "Breadcrumb",
  computed: {
    crumbs() {
      const pathArray = this.$route.path.split("/");
      pathArray.shift();
      const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        if (path) {
          breadcrumbArray.push({
            href: breadcrumbArray[idx - 1]
              ? breadcrumbArray[idx - 1].href + "/" + path
              : "/" + path,
            link: true,
            text: startCase(decodeURIComponent(path))
          });
        }
        return breadcrumbArray;
      }, []);
      return breadcrumbs;
    }
  }
};
</script>

<style scoped>
.breadcrumb {
  width: auto;
  overflow-x: hidden;
  display: flex;
  flex-wrap: nowrap;
}
</style>
