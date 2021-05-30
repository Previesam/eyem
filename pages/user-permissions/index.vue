<template>
  <v-card width="100%" min-height="84vh" class="rounded mt-1 mx-auto">
    <v-data-iterator
      :items="roles"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      no-data-text="No roles defined yet"
      :class="roles.length < 1 ? 'text-center' : ''"
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
            max-width="1000"
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
                <span :hidden="$vuetify.breakpoint.smAndDown">New Role</span>
              </v-btn>
            </template>
            <v-card :class="$vuetify.breakpoint.width >= 600 ? 'rounded' : ''">
              <v-card-title>
                <h1 class="text-h6">{{ formTitle }}</h1>
                <v-spacer></v-spacer>
                <v-btn icon @click="close()"><v-icon>mdi-close</v-icon></v-btn>
              </v-card-title>
              <v-card-text>
                <v-container fluid>
                  <v-form v-model="valid" ref="roleForm">
                    <v-card-subtitle class="mt-5"
                      >Fill in the role details</v-card-subtitle
                    >
                    <v-row>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field
                          :rules="rules.name"
                          prepend-icon="mdi-account-key"
                          v-model="editedItem.name"
                          label="Name"
                          hide-details="auto"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-textarea
                          :rules="rules.name"
                          rows="2"
                          prepend-icon="mdi-details"
                          v-model="editedItem.roleDescription"
                          label="Description"
                          hide-details="auto"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                    <v-card-subtitle class="mt-5"
                      >Select Permissions</v-card-subtitle
                    >
                    <v-row>
                      <v-col cols="12">
                        <v-card elevation="0">
                          <v-card-title class="py-1">
                            <span class="text-body-1" style="font-weight: bold">
                              Item
                            </span>
                            <v-spacer></v-spacer>
                            <span
                              class="mr-8 text-body-2"
                              v-if="$vuetify.breakpoint.width >= 600"
                              >View</span
                            >
                            <v-icon class="mr-8" small v-else>mdi-eye</v-icon>
                            <span
                              class="mr-8 text-body-2"
                              v-if="$vuetify.breakpoint.width >= 600"
                              >Create</span
                            >
                            <v-icon class="mr-8" small v-else
                              >mdi-content-save</v-icon
                            >
                            <span
                              v-if="$vuetify.breakpoint.width >= 600"
                              class="mr-8 text-body-2"
                              >Edit</span
                            >
                            <v-icon class="mr-8" small v-else
                              >mdi-pencil</v-icon
                            >
                            <span
                              v-if="$vuetify.breakpoint.width >= 600"
                              class="text-body-2"
                              >Delete</span
                            >
                            <v-icon small v-else>mdi-delete</v-icon>
                          </v-card-title>
                        </v-card>
                      </v-col>
                      <v-col cols="12" class="pt-0">
                        <v-card
                          v-for="(item, key) in editedItem.permissions"
                          :key="key"
                          class="mb-2"
                        >
                          <v-card-title
                            :class="{
                              'pr-1': $vuetify.breakpoint.width <= 600
                            }"
                            class="py-1 emailTemplates"
                          >
                            <span
                              class="text-body-2 text-capitalize"
                              style="font-weight: bold"
                            >
                              {{ item.display }}
                            </span>
                            <v-spacer></v-spacer>
                            <span
                              :class="
                                $vuetify.breakpoint.width >= 600
                                  ? 'mr-9'
                                  : 'mr-4'
                              "
                              ><v-checkbox
                                v-model="item.view"
                                :rules="[
                                  !!item.create ||
                                    !!item.edit ||
                                    !!item.delete ||
                                    !!item.view ||
                                    'Please select at least one option'
                                ]"
                              ></v-checkbox
                            ></span>
                            <span
                              :class="
                                $vuetify.breakpoint.width >= 600
                                  ? 'mr-8'
                                  : 'mr-4'
                              "
                              ><v-checkbox
                                :rules="[
                                  !!item.create ||
                                    !!item.edit ||
                                    !!item.delete ||
                                    !!item.view ||
                                    'Please select at least one option'
                                ]"
                                @change="
                                  item.create ? (item.view = true) : false
                                "
                                v-model="item.create"
                              ></v-checkbox
                            ></span>
                            <span
                              :class="
                                $vuetify.breakpoint.width >= 600
                                  ? 'mr-8'
                                  : 'mr-4'
                              "
                              ><v-checkbox
                                :rules="[
                                  !!item.edit ||
                                    !!item.delete ||
                                    !!item.create ||
                                    !!item.view ||
                                    'Please select at least one option'
                                ]"
                                @change="
                                  item.edit
                                    ? ((item.view = true), (item.create = true))
                                    : false
                                "
                                v-model="item.edit"
                              ></v-checkbox
                            ></span>
                            <span
                              ><v-checkbox
                                :rules="[
                                  !!item.delete ||
                                    !!item.edit ||
                                    !!item.create ||
                                    !!item.view ||
                                    'Please select at least one option'
                                ]"
                                @change="
                                  item.delete
                                    ? ((item.view = true),
                                      (item.create = true),
                                      (item.edit = true))
                                    : false
                                "
                                v-model="item.delete"
                              ></v-checkbox
                            ></span>
                          </v-card-title>
                        </v-card>
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
                {{ itemToDelete.name }}
                Role?</v-card-title
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
            v-model="dialogView"
            persistent
            scrollable
            :fullscreen="$vuetify.breakpoint.width <= 600 ? true : false"
            overlay-color="blue"
            width="600px"
          >
            <v-card>
              <v-divider></v-divider>
              <v-card-text class="pa-2">
                <div class="mb-2 subtitle-1 d-flex">
                  <div>
                    <div class="caption">
                      Created:
                      {{
                        formatDate(
                          roleToView.createdAt ||
                            new Date().toISOString().substr(0, 10)
                        )
                      }}
                    </div>
                    <div class="subtitle-2 font-weight-bold">
                      Role # {{ roleToView.id }}
                    </div>
                  </div>
                  <div class="ml-auto my-auto">
                    <v-icon @click.stop="dialogView = !dialogView"
                      >mdi-close</v-icon
                    >
                  </div>
                </div>
                <v-divider></v-divider>
                <v-card-text class="text-body-1" style="font-weight: bold"
                  ><v-icon left>mdi-account</v-icon>
                  {{ roleToView.name }}</v-card-text
                >
                <v-card-text>{{ roleToView.roleDescription }}</v-card-text>
                <v-card-subtitle>Permissions</v-card-subtitle>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-card elevation="0">
                        <v-card-title class="py-1">
                          <span class="text-body-1" style="font-weight: bold">
                            Item
                          </span>
                          <v-spacer></v-spacer>
                          <span
                            class="mr-8 text-body-2"
                            v-if="$vuetify.breakpoint.width >= 600"
                            >View</span
                          >
                          <v-icon class="mr-8" small v-else>mdi-eye</v-icon>
                          <span
                            class="mr-8 text-body-2"
                            v-if="$vuetify.breakpoint.width >= 600"
                            >Create</span
                          >
                          <v-icon class="mr-8" small v-else
                            >mdi-content-save</v-icon
                          >
                          <span
                            v-if="$vuetify.breakpoint.width >= 600"
                            class="mr-8 text-body-2"
                            >Edit</span
                          >
                          <v-icon class="mr-8" small v-else>mdi-pencil</v-icon>
                          <span
                            v-if="$vuetify.breakpoint.width >= 600"
                            class="text-body-2"
                            >Delete</span
                          >
                          <v-icon small v-else>mdi-delete</v-icon>
                        </v-card-title>
                      </v-card>
                    </v-col>
                    <v-col cols="12" class="pt-0">
                      <v-card
                        v-for="(item, key) in roleToView.permissions"
                        :key="key"
                        class="mb-2"
                      >
                        <v-card-title
                          :class="{ 'pr-1': $vuetify.breakpoint.width <= 600 }"
                          class="py-1 emailTemplates"
                        >
                          <span
                            class="text-body-2 text-capitalize"
                            style="font-weight: bold"
                          >
                            {{ item.display }}
                          </span>
                          <v-spacer></v-spacer>
                          <span
                            :class="
                              $vuetify.breakpoint.width >= 600 ? 'mr-9' : 'mr-4'
                            "
                            ><v-checkbox
                              readonly
                              v-model="item.view"
                            ></v-checkbox
                          ></span>
                          <span
                            :class="
                              $vuetify.breakpoint.width >= 600 ? 'mr-8' : 'mr-4'
                            "
                            ><v-checkbox
                              readonly
                              v-model="item.create"
                            ></v-checkbox
                          ></span>
                          <span
                            :class="
                              $vuetify.breakpoint.width >= 600 ? 'mr-8' : 'mr-4'
                            "
                            ><v-checkbox
                              readonly
                              v-model="item.edit"
                            ></v-checkbox
                          ></span>
                          <span
                            ><v-checkbox
                              readonly
                              v-model="item.delete"
                            ></v-checkbox
                          ></span>
                        </v-card-title>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="accent"
                  class="text-capitalize"
                  small
                  outlined
                  @click="editItem(roleToView)"
                  >Edit</v-btn
                >
                <v-btn
                  color="red darken-2"
                  outlined
                  class="ml-2 text-capitalize"
                  small
                  @click="deleteItem(roleToView)"
                  >Delete</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- End Preview Dialog -->
        </v-card-title>
      </template>
      <template v-slot:default="props">
        <v-row class="px-1" dense>
          <v-col cols="12">
            <v-card
              v-for="item in props.items"
              :key="item.id"
              class="mb-2"
              @click="view(item)"
            >
              <div
                class="emailTemplates d-flex flex-no-wrap justify-space-between"
              >
                <div>
                  <v-card-title class="text-body-1" style="font-weight: bold">
                    {{ item.name }}
                  </v-card-title>
                  <v-card-subtitle>
                    {{ item.roleDescription }}
                  </v-card-subtitle>
                </div>
                <v-card-actions>
                  <v-btn
                    color="accent"
                    ref="editBtn"
                    text
                    class="text-capitalize"
                    small
                    @click="editItem(item)"
                    >Edit</v-btn
                  >
                  <v-btn
                    color="red darken-2"
                    ref="deleteBtn"
                    text
                    class="ml-1 text-capitalize"
                    small
                    @click="deleteItem(item)"
                    >Delete</v-btn
                  >
                </v-card-actions>
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
      loading: false,
      rules: {
        name: [
          value => !!value || "Required.",
          value => (value && value.length >= 3) || "Min 3 characters"
        ]
      },
      search: "",
      dialog: false,
      dialogView: false,
      roleToView: {
        name: "",
        roleDescription: "",
        permissions: {
          messages: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Messages"
          },
          jobs: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Jobs"
          },
          appointments: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Appointments"
          },
          clockInOut: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Clock In/Out"
          },
          itHelpDesk: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "IT Help Desk"
          },
          manageBranch: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Manage Branches"
          },
          manageUsers: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Manage Users"
          },
          permissions: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Permissions"
          },
          emailTemplates: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Email Templates"
          }
        }
      },
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        name: "",
        roleDescription: "",
        permissions: {
          messages: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Messages"
          },
          jobs: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Jobs"
          },
          appointments: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Appointments"
          },
          clockInOut: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Clock In/Out"
          },
          itHelpDesk: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "IT Help Desk"
          },
          manageBranch: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Manage Branches"
          },
          manageUsers: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Manage Users"
          },
          permissions: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Permissions"
          },
          emailTemplates: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Email Templates"
          }
        }
      },
      defaultItem: {
        name: "",
        roleDescription: "",
        permissions: {
          messages: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Messages"
          },
          jobs: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Jobs"
          },
          appointments: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Appointments"
          },
          clockInOut: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Clock In/Out"
          },
          itHelpDesk: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "IT Help Desk"
          },
          manageBranch: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Manage Branches"
          },
          manageUsers: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Manage Users"
          },
          permissions: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Permissions"
          },
          emailTemplates: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            display: "Email Templates"
          }
        }
      },
      itemToDelete: {},
      keys: ["Title", "Details"],
      itemsPerPageArray: [2, 4, 12],
      sortDesc: false,
      filter: {},
      itemsPerPage: 2,
      sortBy: "title",
      roles: []
    };
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.roles.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter(key => key !== "Name");
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Role" : "Edit Role";
    },
    permissions() {
      return this.editedItem;
    },
    name() {
      return this.editedItem.name;
    },
    roleDescription() {
      return this.editedItem.roleDescription;
    },
    messages() {
      return (
        this.editedItem.permissions.messages.view +
        this.editedItem.permissions.messages.create +
        this.editedItem.permissions.messages.edit +
        this.editedItem.permissions.messages.delete
      );
    },
    jobs() {
      return (
        this.editedItem.permissions.jobs.view +
        this.editedItem.permissions.jobs.create +
        this.editedItem.permissions.jobs.edit +
        this.editedItem.permissions.jobs.delete
      );
    },
    appointments() {
      return (
        this.editedItem.permissions.appointments.view +
        this.editedItem.permissions.appointments.create +
        this.editedItem.permissions.appointments.edit +
        this.editedItem.permissions.appointments.delete
      );
    },
    clockInOut() {
      return (
        this.editedItem.permissions.clockInOut.view +
        this.editedItem.permissions.clockInOut.create +
        this.editedItem.permissions.clockInOut.edit +
        this.editedItem.permissions.clockInOut.delete
      );
    },
    itHelpDesk() {
      return (
        this.editedItem.permissions.itHelpDesk.view +
        this.editedItem.permissions.itHelpDesk.create +
        this.editedItem.permissions.itHelpDesk.edit +
        this.editedItem.permissions.itHelpDesk.delete
      );
    },
    manageBranch() {
      return (
        this.editedItem.permissions.manageBranch.view +
        this.editedItem.permissions.manageBranch.create +
        this.editedItem.permissions.manageBranch.edit +
        this.editedItem.permissions.manageBranch.delete
      );
    },
    manageUsers() {
      return (
        this.editedItem.permissions.manageUsers.view +
        this.editedItem.permissions.manageUsers.create +
        this.editedItem.permissions.manageUsers.edit +
        this.editedItem.permissions.manageUsers.delete
      );
    },
    permissions() {
      return (
        this.editedItem.permissions.permissions.view +
        this.editedItem.permissions.permissions.create +
        this.editedItem.permissions.permissions.edit +
        this.editedItem.permissions.permissions.delete
      );
    },
    emailTemplates() {
      return (
        this.editedItem.permissions.emailTemplates.view +
        this.editedItem.permissions.emailTemplates.create +
        this.editedItem.permissions.emailTemplates.edit +
        this.editedItem.permissions.emailTemplates.delete
      );
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    name() {
      console.log(this.editedItem.name);
      this.saveToLocalStorage();
    },
    roleDescription() {
      this.saveToLocalStorage();
    },
    messages() {
      this.saveToLocalStorage();
    },
    jobs() {
      this.saveToLocalStorage();
    },
    appointments() {
      this.saveToLocalStorage();
    },
    clockInOut() {
      this.saveToLocalStorage();
    },
    itHelpDesk() {
      this.saveToLocalStorage();
    },
    manageBranch() {
      this.saveToLocalStorage();
    },
    manageUsers() {
      this.saveToLocalStorage();
    },
    permissions() {
      this.saveToLocalStorage();
    },
    emailTemplates() {
      this.saveToLocalStorage();
    }
  },

  async mounted() {
    console.log(this.roleToView);
    this.loading = true;
    await this.initialize();
    if (this.$route.query.id) {
      let role = this.roles.filter(item => item.id === this.$route.query.id);
      if (role.length > 0) {
        this.view(role[0]);
      } else {
        this.$router.push("user-permissions");
        this.$store.dispatch("toast/snackbar", {
          type: "error",
          message: `Invalid URL parameter`,
          timeout: 3000
        });
      }
    }
    this.loading = false;
    if (!localStorage.getItem("editedRole")) {
      localStorage.setItem("editedRole", JSON.stringify(this.defaultItem));
    }
    this.updateStorage(true);
  },

  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    view(role) {
      this.roleToView = role;
      this.dialogView = true;
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
      localStorage.setItem("editedRole", JSON.stringify(editedItem));
      this.updateStorage(false);
    },
    updateStorage(showDialog) {
      let editedItem = JSON.parse(localStorage.getItem("editedRole"));
      this.editedItem = editedItem;
      if (showDialog && (editedItem.name || editedItem.roleDescription)) {
        this.dialog = true;
      }
    },

    async initialize() {
      this.loading = true;

      try {
        let response = await this.$axios("/roles", {
          method: "GET"
        });
        if (response) {
          this.roles = response.data;
        }
      } catch (err) {
        console.error(err.response);
      }

      this.loading = false;
    },

    editItem(item) {
      this.editedIndex = this.roles.indexOf(item);
      this.editedItem = item;
      this.dialogView = false;
      this.dialog = true;
      event.stopPropagation();
    },

    deleteItem(item) {
      this.editedIndex = this.roles.indexOf(item);
      this.itemToDelete = item;
      this.dialogView = false;
      this.dialogDelete = true;
      event.stopPropagation();
    },

    async deleteItemConfirm() {
      await this.$axios(`/role/delete/${this.itemToDelete.id}`, {
        method: "DELETE"
      })
        .then(res => {
          this.roles.splice(this.editedIndex, 1);
          this.$store.dispatch("toast/snackbar", {
            type: "success",
            message: `${this.itemToDelete.name} role was deleted successfully`,
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
      this.$nextTick(() => {
        this.editedItem = this.defaultItem;
        this.editedIndex = -1;
      });
      this.clear();
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
          await this.$axios(`/role/update/${editedItem.id}`, {
            method: "PUT",
            data: rest
          }).then(async res => {
            await Object.assign(this.roles[this.editedIndex], res.data);
            this.loading = false;
            this.close();
            this.$store.dispatch("toast/snackbar", {
              type: "success",
              message: `${res.data.name} role was updated successfully`,
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
        editedItem.createdBy = this.$auth.user._id;
        editedItem.lastModifiedBy = editedItem.createdBy;
        try {
          await this.$axios("/role/create", {
            method: "POST",
            data: editedItem
          }).then(res => {
            this.roles.push(res.data);
            this.loading = false;
            this.close();
            this.$store.dispatch("toast/snackbar", {
              type: "success",
              message: `${res.data.name} role was saved successfully`,
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
      this.$refs.roleForm.reset();
      localStorage.setItem("editedRole", JSON.stringify(this.defaultItem));
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
