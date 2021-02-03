<template>
  <!-- Begin Main Page Div -->
  <div>
    <!-- Begin Two Column Card Container -->
    <v-card
      class="d-flex justify-space-between dash-item"
      color="transparent"
      flat
      height="85vh"
    >
      <!-- Begin Left Column -->
      <v-card class="dash-item" outlined align-stretch width="35%">
        <!-- Begin Jobs List -->

        <v-list subheader height="85vh" class="pt-5" two-line
          ><v-list-item>
            <!-- Begin Search Box -->

            <v-text-field
              v-model="searchKeyword"
              dense
              class="px-2"
              outlined
              rounded
              prepend-inner-icon="mdi-magnify"
              placeholder="Search conversations"
            ></v-text-field>

            <!-- End Search Box -->
          </v-list-item>
          <v-divider></v-divider>

          <!-- Begin Job List When No Search Result -->

          <div class="overflow-scroll" v-if="!searchKeyword">
            <v-list-item
              class="conversation"
              v-for="item in items"
              :key="item.id"
              :class="
                item.id === currentItem.id ||
                selectedItems.findIndex((x) => x.id === item.id) > -1
                  ? 'active'
                  : ''
              "
              @click="active(item)"
            >
              <!-- <v-list-item-avatar color="primary" size="40">
                  <v-icon class="grey lighten-1" dark> mdi-folder </v-icon>AS
                </v-list-item-avatar> -->

              <v-list-item-action class="mx-0 px-0 mr-3">
                <v-checkbox
                  v-model="item.selected"
                  dense
                  rounded
                  @click="selectJob(item)"
                ></v-checkbox>
              </v-list-item-action>

              <v-list-item-content class="mr-10 px-0">
                <v-list-item-title
                  v-text="`${item.sender} Adeyanju Oluekmios`"
                ></v-list-item-title>

                <v-list-item-subtitle
                  v-text="`Due: 27th Jan, 20`"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content class="mr-2">
                <v-list-item-subtitle
                  v-text="`Frame: ${item.sender}`"
                ></v-list-item-subtitle>

                <v-list-item-subtitle
                  v-text="`Lens: ${item.message}`"
                ></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-content class="px-0 mx-0">
                <v-list-item-subtitle class="caption">
                  Status:
                  <v-chip class="px-1 py-0" small color="warning"
                    >odiooi</v-chip
                  ></v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </div>

          <!-- Begin Search Result -->

          <div class="overflow-scroll" v-else>
            <v-list-item class="caption">Search Results</v-list-item>
            <v-list-item
              class="conversation"
              v-for="item in items"
              :key="item.id"
              :class="
                item.id === currentItem.id ||
                selectedItems.findIndex((x) => x.id === item.id) > -1
                  ? 'active'
                  : ''
              "
              @click="active(item)"
            >
              <!-- <v-list-item-avatar color="primary" size="40">
                  <v-icon class="grey lighten-1" dark> mdi-folder </v-icon>AS
                </v-list-item-avatar> -->

              <v-list-item-action class="mx-0 px-0 mr-3">
                <v-checkbox
                  v-model="item.selected"
                  dense
                  rounded
                  @click="selectJob(item)"
                ></v-checkbox>
              </v-list-item-action>

              <v-list-item-content class="mr-10 px-0">
                <v-list-item-title
                  v-text="`${item.sender} Adeyanju Oluekmios`"
                ></v-list-item-title>

                <v-list-item-subtitle
                  v-text="`Due: 27th Jan, 20`"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content class="mr-2">
                <v-list-item-subtitle
                  v-text="`Frame: ${item.sender}`"
                ></v-list-item-subtitle>

                <v-list-item-subtitle
                  v-text="`Lens: ${item.message}`"
                ></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-content class="px-0 mx-0">
                <v-list-item-subtitle class="caption">
                  Status:
                  <v-chip class="px-1 py-0" small color="warning"
                    >odiooi</v-chip
                  ></v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </div>
          <!-- End Search Result  -->

          <!-- Begin Action Button -->
          <v-btn class="mb-10" color="primary" dark absolute bottom right fab
            ><v-icon>mdi-plus</v-icon>
          </v-btn>
          <!-- End Action Button -->
        </v-list>

        <!-- End Job Lists -->
      </v-card>

      <!-- End Left Column -->

      <!-- Begin Right Column Item Preview -->

      <v-card
        class="ml-3 d-flex justify-space-between flex-column dash-item"
        outlined
        align-stretch
        width="65%"
        v-if="currentItem"
      >
        <v-card height="40vh" class="not-rounded">
          <v-card-title class="text-center">
            <v-spacer></v-spacer>
            <div class="my-5 text-center">
              <v-avatar color="primary" size="50" class="mb-5"> AS </v-avatar>
              <span class="d-block text-center"
                >{{ currentItem.sender }} Adeyanju</span
              >
            </div>

            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text class="text-center">
            <span>Status:</span>
            <v-chip color="primary" small>Pending</v-chip>
            <span class="ml-10">Date In:</span>
            <v-chip color="primary" small>25th Dec, 2020.</v-chip>
            <span class="ml-10">Date Out:</span>
            <v-chip color="primary" small>25th Dec, 2020.</v-chip>
          </v-card-text>
          <v-card-text class="text-center">
            <span>Lens:</span>
            <v-chip color="primary" small>Single Vision</v-chip>
            <span class="ml-10">Frame:</span>
            <v-chip color="primary" small>Gucci</v-chip>
            <span class="ml-10">Amount:</span>
            <v-chip color="primary" small>10,000</v-chip>
            <v-spacer></v-spacer>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card-text class="text-center">Message History</v-card-text>
        <v-divider></v-divider>
        <v-card flat height="35vh" class="job-messages-scroll">
          <v-card-text>
            <div class="float-left">
              <span class="float-left mr-2">Client: </span>
              <v-card
                color="primary"
                max-width="400px"
                class="dash-item float-left mb-5"
                ><v-card-text class="ma-0 py-0 px-2 text-justify"
                  >Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Aliquam veniam animi commodi illo quibusdam mollitia labore.
                  Accusamus alias, consequatur in, voluptatum est natus
                  voluptatem iure dolorum nesciunt doloribus officiis
                  voluptatibus.</v-card-text
                ></v-card
              >
            </div>
          </v-card-text>

          <v-card-text>
            <div class="float-left">
              <span class="float-left mr-2">Client: </span>
              <v-card
                color="primary"
                max-width="400px"
                class="dash-item float-left mb-5"
                ><v-card-text class="ma-0 py-0 px-2 text-justify"
                  >Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Aliquam veniam animi commodi illo quibusdam mollitia labore.
                  Accusamus alias, consequatur in, voluptatum est natus
                  voluptatem iure dolorum nesciunt doloribus officiis
                  voluptatibus.</v-card-text
                ></v-card
              >
            </div>
          </v-card-text>

          <v-card-text>
            <div class="float-right">
              <span class="mr-2 float-left">You:</span>
              <v-card max-width="400px" class="float-left dash-item"
                ><v-card-text class="ma-0 py-0 px-2 text-justify"
                  >Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Praesentium totam optio animi unde pariatur delectus tempora
                  neque quidem cupiditate voluptatem. Doloribus repellendus
                  pariatur aliquam consequuntur obcaecati ullam suscipit culpa.
                  Expedita.
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
        width="65%"
      >
        <v-card-title>Please select a job to view.</v-card-title>
      </v-card>

      <!-- End Preview Placeholder -->

      <!-- <v-card height="500px">
            <div v-for="(group, key) in groupedPeople" :key="key">
              {{ key }}
              <p v-for="person in group" :key="person.name">
                {{ person.name }}
              </p>
            </div>
          </v-card> -->
    </v-card>

    <!-- End Two Column Card Container -->
  </div>

  <!-- End Main Page Div -->
</template>

<script>
export default {
  name: "Jobs",
  data: () => {
    return {
      searchKeyword: "",
      items: [
        {
          id: 1,
          sender: "Samuel",
          message: "How are you",
          type: "email",
          read: false,
          selected: false,
        },
        {
          id: 2,
          sender: "Tosin",
          message: "Sup Whaisd ",
          type: "chat",
          read: false,
          selected: false,
        },
        {
          id: 3,
          sender: "Tosin",
          message: "Sup Whaisd ",
          type: "chat",
          read: false,
          selected: false,
        },
        {
          id: 4,
          sender: "Tosin",
          message: "Sup Whaisd ",
          type: "chat",
          read: false,
          selected: false,
        },
        {
          id: 5,
          sender: "Tosin",
          message: "Sup Whaisd ",
          type: "chat",
          read: false,
          selected: false,
        },
        {
          id: 6,
          sender: "Tosin",
          message: "Sup Whaisd ",
          type: "chat",
          read: false,
          selected: false,
        },
        {
          id: 7,
          sender: "Tosin",
          message: "Sup Whaisd ",
          type: "chat",
          read: false,
          selected: false,
        },
        {
          id: 8,
          sender: "Samuel",
          message: "How are you",
          type: "email",
          read: false,
          selected: false,
        },
        {
          id: 9,
          sender: "Samuel",
          message: "How are you",
          type: "email",
          read: false,
          selected: false,
        },
        {
          id: 10,
          sender: "Samuel",
          message: "How are you",
          type: "email",
          read: false,
          selected: false,
        },
      ],
      itemsPerPageArray: [4, 8, 12],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: "sender",
      keys: ["id", "sender", "message", "type"],
      currentItem: "",
      selectedItems: [],
    };
  },

  computed: {
    items() {
      return this.items;
    },
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
  },
  methods: {
    selectJob(item) {
      var foundSelected = this.selectedItems.findIndex((x) => x.id === item.id);
      if (foundSelected > -1) {
        this.selectedItems.splice(foundSelected, 1);
      } else this.selectedItems.push(item);
      // var findIndex = this.items.findIndex(x => x.id === item.id);
      // this.items[findIndex].selected = !this.items[findIndex].selected;
    },

    active(item) {
      this.currentItem = item;
      this.searchKeyword = "";
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
  },
};
</script>

<style scoped>
.filter {
  border-radius: 50px;
}
.conversation:hover {
  background-color: rgba(156, 156, 156, 0.294);
}

.active {
  background-color: rgba(156, 156, 156, 0.294);
}

.dash-item {
  border-radius: 15px;
}

.not-rounded {
  border-bottom-right-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  border-top-right-radius: 15px !important;
  border-top-left-radius: 15px !important;
}
.overflow-scroll {
  height: 71vh;
  overflow: auto;
}
.conversation-list {
  max-width: 40%;
}

.job-messages {
  height: 85vh;
}

.job-messages-scroll {
  overflow-y: scroll;
}
</style>>
