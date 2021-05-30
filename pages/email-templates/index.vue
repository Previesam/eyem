<template>
  <v-card
    width="100%"
    :min-height="editedItem.editing ? 'auto' : '84vh'"
    class="rounded mt-1 mx-auto"
    :loading="loading"
  >
    <v-card
      max-height="100%"
      style="overflow-hidden"
      id="email-editor-container"
      v-if="editedItem.editing"
    >
      <v-form v-model="valid" ref="templateForm">
        <v-card-title>
          <h1 class="text-h6">{{ formTitle }}</h1>
          <v-spacer></v-spacer>
          <v-btn
            small
            class="rounded text-capitalize body-2"
            outlined
            color="primary"
            tile
            @click="save()"
            :disabled="!valid"
            :loading="loading"
            ><v-icon small :left="$vuetify.breakpoint.width >= 600"
              >mdi-content-save</v-icon
            ><span v-show="$vuetify.breakpoint.width >= 600">Save</span>
          </v-btn>
          <v-btn
            small
            class="rounded ml-3 text-capitalize body-2"
            outlined
            color="accent"
            tile
            :disabled="!valid"
            ><v-icon small :left="$vuetify.breakpoint.width >= 600"
              >mdi-email</v-icon
            ><span v-show="$vuetify.breakpoint.width >= 600">Test</span>
          </v-btn>
          <v-btn icon @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text class="py-0 px-3 ma-0"
          ><v-text-field
            v-model="editedItem.title"
            label="Title"
            dense
            outlined
            :rules="rules"
          ></v-text-field
        ></v-card-text>
        <v-card-text class="py-0 px-3 ma-0"
          ><v-textarea
            rows="2"
            v-model="editedItem.description"
            label="Description"
            dense
            :rules="rules"
            outlined
          ></v-textarea
        ></v-card-text>
      </v-form>
      <v-card-text class="px-3 ma-0 py-0" id="email-editor"
        ><froala
          :tag="'textarea'"
          :config="config"
          v-model="editedItem.html"
        ></froala
      ></v-card-text>
    </v-card>
    <v-data-iterator
      v-else
      :items="emailTemplates"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      no-data-text="No templates defined yet"
      :class="emailTemplates.length < 1 ? 'text-center' : ''"
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
          <v-btn
            color="primary"
            outlined
            class="text-capitalize"
            @click="newItem()"
            ><v-icon :left="$vuetify.breakpoint.smAndDown ? false : true" small
              >mdi-plus</v-icon
            >
            <span :hidden="$vuetify.breakpoint.smAndDown">New Template</span>
          </v-btn>

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
                {{ itemToDelete.title }}
                ?</v-card-title
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
            v-model="dialogViewTemplate"
            persistent
            scrollable
            :fullscreen="$vuetify.breakpoint.width <= 600 ? true : false"
            overlay-color="blue"
            width="500px"
          >
            <!-- <v-card>
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
            </v-card> -->
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
                    {{ item.title }}
                  </v-card-title>
                  <v-card-subtitle>
                    {{ item.description }}
                  </v-card-subtitle>
                </div>
                <v-card-actions>
                  <v-btn
                    color="accent"
                    ref="editBtn"
                    text
                    class="text-capitalize"
                    small
                    @click="editItem(item, $event)"
                    >Edit</v-btn
                  >
                  <v-btn
                    color="red darken-2"
                    ref="deleteBtn"
                    text
                    class="ml-2 text-capitalize"
                    small
                    @click="deleteItem(item, $event)"
                    >Delete</v-btn
                  >
                </v-card-actions>
              </div>
            </v-card>
            <!-- <v-card>
              <v-card-text class="px-3 ma-0 py-0" id="email-editor"
                ><froala
                  :tag="'textarea'"
                  :config="config"
                  v-model="editedTemplate"
                ></froala
              ></v-card-text>
            </v-card> -->
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
  name: "EmailTemplates",
  data: function(vm) {
    return {
      valid: false,
      rules: [
        value => !!value || "Required.",
        value => (value && value.length >= 3) || "Min 3 characters"
      ],
      config: {
        events: {
          "froalaEditor.initialized": function() {
            console.log("initialized");
          }
        },
        inlineClasses: {
          'fr-class-footer': 'Footer'
        }
      },
      page: 1,
      valid: false,
      allowSelect: false,
      loading: false,
      rules: [
        value => !!value || "Required.",
        value => (value && value.length >= 3) || "Min 3 characters"
      ],
      search: "",
      menu2: false,
      menu3: false,
      dialog: false,
      dialogViewTemplate: false,
      templateToView: {
        id: "",
        html: "",
        title: "",
        description: ""
      },
      dialogDelete: false,
      emailTemplates: [],
      editedIndex: -1,
      editedItem: {
        editing: false,
        html: "",
        title: "",
        description: ""
      },
      defaultItem: {
        editing: false,
        html: "Edit Your Content Here!",
        title: "",
        description: ""
      },
      itemToDelete: {},
      keys: ["Title", "Description"],
      itemsPerPageArray: [2, 4, 12],
      sortDesc: false,
      filter: {},
      itemsPerPage: 2,
      sortBy: "title"
    };
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.emailTemplates.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter(key => key !== "Name");
    },
    deleteItemClientName() {
      return this.itemToDelete?.client?.Name;
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Template" : "Edit Template";
    },
    title() {
      return this.editedItem.title;
    },
    html() {
      return this.editedItem.html;
    },
    active() {
      return this.editedItem.active;
    },
    description() {
      return this.editedItem.description;
    }
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
    title() {
      this.saveToLocalStorage();
    },
    html() {
      this.saveToLocalStorage();
    },
    description() {
      this.saveToLocalStorage();
    }
  },

  async mounted() {
    this.loading = true;
    await this.initialize();
    if (this.$route.query.id) {
      let template = this.emailTemplates.filter(
        item => item.id === this.$route.query.id
      );
      if (template.length > 0) {
        this.view(template[0]);
      } else {
        this.$router.push("email-templates");
        this.$store.dispatch("toast/snackbar", {
          type: "error",
          message: `Invalid URL parameter`,
          timeout: 3000
        });
      }
    }
    this.loading = false;
    if (!localStorage.getItem("editedTemplate")) {
      localStorage.setItem("editedTemplate", JSON.stringify(this.defaultItem));
    }
    this.updateStorage();
    this.editedIndex = localStorage.getItem("editedIndex") || -1;
  },

  methods: {
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

      this._timerId = setTimeout(() => {
        let clients = this.$store.state.clients
          .filter(item => item.Name)
          .map(m => m);

        this.clients = clients.filter(c => {
          return (
            encodeURIComponent(c.Code)
              .toString()
              .toLowerCase()
              .includes(encodeURIComponent(query).toLowerCase()) ||
            c.Name.toLowerCase().includes(query.toLowerCase())
          );
        });
        this.clientIsLoading = false;
      }, 500);
    },
    view(template) {
      this.templateToView = template;
      this.dialogViewTemplate = true;
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
      let editedTemplate = this.editedItem;
      localStorage.setItem("editedTemplate", JSON.stringify(editedTemplate));
      this.updateStorage();
    },
    updateStorage() {
      let editedTemplate = JSON.parse(localStorage.getItem("editedTemplate"));
      this.editedItem = editedTemplate;
    },

    async initialize() {
      this.loading = true;
      try {
        let response = await this.$axios("/email/templates", {
          method: "GET"
        });
        if (response) {
          this.emailTemplates = response.data;
        }
      } catch (err) {
        console.log(err.response);
      }
      this.loading = false;
    },

    editItem(item, e) {
      this.editedIndex = this.emailTemplates.indexOf(item);
      localStorage.setItem("editedIndex", this.editedIndex);
      this.editedItem = item;
      this.editedItem.editing = true;
      localStorage.setItem("editedTemplate", JSON.stringify(this.editedItem));
      e.stopPropagation();
    },

    newItem() {
      this.editedItem.editing = true;
      localStorage.setItem("editedTemplate", JSON.stringify(this.editedItem));
    },

    deleteItem(item, e) {
      this.editedIndex = this.emailTemplates.indexOf(item);
      this.itemToDelete = item;
      this.dialogDelete = true;
      e.stopPropagation();
    },

    async deleteItemConfirm() {
      await this.$axios(`/email/template/delete/${this.itemToDelete.id}`, {
        method: "DELETE"
      })
        .then(res => {
          this.emailTemplates.splice(this.editedIndex, 1);
          this.$store.dispatch("toast/snackbar", {
            type: "success",
            message: `${this.itemToDelete.title} was deleted successfully`,
            timeout: 2000
          });
          this.closeDelete();
        })
        .catch(err => {
          console.log(err.response);
        });
    },

    close() {
      this.editedItem.editing = false;
      this.$nextTick(() => {
        this.editedItem = this.defaultItem;
        localStorage.removeItem("editedIndex");
        localStorage.removeItem("editedTemplate");
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
        try {
          let { id, ...rest } = editedItem;
          rest.lastModifiedBy = this.$auth.user._id;
          await this.$axios(`/email/template/update/${id}`, {
            method: "PUT",
            data: rest
          }).then(async res => {
            await Object.assign(
              this.emailTemplates[this.editedIndex],
              res.data
            );
            this.loading = false;
            this.close();
            this.$store.dispatch("toast/snackbar", {
              type: "success",
              message: `${res.data.title} template was updated successfully`,
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
          await this.$axios("/email/template/create", {
            method: "POST",
            data: editedItem
          }).then(res => {
            this.emailTemplates.push(res.data);
            this.loading = false;
            this.close();
            this.$store.dispatch("toast/snackbar", {
              type: "success",
              message: `${res.data.title} template was saved successfully`,
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
      this.$refs.templateForm.reset();
      localStorage.setItem("editedTemplate", JSON.stringify(this.defaultItem));
    }
  }
};
</script>

<style scoped>
.v-input__control {
  min-height: 20px !important;
}

#email-editor-container {
  height: 85vh;
  width: 100%;
}

div.emailTemplates {
  border-left: 0.2rem solid blue;
}
</style>
