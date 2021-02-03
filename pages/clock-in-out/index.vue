<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="mr-5 subheading">Clock In/Out</span>
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
          :fullscreen="$vuetify.breakpoint.smAndDown"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              outlined
              class="text-capitalize"
              v-bind="attrs"
              v-on="on"
              ><v-icon :left="$vuetify.breakpoint.smAndDown ? false : true" small>mdi-plus</v-icon> <span :hidden="$vuetify.breakpoint.smAndDown">New Appointment</span> </v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
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
                        v-model="editedItem.time"
                        full-width
                        @click:minute="$refs.timeMenu.save(editedItem.time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      label="Patient Name"
                      v-model="editedItem.client"
                      prepend-icon="mdi-account"
                      hint="enter the patient full name"
                    ></v-text-field>
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
                        ' Surgery',
                      ]"
                      v-model="editedItem.reason"
                      prepend-icon="mdi-details"
                      label="Appointment Reason"
                      multiple
                    ></v-autocomplete>
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
        <v-btn  color="primary" outlined class="text-capitalize"
          ><v-icon :left="$vuetify.breakpoint.smAndDown ? false : true" small
            >mdi-plus</v-icon
          >
          <span :hidden="$vuetify.breakpoint.smAndDown">Clock In</span>
        </v-btn>
        <v-btn color="primary" outlined class="text-capitalize ml-3"
          ><v-icon :left="$vuetify.breakpoint.smAndDown ? false : true" small
            >mdi-minus</v-icon
          >
          <span :hidden="$vuetify.breakpoint.smAndDown">Clock Out</span>
        </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="clockInOut" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
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
        },
        {
          text: "Time Out",
          value: "timeOut",
        },
        {
          text: "Actions",
          value: "actions",
          align: "end",
          sortable: false,
        },
      ],
      clockInOut: [
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
      ],
    };
  },

  methods: {},
};
</script>

<style>
</style>