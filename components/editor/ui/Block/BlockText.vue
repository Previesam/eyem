<template>
  <div>
    <v-textarea
      color="primary"
      style="width: 100%; line-height: 1.5"
      :name="name"
      :v-model="text"
      no-resize
      outlined
      dense
      auto-grow
      rows="1"
      min-height="40px"
    ></v-textarea>
  </div>
</template>

<script>
export default {
  props: {
    defaultValue: String,
    name: String
  },
  data: function(vm) {
    return {
      text: vm.defaultValue || ""
    };
  },
  methods: {}
};
</script>

<style></style>
