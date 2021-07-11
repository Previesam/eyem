<template>
  <div>
    <v-card
      :min-height="$vuetify.breakpoint.mobile ? '86vh' : '84.6vh'"
      width="100%"
      class="rounded mt-1"
    >
      <v-card-title>
        <!-- <span class="mr-5 subheading primary--text">Appointments</span> -->

        <v-btn icon @click="showSelect()" class="mr-3"
          ><v-icon>mdi-checkbox-marked-circle-outline</v-icon></v-btn
        >

        <v-spacer v-show="!userPermissions[$route.path].create"></v-spacer>

        <!-- Begin Search Box -->

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search Jobs"
          outlined
          color="primary"
          hide-details
          dense
          class="search-box"
        ></v-text-field>

        <!-- End Search Box -->

        <v-spacer v-show="userPermissions[$route.path].create"></v-spacer>

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
              v-show="userPermissions[$route.path].create"
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
              <span><v-icon @click="close()">mdi-close</v-icon></span>
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
                            label="Date In"
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
                            label="Date Out"
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
                      <v-combobox
                        :items="clients"
                        v-model="editedItem.client"
                        prepend-icon="mdi-account"
                        label="Patient"
                        no-filter
                        :loading="clientIsLoading"
                        :item-text="selectItem"
                        :search-input.sync="clientSearch"
                      ></v-combobox>
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
              <v-btn color="red darken-1" text @click="clear()"> Clear </v-btn>
              <v-btn
                :loading="loading"
                elevation="2"
                color="blue darken-1"
                :disabled="!valid || !userPermissions[$route.path].create"
                text
                @click.stop="save()"
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
              {{ `${deleteItemClientName}'s` }}
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
                :disabled="!userPermissions[$route.path].delete"
                >Yes</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- End Delete Dialog -->

        <!-- Begin preview dialog -->

        <v-dialog
          v-model="dialogViewJob"
          persistent
          scrollable
          :fullscreen="$vuetify.breakpoint.width <= 600 ? true : false"
          overlay-color="blue"
          width="500px"
        >
          <v-card :loading="loading">
            <v-divider></v-divider>
            <v-card-text class="pa-2">
              <div class="mb-2 subtitle-1 d-flex">
                <div>
                  <div class="caption">{{ formatDate(jobToView.dateIn) }}</div>
                  <div class="subtitle-2 font-weight-bold">
                    Job # {{ jobToView.id }}
                  </div>
                </div>
                <div class="ml-auto my-auto">
                  <v-icon @click.stop="dialogViewJob = !dialogViewJob"
                    >mdi-close</v-icon
                  >
                </div>
              </div>
              <v-divider></v-divider>
              <div class="my-4 d-flex">
                <div>
                  <v-icon left>mdi-account</v-icon
                  ><span class="subtitle-2 font-weight-bold">{{
                    jobToView.client.Name
                  }}</span>
                </div>
                <div class="ml-auto">
                  <v-menu
                    transition="slide-y-transition"
                    bottom
                    close-on-content-click
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip
                        small
                        :color="getStatusColor(jobToView.status)"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-avatar left>
                          <v-icon small
                            >mdi-checkbox-marked-circle</v-icon
                          > </v-avatar
                        ><span>{{
                          defaultStatuses.filter(
                            (m) => m.value === jobToView.status
                          )[0].title
                        }}</span>
                      </v-chip>
                    </template>
                    <v-list dense>
                      <v-list-item
                        v-for="(status, i) in defaultStatuses"
                        :key="i"
                        link
                        @click="changeStatus(jobToView, status.value)"
                      >
                        <v-list-item-title>{{
                          status.title
                        }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
              <div class="my-2 d-flex">
                <div>Date In:</div>
                <div class="ml-auto">{{ formatDate(jobToView.dateIn) }}</div>
              </div>
              <div class="my-2 d-flex">
                <div>Date Out:</div>
                <div class="ml-auto">{{ formatDate(jobToView.dateOut) }}</div>
              </div>
              <div class="my-2 d-flex">
                <div>Right Eye:</div>
                <div class="ml-auto">
                  <v-chip small>{{ jobToView.prescription.re }}</v-chip>
                </div>
              </div>
              <div class="my-2 d-flex">
                <div>Left Eye:</div>
                <div class="ml-auto">
                  <v-chip small>{{ jobToView.prescription.le }}</v-chip>
                </div>
              </div>
              <div class="my-2 d-flex">
                <div>Add:</div>
                <div class="ml-auto">
                  <v-chip small>{{ jobToView.prescription.add }}</v-chip>
                </div>
              </div>
              <div class="my-2 d-flex">
                <div>Frame:</div>
                <div class="ml-auto">{{ jobToView.frame }}</div>
              </div>
              <div class="my-2 d-flex">
                <div>Lens:</div>
                <div class="ml-auto">{{ jobToView.lens }}</div>
              </div>
              <div class="my-2 d-flex">
                <div>Doctor:</div>
                <div class="ml-auto">{{ jobToView.doctor }}</div>
              </div>
              <div class="my-2 d-flex">
                <div>Optician:</div>
                <div class="ml-auto">{{ jobToView.optician }}</div>
              </div>
              <div class="my-4 d-flex">
                <v-btn
                  color="accent"
                  small
                  outlined
                  rounded
                  class="text-capitalize mx-auto"
                  >Pay Balance</v-btn
                >
              </div>
              <v-divider></v-divider>
              <div class="my-2 d-flex flex-wrap">
                <div class="d-flex my-2 mx-auto">
                  <div>Total:</div>
                  <div class="mx-2">
                    <v-chip small>{{ jobToView.total }}</v-chip>
                  </div>
                </div>
                <div class="d-flex my-2 mx-auto">
                  <div>Deposit:</div>
                  <div class="mx-2">
                    <v-chip small>{{ jobToView.deposit }}</v-chip>
                  </div>
                </div>
                <div class="d-flex my-2 mx-auto">
                  <div>Balance:</div>
                  <div class="mx-2">
                    <v-chip small>{{ jobToView.balance }}</v-chip>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- End Preview Dialog -->
      </v-card-title>

      <!-- Begin Data Table -->

      <v-data-table
        style="overflow: auto"
        :loading="loading"
        loading-text="Loading"
        :headers="headers"
        :items="jobs"
        :search="search"
        sort-by="date"
        :sort-desc="true"
        :items-per-page="8"
        :show-select="allowSelect"
        :footer-props="{
          'items-per-page-options': [8, 10, 15, 20, -1],
        }"
      >
        <template v-slot:[`item.client`]="{ item }">
          <span>{{ item.client.Name }}</span>
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
                  defaultStatuses.filter((m) => m.value === item.status)[0]
                    .title
                }}</span>
              </v-chip>
            </template>
            <v-list dense>
              <v-list-item
                @click="changeStatus(item, status.value)"
                v-for="(status, i) in defaultStatuses"
                :key="i"
                link
              >
                <v-list-item-title>{{ status.title }}</v-list-item-title>
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
            v-show="userPermissions[$route.path].view"
            >View</v-btn
          >
          <v-icon
            color="primary"
            small
            class="mr-2"
            @click="editItem(item)"
            v-show="userPermissions[$route.path].edit"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-show="userPermissions[$route.path].delete"
            color="red"
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn
            outlined
            text
            color="primary"
            class="text-capitalize"
            @click="initialize"
          >
            Refresh
          </v-btn>
        </template>
      </v-data-table>

      <!-- End Data Table -->
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Jobs",
  components: {
    // JobPreview
  },
  data: (vm) => {
    return {
      valid: false,
      allowSelect: false,
      loading: false,
      rules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 3) || "Min 3 characters",
      ],
      defaultStatuses: [
        { title: "Open", value: "open" },
        { title: "In-Progess", value: "in-progress" },
        { title: "Delayed", value: "delayed" },
        { title: "Quality Check", value: "quality-check" },
        { title: "Completed", value: "completed" },
      ],
      search: "",
      menu2: false,
      menu3: false,
      dialog: false,
      dialogViewJob: false,
      jobToView: {
        id: "",
        client: {
          id: "",
          Code: "",
          Name: "",
        },
        dateIn: new Date().toISOString().substr(0, 10),
        dateOut: new Date().toISOString().substr(0, 10),
        prescription: {
          re: "",
          le: "",
          add: "",
        },
        status: "open",
        frame: "",
        lens: "",
        total: "",
        deposit: "",
        balance: "",
        optician: "",
        doctor: "",
        branch: "",
        history: [],
      },
      dialogDelete: false,
      headers: [
        {
          text: "Patient Name",
          value: "client",
        },
        {
          text: "Date In",
          value: "dateIn",
        },
        {
          text: "Date Out",
          value: "dateOut",
        },
        {
          text: "Prescription",
          value: "prescription",
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
          width: "15%",
        },
      ],
      jobs: [],
      editedIndex: -1,
      editedItem: {
        client: {
          id: "",
          Code: "",
          Name: "",
        },
        dateIn: new Date().toISOString().substr(0, 10),
        dateOut: new Date().toISOString().substr(0, 10),
        prescription: {
          re: "",
          le: "",
          add: "",
        },
        status: "open",
        frame: "",
        lens: "",
        total: "",
        deposit: "",
        balance: "",
        optician: "",
        doctor: "",
        branch: "",
        history: [],
      },
      dateInFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      dateOutFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      defaultItem: {
        client: {
          id: "",
          Code: "",
          Name: "",
        },
        dateIn: new Date().toISOString().substr(0, 10),
        dateOut: new Date().toISOString().substr(0, 10),
        prescription: {
          re: "",
          le: "",
          add: "",
        },
        status: "open",
        frame: "",
        lens: "",
        total: "",
        deposit: "",
        balance: "",
        optician: "",
        doctor: "",
        branch: "",
        history: [],
      },
      itemToDelete: {},
      clientIsLoading: false,
      clientSearch: "",
      clients: [],
    };
  },

  computed: {
    deleteItemClientName() {
      return this.itemToDelete?.client?.Name;
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Job" : "Edit Job";
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
    client() {
      return this.editedItem.client?.id;
    },
    userPermissions() {
      return this.$auth.user.role.permissions;
    },
  },

  watch: {
    clientSearch(val) {
      if (!val) {
        return;
      }
      this.filterClients(val);
    },
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
    client() {
      this.saveToLocalStorage();
    },
  },

  async mounted() {
    this.loading = true;
    await this.initialize();
    if (this.$route.query.id) {
      let job = this.jobs.filter((item) => item.id === this.$route.query.id);
      if (job.length > 0) {
        this.view(job[0]);
      } else {
        this.$router.push("jobs");
        this.$store.dispatch("toast/snackbar", {
          type: "error",
          message: `Invalid URL parameter`,
          timeout: 3000,
        });
      }
    }
    this.clients = this.$store.state.clients
      .filter((item) => item.Name)
      .map((m) => m);
    this.loading = false;
    if (!localStorage.getItem("editedJob")) {
      localStorage.setItem("editedJob", JSON.stringify(this.defaultItem));
    }
    this.updateStorage(true);
  },

  methods: {
    convertItem(item) {
      return { Name: item.Name, id: item.id, Code: item.Code };
    },
    selectItem(item) {
      var text = item.Code && item.Name ? `${item.Code} - ${item.Name}` : "";
      return text;
    },

    filterClients(query) {
      // cancel pending call
      clearTimeout(this._timerId);

      this.clients = [];

      this.clientIsLoading = true;

      let fmtQuery = encodeURIComponent(query);

      this._timerId = setTimeout(() => {
        let clients = this.$store.state.clients
          .filter((item) => item.Name)
          .map((m) => m);

        this.clients = clients.filter((c) => {
          let objString = `${c.Code} - ${c.Name}`;
          return encodeURIComponent(objString.toLowerCase()).includes(
            encodeURIComponent(query.toLowerCase())
          );
        });
        this.clientIsLoading = false;
      }, 500);
    },
    showSelect() {
      this.allowSelect = !this.allowSelect;
    },
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

      return `${day[0] + day[1]}/${month}/${year}`;
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

    async changeStatus(item, newValue) {
      this.loading = true;
      if (item.status === newValue) return (this.loading = false);
      let index = this.jobs.indexOf(item);
      item.status = newValue;
      item.history.push({
        status: newValue,
        name: this.$auth.user.fullname,
        date: new Date().toISOString().substr(0, 10),
      });
      try {
        let { id, ...rest } = item;
        rest.lastModifiedBy = this.$auth.user._id;
        await this.$axios(`/job/update/${item.id}`, {
          method: "PUT",
          data: rest,
        }).then(async (res) => {
          await Object.assign(this.jobs[index], res.data);
          this.loading = false;
          this.$store.dispatch("toast/callAddSnackbar", {
            color: "success",
            message: `${res.data.client.Name}'s job was updated successfully`,
            timeout: 3000,
          });
          localStorage.removeItem("editedJob");
        });
      } catch (err) {
        console.log(err.response);
        this.loading = false;
        this.$store.dispatch("toast/callAddSnackbar", {
          color: "error",
          message: err.response.data.message,
          timeout: 3000,
        });
      }
    },

    saveToLocalStorage() {
      let editedItem = this.editedItem;
      localStorage.setItem("editedJob", JSON.stringify(editedItem));
      this.updateStorage(false);
    },
    updateStorage(showDialog) {
      let editedItem = JSON.parse(localStorage.getItem("editedJob"));
      this.editedItem = editedItem;
      this.editedIndex = parseInt(localStorage.getItem("editedIndex")) || -1;
      if (
        showDialog &&
        (editedItem?.id ||
          editedItem?.client?.id ||
          editedItem.client.Name ||
          editedItem.client.Code ||
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

    async initialize() {
      try {
        let response = await this.$axios("/jobs", {
          method: "GET",
        });
        if (response) {
          this.jobs = response.data;
        }
      } catch (err) {
        console.log(err.response);
      }
    },

    editItem(item) {
      this.editedIndex = this.jobs.indexOf(item);
      localStorage.setItem("editedIndex", this.editedIndex);
      this.editedItem = item;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.jobs.indexOf(item);
      this.itemToDelete = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await this.$axios(`/job/delete/${this.itemToDelete.id}`, {
        method: "DELETE",
      })
        .then((res) => {
          this.jobs.splice(this.editedIndex, 1);
          this.$store.dispatch("toast/callAddSnackbar", {
            color: "success",
            message: `${this.itemToDelete.client.Name}'s job was deleted successfully`,
            timeout: 2000,
          });
          this.closeDelete();
        })
        .catch((err) => {
          console.log(err.response);
        });
    },

    close() {
      this.dialog = false;
      this.$refs.jobForm.reset();
      localStorage.removeItem("editedJob");
      localStorage.removeItem("editedIndex");
      this.clientSearch = null;
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
      if (editedItem.client.Name) {
        editedItem.client = editedItem.client.id;
      }
      editedItem.history.push({
        status: editedItem.status,
        name: this.$auth.user.fullname,
        date: new Date().toISOString().substr(0, 10),
      });
      if (this.editedIndex > -1) {
        try {
          let { id, ...rest } = editedItem;
          rest.lastModifiedBy = this.$auth.user._id;
          await this.$axios(`/job/update/${editedItem.id}`, {
            method: "PUT",
            data: rest,
          }).then(async (res) => {
            await Object.assign(this.jobs[this.editedIndex], res.data);
            this.loading = false;
            this.close();
            this.$store.dispatch("toast/callAddSnackbar", {
              color: "success",
              message: `${res.data.client.Name}'s job was updated successfully`,
              timeout: 3000,
            });
          });
        } catch (err) {
          console.log(err.response);
          this.loading = false;
          this.$store.dispatch("toast/callAddSnackbar", {
            color: "error",
            message: err.response.data.message,
            timeout: 3000,
          });
        }
      } else {
        editedItem.branch = this.$store.state.branch.id;
        editedItem.createdBy = this.$auth.user._id;
        editedItem.lastModifiedBy = editedItem.createdBy;
        console.log(editedItem);
        try {
          await this.$axios("/job/create", {
            method: "POST",
            data: editedItem,
          }).then((res) => {
            this.jobs.push(res.data);
            this.loading = false;
            this.close();
            this.$store.dispatch("toast/callAddSnackbar", {
              color: "success",
              message: `${res.data.client.Name}'s job was saved successfully`,
              timeout: 3000,
            });
          });
        } catch (err) {
          this.loading = false;
          console.log(err.response);
          this.$store.dispatch("toast/callAddSnackbar", {
            color: "error",
            message: err.response.data.message,
            timeout: 3000,
          });
        }
      }
    },

    clear() {
      this.$refs.jobForm.reset();
      localStorage.setItem("editedJob", JSON.stringify(this.defaultItem));
    },
  },
};
</script>

<style scoped>
.v-input__control {
  min-height: 20px !important;
}
</style>
