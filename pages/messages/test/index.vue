<template>
  <div>
    <v-card
      class="d-flex justify-space-between dash-item"
      color="transparent"
      flat
      height="85vh"
    >
      <v-card class="dash-item" outlined align-stretch width="35%">
        <v-list subheader height="100%" class="pt-5"
          ><v-list-item>
            <v-text-field
              v-model="searchKeyword"
              dense
              class="px-2"
              outlined
              rounded
              prepend-inner-icon="mdi-magnify"
              placeholder="Search conversations"
            ></v-text-field>
          </v-list-item>
          <v-divider></v-divider>
          <div class="overflow-scroll" v-if="!searchKeyword">
            <v-list-item
              class="conversation"
              v-for="item in items"
              :key="item.id"
              :class="item.id === currentItem.id ? 'active' : ''"
              @click="active(item)"
            >
              <v-list-item-avatar color="primary" size="40">
                <!-- <v-icon class="grey lighten-1" dark> mdi-folder </v-icon> -->AS
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="item.sender"></v-list-item-title>

                <v-list-item-subtitle
                  v-text="`You: ${item.message}`"
                ></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action class="caption">
                11:59pm
                <!-- <v-btn icon>
                  <v-icon color="grey lighten-1">mdi-information</v-icon>
                </v-btn> -->
              </v-list-item-action>
              <v-badge class="mr-5" color="green" content="999+"></v-badge>
            </v-list-item>
          </div>
          <div class="overflow-scroll" v-else>
            <v-list-item class="caption">Search Results</v-list-item>
            <v-list-item
              class="conversation"
              v-for="item in items"
              :key="item.id"
              :class="item.id === currentItem.id ? 'active' : ''"
              @click="active(item)"
            >
              <v-list-item-avatar color="primary" size="40">
                <!-- <v-icon class="grey lighten-1" dark> mdi-folder </v-icon> -->AS
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="item.sender"></v-list-item-title>

                <v-list-item-subtitle
                  v-text="`You: ${item.message}`"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action class="caption">
                11:59pm
                <!-- <v-btn icon>
                  <v-icon color="grey lighten-1">mdi-information</v-icon>
                </v-btn> -->
              </v-list-item-action>
              <v-badge class="mr-5" color="green" content="999"></v-badge>
            </v-list-item>
          </div>
          <v-btn class="mb-10" color="primary" dark absolute bottom right fab
            ><v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-list>
      </v-card>
      <v-card
        class="ml-3 d-flex justify-space-between flex-column dash-item"
        outlined
        align-stretch
        width="65%"
        v-if="currentItem"
      >
        <v-card style="flex-grow: 1">
          <v-app-bar flat class="not-rounded">
            <v-avatar color="primary" size="40"> AS </v-avatar>
            <v-toolbar-title class="ml-5">
              {{ currentItem.sender }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon class="mr-2">mdi-magnify</v-icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-app-bar>
          <v-row class="conversation-view">
            <v-col class="ma-2" cols="12">
              <v-avatar class="ml-2 float-left" color="primary" size="30"
                >AS</v-avatar
              >
              <v-card
                width="250"
                min-height="150"
                class="dash-item float-left ml-3"
                color="primary"
              >
                <v-card-text
                  >Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Impedit odio quod culpa magni cum voluptatem deserunt dolor
                  cumque enim quibusdam odit, molestias aliquid sed doloremque
                  consequuntur similique suscipit maiores aut!</v-card-text
                >
                <v-card-action class="float-right caption pr-2"
                  >8:40pm</v-card-action
                >
              </v-card>
            </v-col>
            <v-col class="my-2 ml-2" cols="12">
              <v-avatar class="float-right" color="primary" size="30"
                >AS</v-avatar
              >
              <v-card
                width="250"
                min-height="150"
                class="dash-item float-right mr-3"
              >
                <v-card-text
                  >Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Impedit odio quod culpa magni cum voluptatem deserunt dolor
                  cumque enim quibusdam odit.</v-card-text
                >
                <v-card-action class="float-right caption pr-2"
                  >8:40pm</v-card-action
                >
              </v-card>
            </v-col>
            <v-col class="my-2 ml-2" cols="12">
              <v-avatar class="float-right" color="primary" size="30"
                >AS</v-avatar
              >
              <v-card
                width="250"
                min-height="150"
                class="dash-item float-right mr-3"
              >
                <v-card-text
                  >Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Impedit odio quod culpa magni cum voluptatem deserunt dolor
                  cumque enim quibusdam odit.</v-card-text
                >
                <v-card-action class="float-right caption pr-2"
                  >8:40pm</v-card-action
                >
              </v-card>
            </v-col>
            <v-col class="ma-2" cols="12">
              <v-avatar class="ml-2 float-left" color="primary" size="30"
                >AS</v-avatar
              >
              <v-card
                width="250"
                min-height="150"
                class="dash-item float-left ml-3"
                color="primary"
              >
                <v-card-text
                  >Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Impedit odio quod culpa magni cum voluptatem deserunt dolor
                  cumque enim quibusdam odit, molestias aliquid sed doloremque
                  consequuntur similique suscipit maiores aut!</v-card-text
                >
                <v-card-action class="float-right caption pr-2"
                  >8:40pm</v-card-action
                >
              </v-card>
            </v-col>
          </v-row>
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
      <v-card
            v-else
            height="100%"
            class="ml-3 d-flex justify-center align-center dash-item"
            cols="12"
            width="65%"
          >
            <v-card-title>Please select a conversation to view.</v-card-title>
          </v-card>
          <!-- <v-card height="500px">
            <div v-for="(group, key) in groupedPeople" :key="key">
              {{ key }}
              <p v-for="person in group" :key="person.name">
                {{ person.name }}
              </p>
            </div>
          </v-card> -->
        </v-card>
  </div>
</template>

<script>
export default {
  name: "Messages",
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
        },
        {
          id: 2,
          sender: "Tosin",
          message: "Sup Whaisd ",
          type: "chat",
          read: false,
        },
        {
          id: 3,
          sender: "Tosin",
          message: "Sup Whaisd ",
          type: "chat",
          read: false,
        },
        {
          id: 4,
          sender: "Tosin",
          message: "Sup Whaisd ",
          type: "chat",
          read: false,
        },
        {
          id: 5,
          sender: "Tosin",
          message: "Sup Whaisd ",
          type: "chat",
          read: false,
        },
        {
          id: 6,
          sender: "Tosin",
          message: "Sup Whaisd ",
          type: "chat",
          read: false,
        },
        {
          id: 7,
          sender: "Tosin",
          message: "Sup Whaisd ",
          type: "chat",
          read: false,
        },
        {
          id: 8,
          sender: "Samuel",
          message: "How are you",
          type: "email",
          read: false,
        },
        {
          id: 9,
          sender: "Samuel",
          message: "How are you",
          type: "email",
          read: false,
        },
        {
          id: 10,
          sender: "Samuel",
          message: "How are you",
          type: "email",
          read: false,
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
      people: [
        { name: "Lee", age: 21 },
        { name: "Ajay", age: 20 },
        { name: "Jane", age: 20 },
      ],
    };
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },

    groupedPeople() {
      return this.groupBy(this.people, "age");
    },
  },
  methods: {
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

    groupBy(objectArray, property) {
      return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        // Add object to list for given key's value
        acc[key].push(obj);
        return acc;
      }, {});
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
.conversation-view {
  height: 69.8vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 0;
}

.conversation-list {
  max-width: 40%;
}

.chat-nav {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>>
