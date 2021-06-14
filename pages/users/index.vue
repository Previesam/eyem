<template>
  <v-card
    width="100%"
    :min-height="$vuetify.breakpoint.mobile ? '86vh' : '84.6vh'"
    class="rounded mt-1 mx-auto"
    :loading="loading"
  >
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

          <v-spacer v-show="userPermissions[$route.path].create"></v-spacer>

          <!-- Begin Create and Edit Dialog -->

          <v-dialog
            v-model="dialog"
            scrollable
            :fullscreen="$vuetify.breakpoint.width >= 600 ? false : true"
            overlay-color="blue"
            max-width="800px"
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
                <span :hidden="$vuetify.breakpoint.smAndDown">New User</span>
              </v-btn>
            </template>
            <v-card :class="$vuetify.breakpoint.width >= 600 ? 'rounded' : ''">
              <v-card-title class="pa-3">
                <h1 class="text-h6">{{ formTitle }}</h1>
                <v-spacer></v-spacer>
                <v-btn icon @click="close()"><v-icon>mdi-close</v-icon></v-btn>
              </v-card-title>
              <v-card-text>
                <v-container fluid>
                  <v-form v-model="valid" ref="userForm">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          :rules="rules.name"
                          v-model="editedItem.firstname"
                          label="First Name"
                          dense
                          prepend-inner-icon="mdi-account"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          :rules="rules.name"
                          v-model="editedItem.lastname"
                          label="Last Name"
                          dense
                          prepend-inner-icon="mdi-account"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          :rules="rules.name"
                          v-model="editedItem.email"
                          label="Email"
                          dense
                          prepend-inner-icon="mdi-email"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          :rules="rules.name"
                          v-model="editedItem.phone"
                          label="Phone No"
                          dense
                          prepend-inner-icon="mdi-phone"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
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
                              :rules="rules.name"
                              v-model="dobFormatted"
                              dense
                              label="Date of Birth"
                              hint="MM/DD/YYYY"
                              prepend-inner-icon="mdi-calendar"
                              outlined
                              v-bind="attrs"
                              @blur="
                                editedItem.dateOfBirth = parseDate(dobFormatted)
                              "
                              v-on="on"
                              required
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.dateOfBirth"
                            no-title
                            @input="menu1 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-autocomplete
                          :rules="rules.role"
                          v-model="editedItem.role"
                          item-value="id"
                          :items="roles"
                          item-text="name"
                          label="Role"
                          dense
                          prepend-inner-icon="mdi-account-key"
                          outlined
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          :rules="rules.name"
                          v-model="editedItem.designation"
                          label="Designation"
                          dense
                          prepend-inner-icon="mdi-account-group"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-autocomplete
                          :rules="[
                            val => !!val || 'Required',
                            val =>
                              editedItem.branches
                                .map(i => i.id)
                                .includes(getId(val) || val) ||
                              editedItem.branches.includes(getId(val) || val) ||
                              'Selected branch must be included in the branches allowed'
                          ]"
                          :items="branches"
                          item-text="Name"
                          item-value="id"
                          v-model="editedItem.defaultBranch"
                          label="Default Branch"
                          dense
                          prepend-inner-icon="mdi-source-branch"
                          outlined
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          :rules="rules.branches"
                          multiple
                          small-chips
                          chips
                          deletable-chips
                          :items="branches"
                          item-text="Name"
                          item-value="_id"
                          v-model="editedItem.branches"
                          label="Branches Allowed"
                          dense
                          prepend-inner-icon="mdi-source-branch"
                          outlined
                        >
                        </v-autocomplete>
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
            v-model="dialogViewUser"
            persistent
            scrollable
            :fullscreen="$vuetify.breakpoint.width <= 600 ? true : false"
            overlay-color="blue"
            width="500px"
          >
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
                    {{ item.firstname + " " + item.lastname }}
                  </v-card-title>
                  <v-card-subtitle class="pb-0">
                    {{ item.role.name }} > {{ item.designation }}
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-btn
                      color="accent"
                      ref="editBtn"
                      text
                      class="text-capitalize"
                      small
                      v-show="userPermissions[$route.path].edit"
                      @click="editItem(item, $event)"
                      >Edit</v-btn
                    >
                    <v-btn
                      color="red darken-2"
                      ref="deleteBtn"
                      text
                      class="ml-1 text-capitalize"
                      small
                      v-show="userPermissions[$route.path].delete"
                      @click="deleteItem(item, $event)"
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
                    item.firstname[0] + item.lastname[0]
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
            icon
            dark
            color="blue darken-3"
            class="mr-1"
            x-small
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            icon
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
      loading: false,
      rules: {
        name: [
          value => !!value || "Required.",
          value => (value && value.length >= 3) || "Min 3 characters"
        ],
        role: [value => !!value || "Required"],
        branches: [val => !!val || "Required"]
      },
      search: "",
      menu2: false,
      menu3: false,
      dialog: false,
      dialogViewUser: false,
      userToView: {},
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        email: "",
        dateOfBirth: new Date().toISOString().substr(0, 10),
        firstname: "",
        lastname: "",
        phone: "",
        designation: "",
        role: "",
        branches: [],
        defaultBranch: "",
        inactive: false
      },
      defaultItem: {
        email: "",
        dateOfBirth: new Date().toISOString().substr(0, 10),
        firstname: "",
        lastname: "",
        phone: "",
        designation: "",
        role: "",
        branches: [],
        defaultBranch: "",
        inactive: false
      },
      dobFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      itemToDelete: {},
      keys: ["First Name", "Last Name", "Designation"],
      itemsPerPageArray: [2, 4, 12],
      sortDesc: false,
      filter: {},
      itemsPerPage: 2,
      sortBy: "firstname",
      users: [],
      roles: [],
      branches: []
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
    firstname() {
      return this.editedItem.firstname;
    },
    email() {
      return this.editedItem.email;
    },
    lastname() {
      return this.editedItem.lastname;
    },
    phone() {
      return this.editedItem.phone;
    },
    dateOfBirth() {
      return this.editedItem.dateOfBirth;
    },
    role() {
      return this.editedItem.role?.id || this.editedItem.role;
    },
    defaultBranch() {
      return this.editedItem.defaultBranch?.id || this.editedItem.defaultBranch;
    },
    designation() {
      return this.editedItem.designation;
    },
    branchesAllowed() {
      let string = "";
      this.editedItem.branches.forEach(i => {
        string += ", " + i._id;
      });
      return string;
    },
    userPermissions() {
      return this.$auth.user.role.permissions;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    firstname() {
      this.saveToLocalStorage();
    },
    lastname() {
      this.saveToLocalStorage();
    },
    email() {
      this.saveToLocalStorage();
    },
    phone() {
      this.saveToLocalStorage();
    },
    dateOfBirth() {
      this.dobFormatted = this.formatDate(this.editedItem.dateOfBirth);
      this.saveToLocalStorage();
    },
    role() {
      this.saveToLocalStorage();
    },
    designation() {
      this.saveToLocalStorage();
    },
    branchesAllowed() {
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
        this.$store.dispatch("toast/callAddSnackbar", {
          color: "error",
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
    getId(val) {
      return val?.id;
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
          editedItem.firstname ||
          editedItem.lastname ||
          editedItem.role ||
          editedItem.defaultBranch ||
          editedItem.designation ||
          editedItem.dateOfBirth !== new Date().toISOString().substr(0, 10))
      ) {
        this.dialog = true;
      }
    },

    async initialize() {
      this.loading = true;
      try {
        let res = await this.$axios("/users", {
          method: "GET"
        });
        this.users = res.data;
        console.log(this.users)
      } catch (err) {
        console.log(err.response);
      }
      try {
        let res = await this.$axios("/roles", {
          method: "GET"
        });
        this.roles = res.data;
      } catch (err) {
        console.log(err.response);
      }

      let branches = await this.$axios("/branches", {
        method: "GET"
      })
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log(err);
        });

      this.branches = branches;
      this.loading = false;
    },

    editItem(item, e) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = item;
      this.dialog = true;
      e.stopPropagation();
    },

    deleteItem(item, e) {
      this.editedIndex = this.users.indexOf(item);
      this.itemToDelete = item;
      this.dialogDelete = true;
      e.stopPropagation();
    },

    async deleteItemConfirm() {
      await this.$axios(`/user/delete/${this.itemToDelete.id}`, {
        method: "DELETE"
      })
        .then(res => {
          this.users.splice(this.editedIndex, 1);
          this.$store.dispatch("toast/callAddSnackbar", {
            color: "success",
            message: `${this.itemToDelete.fullname} was deleted successfully`,
            timeout: 3000
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
      this.clear();
      this.$nextTick(() => {
        this.editedItem = this.defaultItem;
        this.editedIndex = -1;
        this.clear();
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
        try {
          let { id, ...rest } = editedItem;
          rest.lastModifiedBy = this.$auth.user._id;
          await this.$axios(`/user/update/${editedItem.id}`, {
            method: "PUT",
            data: rest
          }).then(async res => {
            await Object.assign(this.users[this.editedIndex], res.data);
            this.loading = false;
            this.close();
            this.$store.dispatch("toast/callAddSnackbar", {
              color: "success",
              message: `${res.data.firstname} was updated successfully`,
              timeout: 3000
            });
          });
        } catch (err) {
          console.log(err.response);
          this.loading = false;
          this.$store.dispatch("toast/callAddSnackbar", {
            color: "error",
            message: err.response.data.message,
            timeout: 100000
          });
        }
      } else {
        editedItem.createdBy = this.$auth.user._id;
        editedItem.lastModifiedBy = editedItem.createdBy;
        try {
          await this.$axios("/user/signup", {
            method: "POST",
            data: editedItem
          }).then(res => {
            this.users.push(res.data);
            this.loading = false;
            this.close();
            this.$store.dispatch("toast/callAddSnackbar", {
              color: "success",
              message: `${res.data.fullname} was saved successfully`,
              timeout: 3000
            });
          });
        } catch (err) {
          this.loading = false;
          console.log(err.response);
          this.$store.dispatch("toast/callAddSnackbar", {
            type: "error",
            message: err.response.data.message,
            timeout: 3000
          });
        }
      }
    },

    clear() {
      this.$refs.userForm.reset();
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
