<template>
  <div>
    <v-btn
      @click="onClick"
      rounded
      :style="`cursor: ${cursor ? cursor : 'pointer'}`"
      >{{ children }}</v-btn
    >
  </div>
</template>

<script>
export default {
  props: {
    cursor: String,
    onClick: Function,
    children: String
  }
};
</script>

<style></style>
