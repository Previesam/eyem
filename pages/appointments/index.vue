<template>
  <div>
    <v-card :min-height="$vuetify.breakpoint.mobile ? '86vh' : '84.6vh'" width="100%" class="rounded mt-1">
      <v-card-title>
        <!-- <span class="mr-5 subheading primary--text">Appointments</span> -->

        <!-- Begin Search Box -->

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search Appointments"
          single-line
          outlined
          color="primary"
          hide-details
          dense
          class="search-box"
        ></v-text-field>

        <!-- End Search Box -->

        <v-spacer></v-spacer>

        <!-- Begin Create and Edit Dialog -->

        <v-dialog
          v-model="dialog"
          persistent
          max-width="800px"
          scrollable
          :fullscreen="$vuetify.breakpoint.width >= 600 ? false : true"
          overlay-color="blue"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              outlined
              class="text-capitalize"
              v-bind="attrs"
              v-on="on"
              ><v-icon
                :left="$vuetify.breakpoint.smAndDown ? false : true"
                small
                >mdi-plus</v-icon
              >
              <span :hidden="$vuetify.breakpoint.smAndDown"
                >New Appointment</span
              >
            </v-btn>
          </template>
          <v-card :class="$vuetify.breakpoint.width >= 600 ? 'rounded' : ''">
            <v-card-title>
              <span class="headline primary--text">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          label="Appointment Date"
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
                  <v-col cols="12" sm="6" md="3">
                    <v-menu
                      ref="timeMenu"
                      v-model="menu3"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="editedItem.time"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.time"
                          label="Time"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menu3"
                        no-title
                        v-model="editedItem.time"
                        full-width
                        @click:minute="$refs.timeMenu.save(editedItem.time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <!-- <v-text-field
                      label="Patient Name"
                      v-model="editedItem.client"
                      prepend-icon="mdi-account"
                      hint="enter the patient full name"
                    ></v-text-field> -->

                    <v-autocomplete
                      :items="clients"
                      v-model="editedItem.client"
                      :search-input.sync="clientSearch"
                      prepend-icon="mdi-account"
                      label="Patient"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      label="Doctor"
                      v-model="editedItem.doctor"
                      prepend-icon="mdi-doctor"
                      :items="['Samuel', 'Tosin', 'Chinomso']"
                    >
                    </v-select>
                    <!-- <v-text-field label="Doctor*" required></v-text-field> -->
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-autocomplete
                      :items="[
                        'Consultation',
                        ' Follow Up',
                        ' Opthalmologist Consultation',
                        ' Tonometry',
                        ' Surgery'
                      ]"
                      v-model="editedItem.reason"
                      prepend-icon="mdi-details"
                      label="Appointment Reason"
                      multiple
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
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

        <v-dialog
          v-model="dialogDelete"
          max-width="500px"
          overlay-color="red"
          class="rounded"
        >
          <v-card
            class="py-auto px-auto rounded"
            max-width="100%"
            min-height="300px"
          >
            <v-card-title
              ><v-icon class="mt-10 mb-1 mx-auto" x-large color="red"
                >mdi-delete</v-icon
              ></v-card-title
            >
            <v-card-title class="my-3 subheading text-center"
              >Are you sure you want to delete
              {{ getItemToDelete() }}
              Appointment?</v-card-title
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
        style="overflow: auto"
        :headers="headers"
        :items="appointments"
        :search="search"
        sort-by="date"
        :sort-desc="true"
        :items-per-page="8"
        :footer-props="{
          'items-per-page-options': [8, 10, 15, 20, -1]
        }"
      >
        <template v-slot:[`item.client`]="{ item }">
          <span v-if="item.client.includes('-')">{{ itemClient(item) }}</span>
          <span v-else>{{ item.client }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            color="accent"
            small
            text
            class="rounded text-capitalize body-2 mr-2"
            >See</v-btn
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
import format from "date-fns/format";

export default {
  name: "Appointments",

  data: () => {
    return {
      search: "",
      menu2: false,
      menu3: false,
      dialog: false,
      dialogDelete: false,
      clientSearch: null,
      headers: [
        {
          text: "Patient Name",
          value: "client"
        },
        {
          text: "Apoint. Date",
          value: "date"
        },
        {
          text: "Time",
          value: "time"
        },
        {
          text: "Doctor",
          value: "doctor"
        },
        {
          text: "Reason",
          value: "reason"
        },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          sortable: false
        }
      ],
      appointments: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        client: "",
        date: null,
        time: "",
        doctor: "",
        reason: []
      },
      defaultItem: {
        id: 0,
        client: "",
        date: null,
        time: "",
        doctor: "",
        reason: []
      },
      itemToDelete: {}
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Appointment" : "Edit Appointment";
    },
    clients() {
      let clients = this.$store.state.clients
        .filter(item => item.Name)
        .map(m => {
          if (!m.Code) return m.Name;
          return `${m.Code} - ${m.Name}`;
        });
      return clients;
    },
    reason() {
      return this.editedItem.reason.length;
    },
    id() {
      return this.editedItem.id;
    },
    client() {
      return this.editedItem.client;
    },
    date() {
      return this.editedItem.date;
    },
    time() {
      return this.editedItem.time;
    },
    doctor() {
      return this.editedItem.doctor;
    }
  },

  watch: {
    clientSearch(val) {
      console.log(val)
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    reason() {
      this.saveToLocalStorage();
    },
    id() {
      this.saveToLocalStorage();
    },
    client() {
      this.saveToLocalStorage();
    },
    date() {
      this.saveToLocalStorage();
    },
    time() {
      this.saveToLocalStorage();
    },
    doctor() {
      this.saveToLocalStorage();
    }
  },

  mounted() {
    if (!localStorage.getItem("editedItem")) {
      let initialItem = this.defaultItem;
      localStorage.setItem("editedItem", JSON.stringify(initialItem));
    }
    this.initialize();
    this.updateStorage(true);
  },

  methods: {
    saveToLocalStorage() {
      let editedItem = this.editedItem;
      localStorage.setItem("editedItem", JSON.stringify(editedItem));
      this.updateStorage(false);
    },
    updateStorage(showDialog) {
      let editedItem = JSON.parse(localStorage.getItem("editedItem"));
      this.editedItem = editedItem;
      if (
        showDialog &&
        (editedItem.reason.length > 0 ||
          editedItem.client ||
          editedItem.date ||
          editedItem.time ||
          editedItem.doctor)
      ) {
        this.dialog = true;
      }
    },
    itemClient(item) {
      return item?.client?.split("-")[1] || "";
    },
    getItemToDelete() {
      if (this.itemToDelete?.client?.includes("-")) {
        return this.itemToDelete?.client?.split("-")[1] + "'s";
      }
      return this.itemToDelete.client + "'s";
    },

    async initialize() {
      this.appointments = [
        {
          id: 1,
          client: "Samuel Adeyanju",
          date: "2021-01-28",
          time: "12:30pm",
          doctor: "Dr. Nomso",
          reason: ["Consultation"]
        },
        {
          id: 2,
          client: "Samuel Adeyanju",
          date: "2021-01-28",
          time: "12:30pm",
          doctor: "Dr. Nomso",
          reason: ["Consultation"]
        },
        {
          id: 3,
          client: "Samuel Adeyanju",
          date: "2021-01-28",
          time: "12:30pm",
          doctor: "Dr. Nomso",
          reason: ["Consultation"]
        },
        {
          id: 4,
          client: "Samuel Adeyanju",
          date: "2021-01-28",
          time: "12:30pm",
          doctor: "Dr. Nomso",
          reason: ["Consultation"]
        },
        {
          id: 5,
          client: "Samuel Adeyanju",
          date: "2021-01-28",
          time: "12:30pm",
          doctor: "Dr. Nomso",
          reason: ["Consultation"]
        },
        {
          id: 6,
          client: "Samuel Adeyanju",
          date: "2021-01-28",
          time: "12:30pm",
          doctor: "Dr. Nomso",
          reason: ["Consultation"]
        },
        {
          id: 7,
          client: "Samuel Adeyanju",
          date: "2021-01-28",
          time: "12:30pm",
          doctor: "Dr. Nomso",
          reason: ["Consultation"]
        },
        {
          id: 8,
          client: "Samuel Adeyanju",
          date: "2021-01-28",
          time: "12:30pm",
          doctor: "Dr. Nomso",
          reason: ["Consultation"]
        },
        {
          id: 9,
          client: "Samuel Adeyanju",
          date: "2021-01-28",
          time: "12:30pm",
          doctor: "Dr. Nomso",
          reason: ["Consultation"]
        },
        {
          id: 10,
          client: "Samuel Adeyanju",
          date: "2021-01-28",
          time: "12:30pm",
          doctor: "Dr. Nomso",
          reason: ["Consultation"]
        },
        {
          id: 11,
          client: "Samuel Adeyanju",
          date: "2021-01-28",
          time: "12:30pm",
          doctor: "Dr. Nomso",
          reason: ["Consultation"]
        },
        {
          id: 12,
          client: "Samuel Adeyanju",
          date: "2021-01-28",
          time: "12:30pm",
          doctor: "Dr. Nomso",
          reason: ["Consultation"]
        }
      ];
    },

    editItem(item) {
      this.editedIndex = this.appointments.indexOf(item);
      this.editedItem = item;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.appointments.indexOf(item);
      this.itemToDelete = item;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.appointments.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = this.defaultItem;
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = this.defaultItem;
        this.editedIndex = -1;
      });
    },

    save() {
      let editedItem = this.editedItem;
      if (this.editedIndex > -1) {
        Object.assign(this.appointments[this.editedIndex], editedItem);
      } else {
        this.appointments.unshift(editedItem);
      }
      this.close();
    }
  }
};
</script>

<style></style>
