<template>
  <!-- Begin Right Column Item Preview -->

  <v-card rounded class="ml-auto mr-auto" height="100%" width="800px">
    <v-card-title class="text-body-1" style="font-weight: bold">{{
      currentItem.client.Name
    }}</v-card-title>
    <v-card-subtitle>Job #{{ currentItem.id }}</v-card-subtitle>
    <v-card-text>
      Date: {{ formatDate(currentItem.dateIn) }} <br />
      Frame: {{ currentItem.frame }} <br />
      Lens: {{ currentItem.lens }}
    </v-card-text>
    <div  :style="{ background: $vuetify.theme.themes[theme].background }" class="col-12 col-md-12 hh-grayBox pt45 pb20">
      <div class="row justify-content-between">
        <div
          class="order-tracking"
          :class="
            currentItem.status === 'open' ||
            'in-progress' ||
            'quality-check' ||
            'completed'
              ? 'completed'
              : ''
          "
        >
          <span class="is-complete"></span>
          <v-card-text class="pa-0 mt-2 ma-0">Open</v-card-text>
        </div>
        <div
          class="order-tracking"
          :class="currentItem.status === 'open' ? '' : 'completed'"
        >
          <span class="is-complete"></span>
          <v-card-text class="pa-0 mt-2 ma-0">In Progress</v-card-text>
        </div>
        <div
          class="order-tracking"
          :class="currentItem.status === 'delayed' ? 'completed' : ''"
          v-show="currentItem.status === 'delayed'"
        >
          <span class="is-complete" style="background-color: red"></span>
          <v-card-text class="pa-0 mt-2 ma-0">Delayed</v-card-text>
        </div>
        <div
          class="order-tracking"
          :class="
            currentItem.status.includes('quality-check') ||
            currentItem.status.includes('completed')
              ? 'completed'
              : ''
          "
          v-show="currentItem.status !== 'delayed'"
        >
          <span class="is-complete"></span>
          <v-card-text class="pa-0 mt-2 ma-0">Quality Check</v-card-text>
        </div>
        <div
          class="order-tracking"
          :class="currentItem.status === 'completed' ? 'completed' : ''"
        >
          <span class="is-complete"></span>
          <v-card-text class="pa-0 mt-2 ma-0">Collected</v-card-text>
        </div>
      </div>
    </div>
    <v-card-subtitle style="font-weight: bold">History:</v-card-subtitle>
    <v-card-text
      style="font-weight: 500; display: block; height: 37%; overflow-y: scroll"
      class="py-0 my-0"
    >
      <div v-if="currentItem.history.length < 1" class="text-center">
        Nothing to show here...
      </div>
      <v-timeline
        align-top
        v-else
        :dense="$vuetify.breakpoint.width < 600"
        class="px-0 mx-0"
      >
        <v-timeline-item
          v-for="(history, index) of currentItem.history"
          :key="index"
          :color="getStatusColor(history.status)"
          small
        >
          <template v-slot:opposite>
            <span class="caption">{{ formatDate(history.date) }}</span>
          </template>
          {{ history.name }} set job as
          <v-chip small :color="getStatusColor(history.status)">{{
            history.status
          }}</v-chip>
          <span class="caption" v-show="$vuetify.breakpoint.width < 600">{{
            formatDate(history.date)
          }}</span>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>

  <!-- End Preview Placeholder -->
</template>

<script>
export default {
  auth: false,
  layout: "job-preview",
  async asyncData({ $axios, store, params, error }) {
    await $axios(`/job/${params.id}`, {
      method: "GET"
    })
      .then(res => {
        if (res.data.message)
          error({ statusCode: 404, message: "Job not found" });
        store.commit("setCurrentItem", res.data);
      })
      .catch(
        err => (
          console.error(err.response),
          error({ statusCode: 404, message: "Job not found" })
        )
      );
  },

  computed: {
    currentItem() {
      return this.$store.state.currentItem;
    },
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    }
  },

  methods: {
    getStatusColor(status) {
      if (status === "open") {
        return "primary";
      } else if (status === "in-progress") {
        return "secondary";
      } else if (status === "completed") {
        return "accent";
      } else if (status === "delayed") {
        return "warning";
      } else {
        return;
      }
    },
    formatDate(date) {
      if (!date) return null;

      if (date.length < 10) return null;

      const [year, month, day] = date.split("-");

      return `${day[0] + day[1]}/${month}/${year}`;
    }
  }
};
</script>

<style scoped>
.hh-grayBox {
  background-color: #f8f8f8;
  margin-bottom: 20px;
  padding-top: 35px;
  padding-bottom: 35px;
  margin-top: 20px;
}
.pt45 {
  padding-top: 45px;
}
.order-tracking {
  text-align: center;
  width: 25%;
  position: relative;
  display: block;
}
.order-tracking .is-complete {
  display: block;
  position: relative;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  border: 0px solid #afafaf;
  background-color: #f7be16;
  margin: 0 auto;
  transition: background 0.25s linear;
  -webkit-transition: background 0.25s linear;
  z-index: 2;
}
.order-tracking .is-complete:after {
  display: block;
  position: absolute;
  content: "";
  height: 14px;
  width: 7px;
  top: -2px;
  bottom: 0;
  left: 5px;
  margin: auto 0;
  border: 0px solid #afafaf;
  border-width: 0px 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
}
.order-tracking.completed .is-complete {
  border-color: #27aa80;
  border-width: 0px;
  background-color: #27aa80;
}
.order-tracking.completed .is-complete:after {
  border-color: #fff;
  border-width: 0px 3px 3px 0;
  width: 7px;
  left: 11px;
  opacity: 1;
}
.order-tracking::before {
  content: "";
  display: block;
  height: 3px;
  width: calc(100% - 40px);
  background-color: #f7be16;
  top: 13px;
  position: absolute;
  left: calc(-50% + 20px);
  z-index: 0;
}
.order-tracking:first-child:before {
  display: none;
}
.order-tracking.completed:before {
  background-color: #27aa80;
}
</style>
