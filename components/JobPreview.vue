<template>
  <v-dialog
    v-model="dialogJob"
    persistent
    scrollable
    :fullscreen="$vuetify.breakpoint.width >= 600 ? true : true"
    overlay-color="blue"
  >
    <!-- <v-card class="text-center">
      <v-card-title>
        <span>{{ "Hello" }}</span>
        <v-spacer></v-spacer>
        <span><v-icon @click="dialogJob = false">mdi-close</v-icon></span>
      </v-card-title>
    </v-card> -->

    <v-card>
      <v-card-title>
        <h1>Vue Email Editor (Demo)</h1>
        <v-spacer></v-spacer>
        <v-btn outlined color="accent" v-on:click="saveDesign" class="mr-5"
          >Save Design</v-btn
        >
        <v-btn outlined color="accent" v-on:click="exportHtml" class="mr-5"
          >Export HTML</v-btn
        >
        <span><v-icon @click="dialogJob = false">mdi-close</v-icon></span>
      </v-card-title>
        <EmailEditor
          :minHeight="'calc(100vh - 62px)'"
          ref="emailEditor"
          v-on:load="editorLoaded"
        />
    </v-card>
  </v-dialog>
</template>

<script>
import { EmailEditor } from "vue-email-editor";
export default {
  props: {
    job: Object,
    dialog: Boolean
  },
  computed: {
    dialogJob: {
      get() {
        return this.dialog;
      },
      set(value) {
        this.dialog = value;
      }
    }
  }
};
</script>

<style></style>
