<template>
  <div>
    <v-card width="100%" class="rounded mt-1">
      <v-card-title>
        <!-- <span class="mr-5 subheading primary--text">Appointments</span> -->

        <!-- Begin Search Box -->

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search Jobs"
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
          max-width="1000"
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
              <span :hidden="$vuetify.breakpoint.smAndDown">New Job</span>
            </v-btn>
          </template>
          <v-card :class="$vuetify.breakpoint.width >= 600 ? 'rounded' : ''">
            <v-card-title>
              <span class="headline primary--text">{{ formTitle }}</span>
              <v-spacer></v-spacer>
              <span><v-icon @click="dialog = false">mdi-close</v-icon></span>
            </v-card-title>
            <v-card-text>
              <v-container fluid>
                <v-form v-model="valid" ref="jobForm">
                  <v-card-subtitle class="mt-5">Job Details</v-card-subtitle>
                  <v-row class="mt-5">
                    <v-col cols="6" sm="6" md="3">
                      <v-menu
                        ref="menu2"
                        v-model="menu2"
                        :nudge-right="40"
                        :close-on-content-click="true"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="dateInFormatted"
                            label="Date"
                            hint="MM/DD/YYYY"
                            persistent-hint
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            @blur="
                              editedItem.dateIn = parseDate(dateInFormatted)
                            "
                            v-on="on"
                            required
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.dateIn"
                          no-title
                          @input="menu1 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="6" sm="6" md="3">
                      <v-menu
                        ref="menu3"
                        v-model="menu3"
                        :nudge-right="40"
                        :close-on-content-click="true"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="dateOutFormatted"
                            label="Date"
                            hint="MM/DD/YYYY"
                            persistent-hint
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            @blur="
                              editedItem.dateOut = parseDate(dateOutFormatted)
                            "
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.dateOut"
                          no-title
                          @input="menu1 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-autocomplete
                        :items="clients"
                        v-model="editedItem.client"
                        prepend-icon="mdi-account"
                        label="Patient"
                        return-object
                        item-text="name"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        :rules="rules"
                        prepend-icon="mdi-doctor"
                        v-model="editedItem.doctor"
                        label="Seen By"
                        hide-details="auto"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        :rules="rules"
                        v-model="editedItem.optician"
                        prepend-icon="mdi-details"
                        label="Optician"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-card-subtitle class="mt-5"
                    >Prescription Details</v-card-subtitle
                  >
                  <v-row class="mt-5">
                    <v-col cols="6" sm="6" md="4">
                      <v-text-field
                        :rules="rules"
                        v-model="editedItem.prescription.re"
                        prepend-icon="mdi-eye"
                        label="Right Eye"
                        v-mask="'X#.##/X#.##x###'"
                        hint="+2.50/-0.25x020"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="4">
                      <v-text-field
                        :rules="rules"
                        v-model="editedItem.prescription.le"
                        prepend-icon="mdi-eye"
                        label="Left Eye"
                        v-mask="'X#.##/X#.##x###'"
                        hint="+2.50/-0.25x100"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="4">
                      <v-text-field
                        :rules="rules"
                        v-model="editedItem.prescription.add"
                        prepend-icon="mdi-plus"
                        label="Add"
                        v-mask="'X#.##'"
                        hint="+2.50"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-card-subtitle class="mt-5">Bill Details</v-card-subtitle>
                  <v-row class="my-5">
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        :rules="rules"
                        v-model="editedItem.frame"
                        prepend-icon="mdi-glasses"
                        label="Frame"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        :rules="rules"
                        v-model="editedItem.lens"
                        prepend-icon="mdi-magnify"
                        label="Lens Type"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="4">
                      <v-text-field
                        :rules="rules"
                        v-model="editedItem.total"
                        prepend-icon="mdi-bank"
                        label="Total"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="4">
                      <v-text-field
                        :rules="rules"
                        v-model="editedItem.deposit"
                        prepend-icon="mdi-cash"
                        label="Deposit"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="4">
                      <v-text-field
                        :rules="rules"
                        v-model="editedItem.balance"
                        prepend-icon="mdi-note"
                        label="Balance"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="clear()">
                Clear
              </v-btn>
              <v-btn
                :loading="loading"
                elevation="2"
                color="blue darken-1"
                :disabled="!valid"
                text
                @click="save()"
              >
                Save
              </v-btn>
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
              {{ itemToDelete }}
              Job?</v-card-title
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
        <JobPreview :dialog="dialogViewJob" :job="jobToView" />
      </v-card-title>

      <!-- Begin Data Table -->

      <v-data-table
        style="overflow: auto"
        :loading="loading"
        :headers="headers"
        :items="jobs"
        :search="search"
        sort-by="date"
        :sort-desc="true"
        :items-per-page="8"
        :footer-props="{
          'items-per-page-options': [8, 10, 15, 20, -1]
        }"
      >
        <template v-slot:[`item.client`]="{ item }">
          <span v-if="item.client.name.includes('-')">{{
            itemClient(item)
          }}</span>
          <span v-else>{{ item.client.name }}</span>
        </template>
        <template v-slot:[`item.prescription`]="{ item }">
          <v-chip class="caption" x-small v-if="item.prescription.re"
            ><span>RE: {{ item.prescription.re }}</span></v-chip
          >
          <v-chip class="caption" x-small v-if="item.prescription.le"
            ><span>LE: {{ item.prescription.le }}</span></v-chip
          >
          <v-chip class="caption" x-small v-if="item.prescription.add"
            ><span>ADD: {{ item.prescription.add }}</span></v-chip
          >
        </template>
        <template v-slot:[`item.dateIn`]="{ item }">
          {{ formatDate(item.dateIn) }}
        </template>
        <template v-slot:[`item.dateOut`]="{ item }">
          {{ formatDate(item.dateOut) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-menu transition="slide-y-transition" bottom close-on-content-click>
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                small
                :color="getStatusColor(item.status)"
                v-bind="attrs"
                v-on="on"
              >
                <v-avatar left>
                  <v-icon small>mdi-checkbox-marked-circle</v-icon> </v-avatar
                ><span>{{
                  defaultStatuses.filter(m => m.value === item.status)[0].title
                }}</span>
              </v-chip>
            </template>
            <v-list dense>
              <v-list-item v-for="(status, i) in defaultStatuses" :key="i" link>
                <v-list-item-title @click="changeStatus(item, status.value)">{{
                  status.title
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            color="accent"
            small
            text
            class="rounded text-capitalize body-2 mr-2"
            @click="view(item)"
            >View</v-btn
          >
          <v-icon
            v-show="true"
            color="primary"
            small
            class="mr-2"
            @click="editItem(item)"
          >
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
import JobPreview from "../../components/JobPreview.vue";
export default {
  name: "Jobs",
  components: {
    JobPreview
    // ValidationProvider,
    // ValidationObserver
  },
  data: vm => {
    return {
      valid: false,
      loading: false,
      rules: [
        value => !!value || "Required.",
        value => (value && value.length >= 3) || "Min 3 characters"
      ],
      defaultStatuses: [
        { title: "Open", value: "open" },
        { title: "In-Progess", value: "in-progress" },
        { title: "Delayed", value: "delayed" },
        { title: "Completed", value: "completed" }
      ],
      search: "",
      menu2: false,
      menu3: false,
      dialog: false,
      dialogViewJob: false,
      jobToView: {},
      dialogDelete: false,
      headers: [
        {
          text: "Patient Name",
          value: "client"
        },
        {
          text: "Date In",
          value: "dateIn"
        },
        {
          text: "Date Out",
          value: "dateOut"
        },
        {
          text: "Prescription",
          value: "prescription"
        },
        {
          text: "Status",
          value: "status"
        },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          sortable: false,
          width: "15%"
        }
      ],
      jobs: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        client: {
          name: "",
          id: ""
        },
        dateIn: new Date().toISOString().substr(0, 10),
        dateOut: new Date().toISOString().substr(0, 10),
        prescription: {
          re: "",
          le: "",
          add: ""
        },
        status: "open",
        frame: "",
        lens: "",
        total: "",
        deposit: "",
        balance: "",
        optician: "",
        doctor: ""
      },
      dateInFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      dateOutFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      defaultItem: {
        id: 0,
        client: {
          name: "",
          id: ""
        },
        dateIn: new Date().toISOString().substr(0, 10),
        dateOut: new Date().toISOString().substr(0, 10),
        prescription: {
          re: "",
          le: "",
          add: ""
        },
        status: "open",
        frame: "",
        lens: "",
        total: "",
        deposit: "",
        balance: "",
        optician: "",
        doctor: ""
      },
      itemToDelete: {},
      clientLoading: false
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Job" : "Edit Job";
    },
    clients() {
      let clients = this.$store.state.clients
        .filter(item => item.Name)
        .map(m => {
          if (!m.Code) return { name: m.Name, id: m.id };
          return { name: `${m.Code} - ${m.Name}`, id: m.id };
        });
      return clients;
    },
    re() {
      return this.editedItem.prescription.re;
    },
    le() {
      return this.editedItem.prescription.le;
    },
    add() {
      return this.editedItem.prescription.add;
    },
    dateIn() {
      return this.editedItem.dateIn;
    },
    dateOut() {
      return this.editedItem.dateOut;
    },
    doctor() {
      return this.editedItem.doctor;
    },
    total() {
      return this.editedItem.total;
    },
    frame() {
      return this.editedItem.frame;
    },
    lens() {
      return this.editedItem.lens;
    },
    status() {
      return this.editedItem.status;
    },
    deposit() {
      return this.editedItem.deposit;
    },
    balance() {
      return this.editedItem.balance;
    },
    optician() {
      return this.editedItem.optician;
    },
    clientId() {
      return this.editedItem.client?.id;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    re() {
      this.saveToLocalStorage();
    },
    le() {
      this.saveToLocalStorage();
    },
    add() {
      this.saveToLocalStorage();
    },
    dateIn() {
      console.log(this.$refs.jobForm);
      this.dateInFormatted = this.formatDate(this.editedItem.dateIn);
      this.saveToLocalStorage();
    },
    dateOut() {
      this.dateOutFormatted = this.formatDate(this.editedItem.dateOut);
      this.saveToLocalStorage();
    },
    doctor() {
      this.saveToLocalStorage();
    },
    total() {
      this.saveToLocalStorage();
    },
    frame() {
      this.saveToLocalStorage();
    },
    lens() {
      this.saveToLocalStorage();
    },
    status() {
      this.saveToLocalStorage();
    },
    deposit() {
      this.saveToLocalStorage();
    },
    balance() {
      this.saveToLocalStorage();
    },
    optician() {
      this.saveToLocalStorage();
    },
    clientId() {
      this.saveToLocalStorage();
    }
  },

  async mounted() {
    this.loading = true;
    await this.initialize();
    this.loading = false;
    if (!localStorage.getItem("editedJob")) {
      localStorage.setItem("editedJob", JSON.stringify(this.defaultItem));
    }
    await this.updateStorage(true);
  },

  methods: {
    view(job) {
      this.jobToView = job;
      this.dialogViewJob = true;
    },
    parseDate(date) {
      if (!date) return null;

      if (date.length < 10) return null;

      const [day, month, year] = date.split("/");

      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },

    formatDate(date) {
      if (!date) return null;

      if (date.length < 10) return null;

      const [year, month, day] = date.split("-");

      return `${day}/${month}/${year}`;
    },

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

    changeStatus(item, newValue) {
      if (item.status === newValue) return;
      let index = this.jobs.indexOf(item);
      item.status = newValue;
      Object.assign(this.jobs[index], item);
      localStorage.removeItem("editedJob");
    },

    saveToLocalStorage() {
      let editedItem = this.editedItem;
      localStorage.setItem("editedJob", JSON.stringify(editedItem));
      this.updateStorage(false);
    },
    updateStorage(showDialog) {
      let editedItem = JSON.parse(localStorage.getItem("editedJob"));
      this.editedItem = editedItem;
      if (
        showDialog &&
        (editedItem.id ||
          editedItem.client?.name ||
          editedItem.client?.id ||
          editedItem.prescription.re ||
          editedItem.prescription.le ||
          editedItem.prescription.add ||
          editedItem.dateIn !== new Date().toISOString().substr(0, 10) ||
          editedItem.dateOut !== new Date().toISOString().substr(0, 10) ||
          editedItem.total ||
          editedItem.deposit ||
          editedItem.balance ||
          editedItem.optician ||
          editedItem.doctor)
      ) {
        this.dialog = true;
      }
    },
    itemClient(item) {
      return item?.client?.name?.split("-")[1] || "";
    },
    getItemToDelete(item) {
      if (item.client?.name.includes("-")) {
        return item.client?.name.split("-")[1] + "'s";
      }
      return item.client.name + "'s";
    },

    async initialize() {
      this.jobs = [
        {
          id: 1,
          client: { name: "Olorunsiwa Ojo", id: "12234334" },
          dateIn: "2021-01-28",
          dateOut: "2021-01-30",
          prescription: {
            re: "+2.50/-0.50",
            le: "+2.00/-0.25",
            add: "+2.50"
          },
          status: "open",
          frame: "",
          lens: "",
          total: "",
          deposit: "",
          balance: "",
          optician: "",
          doctor: ""
        },
        {
          id: 2,
          client: { name: "Adeyanju Ojo", id: "122324334" },
          dateIn: "2021-01-25",
          dateOut: "2021-01-29",
          prescription: {
            re: "+2.50",
            le: "+2.00",
            add: ""
          },
          status: "in-progress",
          frame: "",
          lens: "",
          total: "",
          deposit: "",
          balance: "",
          optician: "",
          doctor: ""
        },
        {
          id: 3,
          client: { name: "Princess Paulinus", id: "176623837" },
          dateIn: "2021-01-01",
          dateOut: "2021-01-05",
          prescription: {
            re: "-0.50",
            le: "-0.25",
            add: "+1.00"
          },
          status: "completed",
          frame: "",
          lens: "",
          total: "",
          deposit: "",
          balance: "",
          optician: "",
          doctor: ""
        },
        {
          id: 4,
          client: { name: "Kingsley Paulinus", id: "178781872" },
          dateIn: "2021-01-01",
          dateOut: "2021-01-05",
          prescription: {
            re: "-1.50",
            le: "-1.25",
            add: "+1.00"
          },
          status: "delayed",
          frame: "",
          lens: "",
          total: "",
          deposit: "",
          balance: "",
          optician: "",
          doctor: ""
        },
        {
          id: 5,
          client: { name: "Olorunsiwa Ojo", id: "102089323" },
          dateIn: "2021-01-28",
          dateOut: "2021-01-30",
          prescription: {
            re: "+2.50/-0.50",
            le: "+2.00/-0.25",
            add: "+2.50"
          },
          status: "open",
          frame: "",
          lens: "",
          total: "",
          deposit: "",
          balance: "",
          optician: "",
          doctor: ""
        },
        {
          id: 6,
          client: { name: "Adeyanju Ojo", id: "17812872" },
          dateIn: "2021-01-25",
          dateOut: "2021-01-29",
          prescription: {
            re: "+2.50",
            le: "+2.00",
            add: ""
          },
          status: "in-progress",
          frame: "",
          lens: "",
          total: "",
          deposit: "",
          balance: "",
          optician: "",
          doctor: ""
        },
        {
          id: 7,
          client: { name: "Princess Paulinus", id: "187291323" },
          dateIn: "2021-01-01",
          dateOut: "2021-01-05",
          prescription: {
            re: "-0.50",
            le: "-0.25",
            add: "+1.00"
          },
          status: "completed",
          frame: "",
          lens: "",
          total: "",
          deposit: "",
          balance: "",
          optician: "",
          doctor: ""
        },
        {
          id: 8,
          client: { name: "Kingsley Paulinus", id: "78781892112" },
          dateIn: "2021-01-01",
          dateOut: "2021-01-05",
          prescription: {
            re: "-1.50",
            le: "-1.25",
            add: "+1.00"
          },
          status: "delayed",
          frame: "",
          lens: "",
          total: "",
          deposit: "",
          balance: "",
          optician: "",
          doctor: ""
        }
      ];
    },

    editItem(item) {
      this.editedIndex = this.jobs.indexOf(item);
      this.editedItem = item;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.jobs.indexOf(item);
      this.itemToDelete = this.getItemToDelete(item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.jobs.splice(this.editedIndex, 1);
      this.$store.dispatch("toast/snackbar", {
        type: "success",
        message: `${this.itemToDelete}'s job was deleted successfully`,
        timeout: 2000
      });
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

    async save() {
      this.loading = true;
      let editedItem = this.editedItem;
      if (this.editedIndex > -1) {
        await Object.assign(this.jobs[this.editedIndex], editedItem);
        this.loading = false;
        this.$store.dispatch("toast/snackbar", {
          type: "success",
          message: `${editedItem.client.name}'s job was updated successfully`,
          timeout: 2000
        });
      } else {
        await this.jobs.unshift(editedItem);
        this.loading = false;
        this.$store.dispatch("toast/snackbar", {
          type: "success",
          message: `${editedItem.client.name}'s job was saved successfully`,
          timeout: 2000
        });
      }
      this.close();
    },

    clear() {
      this.$refs.jobForm.reset();
      localStorage.setItem("editedJob", JSON.stringify(this.defaultItem));
    }
  }
};
</script>

<style></style>
