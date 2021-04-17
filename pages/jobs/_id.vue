<template>
  <!-- Begin Right Column Item Preview -->

  <v-card
    class="d-flex justify-space-between flex-column dash-item"
    height="84vh"
    outlined
    align-stretch
    width="100%"
    v-if="currentItem"
  >
    <v-card class="not-rounded" width="100%">
      <v-card-title class="text-center">
        <div class="my-5 text-center d-flex top-card">
          <div class="mr-15">
            <v-avatar color="primary" size="50" class="mb-5"> AS </v-avatar>
            <span class="d-block text-center"
              >{{ currentItem.sender }} Adeyanju</span
            >
          </div>
          <div class="job-attributes">
            <v-card-text class="text-left">
              <span>Status:</span>
              <v-chip color="primary" smallclass="mr-10">Pending</v-chip>
              <span>Date In:</span>
              <v-chip color="primary" small>25th Dec, 2020.</v-chip>
            </v-card-text>
            <v-card-text class="text-left">
              <span>Date Out:</span>
              <v-chip color="primary" small class="mr-10">25th Dec, 2020.</v-chip>
              <span>Lens:</span>
              <v-chip color="primary" small>Single Vision</v-chip>
            </v-card-text>
            <v-card-text class="text-left">
              <span>Frame:</span>
              <v-chip color="primary" small class="mr-10">Gucci</v-chip>
              <span>Amount:</span>
              <v-chip color="primary" small>10,000</v-chip>
            </v-card-text>
          </div>
        </div>
      </v-card-title>
    </v-card>
    <v-divider></v-divider>
    <v-card-text class="text-center">Message History</v-card-text>
    <v-divider></v-divider>
    <v-card flat height="100%" class="job-messages-scroll">
      <v-card-text style="clear: both">
        <div class="float-left">
          <span class="float-left mr-2">Client: </span>
          <v-card
            color="primary"
            max-width="400px"
            class="dash-item float-left mb-5"
            ><v-card-text class="ma-0 py-0 px-2 text-justify"
              >Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
              veniam animi commodi illo quibusdam mollitia labore. Accusamus
              alias, consequatur in, voluptatum est natus voluptatem iure
              dolorum nesciunt doloribus officiis voluptatibus.</v-card-text
            ></v-card
          >
        </div>
      </v-card-text>

      <v-card-text style="clear: both">
        <div class="float-left">
          <span class="float-left mr-2">Client: </span>
          <v-card
            color="primary"
            max-width="400px"
            class="dash-item float-left mb-5"
            ><v-card-text class="ma-0 py-0 px-2 text-justify"
              >Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
              veniam animi commodi illo quibusdam mollitia labore. Accusamus
              alias, consequatur in, voluptatum est natus voluptatem iure
              dolorum nesciunt doloribus officiis voluptatibus.</v-card-text
            ></v-card
          >
        </div>
      </v-card-text>

      <v-card-text style="clear: both">
        <div class="float-right">
          <span class="mr-2 float-left">You:</span>
          <v-card max-width="400px" class="float-left dash-item"
            ><v-card-text class="ma-0 py-0 px-2 text-justify"
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Praesentium totam optio animi unde pariatur delectus tempora neque
              quidem cupiditate voluptatem. Doloribus repellendus pariatur
              aliquam consequuntur obcaecati ullam suscipit culpa. Expedita.
            </v-card-text></v-card
          >
        </div>
      </v-card-text>
    </v-card>
    <v-card max-height="55px" class=""
      ><v-bottom-navigation>
        <v-icon class="ml-3">mdi-attachment</v-icon>
        <v-textarea
          placeholder="Type a message"
          class="mt-4"
          rows="1"
          rounded
          no-resize
          dense
        ></v-textarea
        ><v-icon class="mr-3">mdi-send</v-icon>
      </v-bottom-navigation>
    </v-card>
  </v-card>

  <!-- End Right Column Item Preview -->

  <!-- Start Preview Placeholder -->

  <v-card
    v-else
    height="100%"
    class="ml-3 d-flex justify-center align-center dash-item"
    cols="12"
    width="100%"
  >
    <v-card-title>Please select a job to view.</v-card-title>
  </v-card>

  <!-- End Preview Placeholder -->
</template>

<script>
export default {
  layout: 'full-screen',
  async asyncData({ params, redirect }) {
    let items = [
      {
        id: 1,
        sender: "Samuel",
        message: "How are you",
        type: "email",
        read: false,
        selected: false
      },
      {
        id: 2,
        sender: "Tosin",
        message: "Sup Whaisd ",
        type: "chat",
        read: false,
        selected: false
      },
      {
        id: 3,
        sender: "Tosin",
        message: "Sup Whaisd ",
        type: "chat",
        read: false,
        selected: false
      },
      {
        id: 4,
        sender: "Tosin",
        message: "Sup Whaisd ",
        type: "chat",
        read: false,
        selected: false
      },
      {
        id: 5,
        sender: "Tosin",
        message: "Sup Whaisd ",
        type: "chat",
        read: false,
        selected: false
      },
      {
        id: 6,
        sender: "Tosin",
        message: "Sup Whaisd ",
        type: "chat",
        read: false,
        selected: false
      },
      {
        id: 7,
        sender: "Tosin",
        message: "Sup Whaisd ",
        type: "chat",
        read: false,
        selected: false
      },
      {
        id: 8,
        sender: "Samuel",
        message: "How are you",
        type: "email",
        read: false,
        selected: false
      },
      {
        id: 9,
        sender: "Samuel",
        message: "How are you",
        type: "email",
        read: false,
        selected: false
      },
      {
        id: 10,
        sender: "Samuel",
        message: "How are you",
        type: "email",
        read: false,
        selected: false
      }
    ];

    let filteredItem = items.filter(i => i.id == params.id);

    if (!filteredItem) return redirect("/");

    return { currentItem: filteredItem };
  }
};
</script>

<style>
div.top-card {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
}

.job-messages-scroll {
  overflow-y: scroll;
}

.job-attributes {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 1rem;
}
</style>
