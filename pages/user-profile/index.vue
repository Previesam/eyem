<template>
  <v-card
    :loading="loading"
    :min-height="$vuetify.breakpoint.mobile ? '86vh' : '84.6vh'"
  >
    <v-card-title
      ><span>User Profile</span><v-spacer></v-spacer
      ><v-btn
        @click="editUser()"
        outlined
        color="primary"
        class="text-capitalize"
        ><v-icon left>mdi-pencil</v-icon> Edit</v-btn
      ></v-card-title
    >
    <v-card-text class="text-center">
      <v-card hover>
        <v-card-text>
          <v-avatar
            v-if="$auth.loggedIn"
            color="primary"
            size="70"
            class="white--text text-h4 mt-5 mb-7"
            @click="editing ? $refs.profile_input.click : false"
            ><v-file-input
              v-show="false"
              v-model="user.imgUrl"
              label="Profile Pic"
              ref="profile_input"
            ></v-file-input>
            <span v-show="!editing">{{
              user.firstname[0] + user.lastname[0]
            }}</span></v-avatar
          >
          <p class="text-h4">
            <v-text-field
              v-model="user.firstname"
              outlined
              dense
              prepend-inner-icon="mdi-account"
              v-show="editing"
              label="First Name"
            ></v-text-field
            ><v-text-field
              v-model="user.lastname"
              outlined
              dense
              prepend-inner-icon="mdi-account"
              v-show="editing"
              label="Last Name"
            ></v-text-field>
            <v-text-field
              v-model="user.email"
              outlined
              dense
              v-show="editing"
              label="Email"
              prepend-inner-icon="mdi-email"
            ></v-text-field
            ><v-text-field
              v-model="user.phone"
              outlined
              dense
              v-show="editing"
              label="Phone No"
              prepend-inner-icon="mdi-email"
            ></v-text-field>
            <v-autocomplete
              v-model="user.defaultBranch"
              outlined
              :items="branches"
              item-text="Name"
              item-value="id"
              dense
              v-show="editing"
              label="Default Branch"
              prepend-inner-icon="mdi-source-branch"
            ></v-autocomplete>
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
                  v-show="editing"
                  dense
                  label="Date of Birth"
                  hint="MM/DD/YYYY"
                  prepend-inner-icon="mdi-calendar"
                  outlined
                  v-bind="attrs"
                  @blur="user.dateOfBirth = parseDate(dobFormatted)"
                  v-on="on"
                  required
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="user.dateOfBirth"
                no-title
                @input="menu2 = false"
                prev-icon="mdi-account"
              ></v-date-picker>
            </v-menu>
            <span v-show="!editing">
              {{ user.firstname + " " + user.lastname }}
            </span>
          </p>
          <p v-show="!editing">
            {{ user.role.name + " > " + user.designation }}
          </p>
        </v-card-text>
      </v-card>
      <v-container v-show="!editing" fluid class="pa-0 mt-5 text-left">
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-card hover
              ><v-card-subtitle>Email:</v-card-subtitle>
              <v-card-text
                ><span>{{ user.email }}</span></v-card-text
              ></v-card
            >
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-card hover
              ><v-card-subtitle>Phone:</v-card-subtitle>
              <v-card-text
                ><span>{{ user.phone }}</span></v-card-text
              >
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-card hover
              ><v-card-subtitle>Date of Birth:</v-card-subtitle>
              <v-card-text
                ><span>{{ formatDate(user.dateOfBirth) }}</span></v-card-text
              >
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-card hover
              ><v-card-subtitle>Role:</v-card-subtitle>
              <v-card-text>{{ user.role.name }} </v-card-text></v-card
            >
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-card hover>
              <v-card-subtitle>Designation:</v-card-subtitle>
              <v-card-text>{{ user.designation }} </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-card hover>
              <v-card-subtitle>Default Branch:</v-card-subtitle>
              <v-card-text
                ><span>{{ user.defaultBranch.Name }}</span></v-card-text
              >
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card hover>
              <v-card-subtitle>Alllowed Branches:</v-card-subtitle>
              <v-card-text
                ><span v-for="branch in user.branches" :key="branch.id"
                  >{{ branch.Name
                  }}<span
                    v-show="
                      user.branches.indexOf(branch) !== user.branches.length - 1
                    "
                    >,
                  </span></span
                >
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "UserProfile",
  data: (vm) => ({
    rules: {
      name: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 3) || "Min 3 characters",
      ],
      role: [(value) => !!value || "Required"],
      branches: [(val) => !!val || "Required"],
    },
    user: { ...vm.$auth.user },
    editing: false,
    branches: [],
    loading: false,
    menu2: false,
  }),
  computed: {
    dobFormatted() {
      return this.formatDate(this.user.dateOfBirth), console.log(this.user);
    },
  },
  methods: {
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
    editUser() {
      this.editing = !this.editing;
    },
    async initialize() {
      let branches = await this.$axios("/branches", {
        method: "GET",
      })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });

      this.branches = branches;
      this.loading = false;
    },
  },
  mounted() {
    this.initialize();
  },
};
</script>

<style scoped>
v-file-input.profile-input {
  height: 60px !important;
  width: 60px !important;
  border-radius: 50% !important;
}
</style>