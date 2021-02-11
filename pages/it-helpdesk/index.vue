<template>
  <div>
    <v-card class="rounded-xl mt-1">
      <v-card-title>
        <span class="mr-5 subheading primary--text">Issues</span>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search Issues"
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
          :fullscreen="$vuetify.breakpoint.smAndDown"
          overlay-color="primary"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              outlined
              class="text-capitalize ml-3"
              v-bind="attrs"
              v-on="on"
              ><v-icon
                :left="$vuetify.breakpoint.smAndDown ? false : true"
                small
                >mdi-plus</v-icon
              >
              <span :hidden="$vuetify.breakpoint.smAndDown"
                >New Issue</span
              ></v-btn
            >
          </template>
          <v-card class="rounded-xl">
            <v-card-title>
              <span class="headline primary--text">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          label="Date"
                          prepend-icon="mdi-calendar"
                          readonly
                          :value="editedItem.date"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        locale="en-us"
                        v-model="editedItem.date"
                        no-title
                        @input="menu2 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      label="Branch"
                      v-model="editedItem.branch"
                      prepend-icon="mdi-pin"
                      :items="['Lekki', 'Ajah', 'Osapa']"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-text-field
                      label="Staff Name"
                      v-model="editedItem.name"
                      prepend-icon="mdi-account"
                      hint="enter your name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      label="Details"
                      v-model="editedItem.detail"
                      prepend-icon="mdi-more"
                      rows="2"
                      no-resize
                    ></v-textarea>
                  </v-col>
                  <v-col cols="6" :hidden="!editingItem">
                    <v-select
                      v-model="editedItem.status"
                      :items="[
                        { text: 'Pending', value: 'Pending' },
                        { text: 'Ongoing', value: 'Ongoing' },
                        { text: 'Completed', value: 'Completed' },
                      ]"
                      prepend-icon="mdi-update"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="6" :hidden="!editingItem">
                    <v-select
                      v-model="editedItem.assigned"
                      :items="[
                        { text: 'Samuel', value: 'Samuel' },
                        { text: 'Segun', value: 'Segun' },
                        { text: 'Korede', value: 'Korede' },
                      ]"
                      prepend-icon="mdi-account"
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="save()"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- End Create and Edit Dialog -->

        <!-- Begin Delete Dialog -->

        <v-dialog v-model="dialogDelete" max-width="500px" overlay-color="red" class="rounded-xl">
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
              >Are you sure you want to delete Issue?</v-card-title
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

      <!-- Begin Data Table -->

      <v-data-table
        :items-per-page="8"
        :footer-props="{
          'items-per-page-options': [8, 10, 15, 20, -1],
        }"
        :headers="headers"
        :items="issues"
        :search="search"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            color="accent"
            small
            text
            class="rounded-xl text-capitalize body-2 mr-2 px-1"
            >View</v-btn
          >
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

      <!-- End Data Table -->
    </v-card>
  </div>
</template>

<script>
export default {
  name: "IT-HelpDesk",

  data: () => {
    return {
      search: "",
      menu2: false,
      menu3: false,
      dialog: false,
      dialogDelete: false,
      editingItem: false,
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
          text: "Detail",
          value: "detail",
        },
        {
          text: "Assigned",
          value: "assigned",
        },
        {
          text: "Status",
          value: "status",
        },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],
      issues: [],
      editedIndex: -1,
      editedItem: {
        id: null,
        name: "",
        date: null,
        detail: "",
        assigned: "",
        status: "",
        branch: "",
      },
      defaultItem: {
        id: null,
        name: "",
        date: null,
        detail: "",
        assigned: "",
        status: "",
        branch: "",
      },
      itemToDelete: {},
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Issue" : "Edit Issue";
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
    initialize() {
      this.issues = [
        {
          id: 1,
          name: "Uju",
          date: "2021-01-28",
          detail: "leuiuer eruieruier reireuier erierie rerruier",
          assigned: "Samuel",
          status: "Pending",
          branch: "Lekki",
        },
        {
          id: 2,
          name: "Uju",
          date: "2021-01-28",
          detail: "leuiuer eruieruier reireuier erierie rerruier",
          assigned: "Samuel",
          status: "Pending",
          branch: "Lekki",
        },
        {
          id: 3,
          name: "Uju",
          date: "2021-01-28",
          detail: "leuiuer eruieruier reireuier erierie rerruier",
          assigned: "Samuel",
          status: "Pending",
          branch: "Lekki",
        },
        {
          id: 4,
          name: "Uju",
          date: "2021-01-28",
          detail: "leuiuer eruieruier reireuier erierie rerruier",
          assigned: "Samuel",
          status: "Pending",
          branch: "Lekki",
        },
        {
          id: 5,
          name: "Uju",
          date: "2021-01-28",
          detail: "leuiuer eruieruier reireuier erierie rerruier",
          assigned: "Samuel",
          status: "Pending",
          branch: "Lekki",
        },
        {
          id: 6,
          name: "Uju",
          date: "2021-01-28",
          detail: "leuiuer eruieruier reireuier erierie rerruier",
          assigned: "Samuel",
          status: "Pending",
          branch: "Lekki",
        },
        {
          id: 7,
          name: "Uju",
          date: "2021-01-28",
          detail: "leuiuer eruieruier reireuier erierie rerruier",
          assigned: "Samuel",
          status: "Pending",
          branch: "Lekki",
        },
        {
          id: 8,
          name: "Uju",
          date: "2021-01-28",
          detail: "leuiuer eruieruier reireuier erierie rerruier",
          assigned: "Samuel",
          status: "Pending",
          branch: "Lekki",
        },
        {
          id: 9,
          name: "Uju",
          date: "2021-01-28",
          detail: "leuiuer eruieruier reireuier erierie rerruier",
          assigned: "Samuel",
          status: "Pending",
          branch: "Lekki",
        },
        {
          id: 10,
          name: "Uju",
          date: "2021-01-28",
          detail: "leuiuer eruieruier reireuier erierie rerruier",
          assigned: "Samuel",
          status: "Pending",
          branch: "Lekki",
        },
        {
          id: 11,
          name: "Uju",
          date: "2021-01-28",
          detail: "leuiuer eruieruier reireuier erierie rerruier",
          assigned: "Samuel",
          status: "Pending",
          branch: "Lekki",
        },
      ];
    },

    editItem(item) {
      this.editingItem = true;
      this.editedIndex = this.issues.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.issues.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.itemToDelete = item;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.issues.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.editingItem = false;
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
        Object.assign(this.issues[this.editedIndex], this.editedItem);
      } else {
        this.editedItem.assigned = "Samuel";
        this.editedItem.status = "Pending";
        this.issues.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style>
</style>