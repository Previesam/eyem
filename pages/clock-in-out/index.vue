<template>
  <div>
    <v-card class="rounded-xl mt-1">
      <v-card-title>
        <span class="mr-5 subheading primary--text">Clock In/Out</span>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          outlined
          color="primary"
          hide-details
          class="search-box"
          dense
        ></v-text-field>
        <v-spacer></v-spacer>

        <!-- Begin Create and Edit Dialog -->

        <v-dialog
          v-model="dialog"
          persistent
          max-width="800px"
          scrollable
          :fullscreen="$vuetify.breakpoint.width < 500"
          overlay-color="primary"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              outlined
              class="text-capitalize"
              v-bind="attrs"
              v-on="on"
              ><v-icon
                :left="$vuetify.breakpoint.width < 500 ? false : true"
                small
                >mdi-plus</v-icon
              >
              <span :hidden="$vuetify.breakpoint.width < 500">Clock In</span>
            </v-btn>
          </template>
          <v-card :class="$vuetify.breakpoint.smAndDown ? '' : 'rounded-xl'">
            <v-card-title>
              <span class="headline primary--text">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row class="justify-content-center">
                  <v-col v-if="image" class="my-0 mx-auto" lg="6" md="6" sm="8">
                    <v-img :src="imageUrl"></v-img>
                  </v-col>
                  <v-col v-else class="my-0 mx-auto" lg="6" md="6" sm="8">
                    <v-file-input
                      accept="image/*"
                      label="Snap/Choose Photo"
                      outlined
                      dense
                      v-model="image"
                      @change="displayImage"
                    ></v-file-input>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col v-if="image" class="my-0 mx-auto" lg="6" md="6" sm="8">
                    <v-text-field
                      label="Caption"
                      outlined
                      dense
                      v-model="editedItem.caption"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false; image = null; imageUrl = null">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="save()"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- End Create and Edit Dialog -->

        <!-- Begin Delete Dialog -->

        <v-dialog
          v-model="dialogDelete"
          max-width="500px"
          overlay-color="red"
          class="rounded-xl"
        >
          <v-card
            class="py-auto px-auto rounded-xl"
            max-width="100%"
            min-height="300px"
          >
            <v-card-title
              ><v-icon class="mt-10 mb-1 mx-auto" x-large color="red"
                >mdi-delete</v-icon
              ></v-card-title
            >
            <v-card-title class="my-3 subheading text-center justify-center"
              >Are you sure you want to delete Clock In & Out?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">No</v-btn>
              <v-btn
                elevation="2"
                color="red darken-1"
                text
                @click="deleteItemConfirm"
                >Yes</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- End Delete Dialog -->
      </v-card-title>
      <v-data-table
        :items-per-page="8"
        :footer-props="{
          'items-per-page-options': [8, 10, 15, 20, -1],
        }"
        :headers="headers"
        :items="clockInOut"
        :search="search"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            color="accent"
            small
            text
            class="text-capitalize body-2 mr-2 rounded-xl"
          >
            Clock Out
          </v-btn>
          <v-icon color="primary" small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon color="red" small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "ClockInOut",

  data: () => {
    return {
      search: "",
      menu2: false,
      menu3: false,
      dialog: false,
      dialogDelete: false,
      image: null,
      imageUrl: null,
      headers: [
        {
          text: "Date",
          value: "date",
        },
        {
          text: "Staff Name",
          value: "name",
        },
        {
          text: "Time in",
          value: "timeIn",
          align: "center",
        },
        {
          text: "Time Out",
          value: "timeOut",
          align: "center",
        },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],
      clockInOut: [],
      editedIndex: -1,
      editedItem: {
        id: null,
        name: "",
        date: null,
        timeIn: "",
        timeOut: "",
        branch: "",
      },
      defaultItem: {
        id: null,
        name: "",
        date: null,
        timeIn: "",
        timeOut: "",
        branch: "",
      },
      itemToDelete: {},
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Clock In" : "Clock Out";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    displayImage() {
      this.imageUrl = URL.createObjectURL(this.image);
    },

    initialize() {
      this.clockInOut = [
        {
          id: 1,
          name: "Desmond",
          date: "28-01-2020",
          timeIn: "8:45 am",
          timeOut: "6:30 pm",
          branch: "Lekki",
        },
        {
          id: 2,
          name: "Desmond",
          date: "28-01-2020",
          timeIn: "8:45 am",
          timeOut: "6:30 pm",
          branch: "Lekki",
        },
        {
          id: 3,
          name: "Desmond",
          date: "28-01-2020",
          timeIn: "8:45 am",
          timeOut: "6:30 pm",
          branch: "Lekki",
        },
        {
          id: 4,
          name: "Desmond",
          date: "28-01-2020",
          timeIn: "8:45 am",
          timeOut: "6:30 pm",
          branch: "Lekki",
        },
        {
          id: 5,
          name: "Desmond",
          date: "28-01-2020",
          timeIn: "8:45 am",
          timeOut: "6:30 pm",
          branch: "Lekki",
        },
        {
          id: 6,
          name: "Desmond",
          date: "28-01-2020",
          timeIn: "8:45 am",
          timeOut: "6:30 pm",
          branch: "Lekki",
        },
        {
          id: 7,
          name: "Desmond",
          date: "28-01-2020",
          timeIn: "8:45 am",
          timeOut: "6:30 pm",
          branch: "Lekki",
        },
        {
          id: 8,
          name: "Desmond",
          date: "28-01-2020",
          timeIn: "8:45 am",
          timeOut: "6:30 pm",
          branch: "Lekki",
        },
        {
          id: 9,
          name: "Desmond",
          date: "28-01-2020",
          timeIn: "8:45 am",
          timeOut: "6:30 pm",
          branch: "Lekki",
        },
        {
          id: 10,
          name: "Desmond",
          date: "28-01-2020",
          timeIn: "8:45 am",
          timeOut: "6:30 pm",
          branch: "Lekki",
        },
        {
          id: 11,
          name: "Desmond",
          date: "28-01-2020",
          timeIn: "8:45 am",
          timeOut: "6:30 pm",
          branch: "Lekki",
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.clockInOut.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.clockInOut.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.itemToDelete = item;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.clockInOut.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.clockInOut[this.editedIndex], this.editedItem);
      } else {
        this.clockInOut.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style>
</style>