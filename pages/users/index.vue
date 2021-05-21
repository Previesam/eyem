<template>
  <v-card width="100%" min-height="84vh" class="rounded mt-1 mx-auto">
    <v-data-iterator
      :items="users"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      no-data-text="No users defined yet"
      :class="users.length < 1 ? 'text-center' : ''"
      :loading="loading"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-card-title height="50px" class="mb-1">
          <v-text-field
            dense
            v-model="search"
            clearable
            :style="$vuetify.breakpoint.width < 422 ? 'width: 220px' : ''"
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              dense
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              prepend-inner-icon="mdi-magnify"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle tile rounded v-model="sortDesc" mandatory>
              <v-btn x-small icon large depressed color="blue" :value="false">
                <v-icon small>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn x-small icon large depressed color="blue" :value="true">
                <v-icon small>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>

          <v-spacer></v-spacer>

          <!-- Begin Create and Edit Dialog -->

          <v-dialog
            v-model="dialog"
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
                <span :hidden="$vuetify.breakpoint.smAndDown">New User</span>
              </v-btn>
            </template>
            <v-card :class="$vuetify.breakpoint.width >= 600 ? 'rounded' : ''">
              <v-card-title>
                <h1 class="text-h6">{{ formTitle }}</h1>
                <v-spacer></v-spacer>
                <v-btn icon @click="close()"><v-icon>mdi-close</v-icon></v-btn>
              </v-card-title>
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
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >No</v-btn
                >
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

          <!-- Begin preview dialog -->

          <v-dialog
            v-model="dialogViewJob"
            persistent
            scrollable
            :fullscreen="$vuetify.breakpoint.width <= 600 ? true : false"
            overlay-color="blue"
            width="500px"
          >
            <v-card>
              <v-divider></v-divider>
              <v-card-text class="pa-2">
                <div class="mb-2 subtitle-1 d-flex">
                  <div>
                    <div class="caption">
                      {{ formatDate(jobToView.dateIn) }}
                    </div>
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
                              m => m.value === jobToView.status
                            )[0].title
                          }}</span>
                        </v-chip>
                      </template>
                      <v-list dense>
                        <v-list-item
                          v-for="(status, i) in defaultStatuses"
                          :key="i"
                          link
                        >
                          <v-list-item-title
                            @click="changeStatus(jobToView, status.value)"
                            >{{ status.title }}</v-list-item-title
                          >
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
      </template>
      <template v-slot:default="props">
        <v-row class="px-1" dense>
          <v-col cols="12">
            <v-card
              @click.stop="alert(item, $event)"
              v-for="item in props.items"
              :key="item.id"
              class="mb-2"
            >
              <div
                class="emailTemplates d-flex flex-no-wrap justify-space-between"
              >
                <div>
                  <v-card-title class="text-body-1" style="font-weight: bold">
                    {{ item.fullname }}
                  </v-card-title>
                  <v-card-subtitle class="pb-0">
                    {{ item.role }} > {{ item.designation }}
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-btn
                      color="accent"
                      ref="editBtn"
                      text
                      class="text-capitalize"
                      small
                      @click="editDeleteBtn($event)"
                      >Edit</v-btn
                    >
                    <v-btn
                      color="red darken-2"
                      ref="deleteBtn"
                      text
                      class="ml-1 text-capitalize"
                      small
                      @click="editDeleteBtn($event)"
                      >Delete</v-btn
                    >
                  </v-card-actions>
                </div>
                <v-avatar
                  :size="$vuetify.breakpoint.width > 600 ? '70' : '50'"
                  class="mx-1 my-auto white--text mr-2"
                  color="primary"
                  :style="
                    $vuetify.breakpoint.width < 600
                      ? 'font-size: 20px'
                      : 'font-size: 30px'
                  "
                  dark
                  ><v-img v-if="item.imgUrl" :src="item.imgUrl"></v-img
                  ><span v-else>{{
                    item.fullname.split(` `)[0][0] +
                      item.fullname.split(` `)[1][0]
                  }}</span></v-avatar
                >
              </div>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer>
        <v-row class="my-2 px-5" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span
            class="mr-4
            grey--text"
          >
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="mr-1"
            x-small
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            x-small
            dark
            color="blue darken-3"
            class="ml-1"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-card>
</template>

<script>
export default {
  name: "Users",
  data: function(vm) {
    return {
      page: 1,
      valid: false,
      allowSelect: false,
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
      jobToView: {
        id: "",
        client: {
          id: "",
          Code: "",
          Name: ""
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
        doctor: "",
        branch: ""
      },
      dialogDelete: false,
      emailTemplates: [],
      editedIndex: -1,
      editedItem: {
        client: {
          id: "",
          Code: "",
          Name: ""
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
        doctor: "",
        branch: ""
      },
      dateInFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      dateOutFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      defaultItem: {
        client: {
          id: "",
          Code: "",
          Name: ""
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
        doctor: "",
        branch: ""
      },
      itemToDelete: {},
      clientIsLoading: false,
      clientSearch: "",
      keys: ["Title", "Details"],
      itemsPerPageArray: [2, 4, 12],
      sortDesc: false,
      filter: {},
      itemsPerPage: 2,
      sortBy: "title",
      users: []
    };
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.users.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter(key => key !== "Name");
    },
    deleteItemClientName() {
      return this.itemToDelete?.client?.Name;
    },
    formTitle() {
      return this.editedIndex === -1 ? "New User" : "Edit User";
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
    }
  },

  async mounted() {
    this.loading = true;
    await this.initialize();
    if (this.$route.query.id) {
      let user = this.users.filter(item => item.id === this.$route.query.id);
      if (user.length > 0) {
        this.view(user[0]);
      } else {
        this.$router.push("users");
        this.$store.dispatch("toast/snackbar", {
          type: "error",
          message: `Invalid URL parameter`,
          timeout: 3000
        });
      }
    }
    this.clients = this.$store.state.clients
      .filter(item => item.Name)
      .map(m => m);
    this.loading = false;
    if (!localStorage.getItem("editedUser")) {
      localStorage.setItem("editedUser", JSON.stringify(this.defaultItem));
    }
    this.updateStorage(true);
  },

  methods: {
    editDeleteBtn(e) {
      alert("Edit or Delete");
      e.stopPropagation();
    },
    alert(item, e) {
      alert(item.title);
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
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
    saveToLocalStorage() {
      let editedItem = this.editedItem;
      localStorage.setItem("editedUser", JSON.stringify(editedItem));
      this.updateStorage(false);
    },
    updateStorage(showDialog) {
      let editedItem = JSON.parse(localStorage.getItem("editedUser"));
      this.editedItem = editedItem;
      if (
        showDialog &&
        (editedItem.id ||
          editedItem.client.id ||
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
      this.loading = true;
      try {
        let response = await this.$axios("/users", {
          method: "GET"
        });
        if (response) {
          this.users = response.data;
        }
      } catch (err) {
        console.log(err.response);
      }
      this.loading = false;
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = item;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.itemToDelete = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await this.$axios(`/user/delete/${this.itemToDelete.id}`, {
        method: "DELETE"
      })
        .then(res => {
          this.users.splice(this.editedIndex, 1);
          this.$store.dispatch("toast/snackbar", {
            type: "success",
            message: `${this.itemToDelete.fullname} was deleted successfully`,
            timeout: 2000
          });
          this.closeDelete();
        })
        .catch(err => {
          console.log(err.response);
        });
    },

    close() {
      this.dialog = false;
      localStorage.removeItem("editedUser");
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
      if (this.editedIndex > -1) {
        editedItem.branch = this.$store.state.branch.id;
        try {
          let { id, ...rest } = editedItem;
          await this.$axios(`/user/update/${editedItem.id}`, {
            method: "PUT",
            data: rest
          }).then(async res => {
            await Object.assign(this.jobs[this.editedIndex], res.data);
            this.loading = false;
            this.close();
            this.$store.dispatch("toast/snackbar", {
              type: "success",
              message: `${res.data.fullname} was updated successfully`,
              timeout: 3000
            });
          });
        } catch (err) {
          console.log(err.response);
          this.loading = false;
          this.$store.dispatch("toast/snackbar", {
            type: "error",
            message: err.response.data.message,
            timeout: 3000
          });
        }
      } else {
        editedItem.branch = this.$store.state.branch.id;
        try {
          await this.$axios("/user/signup", {
            method: "POST",
            data: editedItem
          }).then(res => {
            this.users.push(res.data);
            this.loading = false;
            this.close();
            this.$store.dispatch("toast/snackbar", {
              type: "success",
              message: `${res.data.fullname} was saved successfully`,
              timeout: 3000
            });
          });
        } catch (err) {
          this.loading = false;
          console.log(err.response);
          this.$store.dispatch("toast/snackbar", {
            type: "error",
            message: err.response.data.message,
            timeout: 3000
          });
        }
      }
    },

    clear() {
      this.$refs.jobForm.reset();
      localStorage.setItem("editedUser", JSON.stringify(this.defaultItem));
    }
  }
};
</script>

<style scoped>
.v-input__control {
  min-height: 20px !important;
}

.overflow-scroll {
  overflow-y: auto;
  overflow-x: hidden;
}

#email-editor-container,
#editor-1 {
  height: 85vh;
}

div.emailTemplates {
  border-left: 0.2rem solid blue;
}
</style>