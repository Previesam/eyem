<template>
  <!-- Begin Right Column Item Preview -->

  <v-card
    rounded
    class="ml-auto mr-auto"
    style="overflow-x:scroll"
    height="100%"
    width="800px"
  >
    <v-card-title class="text-body-1" style="font-weight: bold">{{
      currentItem.client.Name
    }}</v-card-title>
    <v-card-subtitle>Job #{{ currentItem.id }}</v-card-subtitle>
    <v-card-text>
      Date: {{ formatDate(currentItem.dateIn) }} <br />
      Frame: {{ currentItem.frame }} <br />
      Lens: {{ currentItem.lens }}
    </v-card-text>
    <div class="col-12 col-md-12 hh-grayBox pt45 pb20">
      <div class="row justify-content-between">
        <div
          class="order-tracking"
          :style="
            currentItem.status === 'delayed' ? 'width: 20%' : 'width: 25%'
          "
          :class="
            currentItem.status === 'open'
              ? 'completed'
              : ''
          "
        >
          <span class="is-complete"></span>
          <v-card-text class="pa-0 mt-2 ma-0">Open</v-card-text>
        </div>
        <div
          class="order-tracking"
          :style="
            currentItem.status === 'delayed' ? 'width: 20%' : 'width: 25%'
          "
          :class="
            currentItem.status === 'in-progress' ||
            'delayed' ||
            'quality-check' ||
            'completed'
              ? 'completed'
              : ''
          "
        >
          <span class="is-complete"></span>
          <v-card-text class="pa-0 mt-2 ma-0">In Progress</v-card-text>
        </div>
        <div
          class="order-tracking"
          :style="
            currentItem.status === 'delayed' ? 'width: 20%' : 'width: 25%'
          "
          :class="currentItem.status === 'delayed' ? 'completed' : ''"
          v-if="currentItem.status === 'delayed'"
        >
          <span class="is-complete"></span>
          <v-card-text class="pa-0 mt-2 ma-0">Delayed</v-card-text>
        </div>
        <div
          class="order-tracking"
          :style="
            currentItem.status === 'delayed' ? 'width: 20%' : 'width: 25%'
          "
          :class="
            currentItem.status === 'quality-check' || 'completed'
              ? 'completed'
              : ''
          "
        >
          <span class="is-complete"></span>
          <v-card-text class="pa-0 mt-2 ma-0">Quality Check</v-card-text>
        </div>
        <div
          class="order-tracking"
          :style="
            currentItem.status === 'delayed' ? 'width: 20%' : 'width: 25%'
          "
          :class="currentItem.status === 'completed' ? 'completed' : ''"
        >
          <span class="is-complete"></span>
          <v-card-text class="pa-0 mt-2 ma-0">Collected</v-card-text>
        </div>
      </div>
    </div>
    <v-card-subtitle style="font-weight: bold">History:</v-card-subtitle>
    <v-card-text class="py-0">
      <v-timeline
        align-top
        :dense="$vuetify.breakpoint.width < 600"
        class="px-0 mx-0"
      >
        <v-timeline-item color="pink" small>
          <template v-slot:opposite>
            <span>{{ formatDate(currentItem.updatedAt) }}</span>
          </template>
          Samuel Adeyanju Changed status to <v-chip>pending</v-chip>
        </v-timeline-item>

        <v-timeline-item color="teal lighten-3" small>
          <template v-slot:opposite>
            <span>{{ formatDate(currentItem.updatedAt) }}</span>
          </template>
          Samuel Adeyanju Changed status to <v-chip>pending</v-chip>
        </v-timeline-item>

        <v-timeline-item color="pink" small>
          <template v-slot:opposite>
            <span>{{ formatDate(currentItem.updatedAt) }}</span>
          </template>
          Samuel Adeyanju Changed status to <v-chip>pending</v-chip>
        </v-timeline-item>

        <v-timeline-item color="teal lighten-3" small>
          <template v-slot:opposite>
            <span>{{ formatDate(currentItem.updatedAt) }}</span>
          </template>
          Samuel Adeyanju Changed status to <v-chip>pending</v-chip>
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
  async asyncData({ $axios, store, params }) {
    await $axios(`/job/${params.id}`, {
      method: "GET"
    })
      .then(res => {
        store.commit("setCurrentItem", res.data);
        console.log(res.data);
      })
      .catch(err => console.log(err.response));
  },

  computed: {
    currentItem() {
      return this.$store.state.currentItem;
    }
  },

  methods: {
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
  width: 20%;
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
