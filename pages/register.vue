<template>
  <v-card width="900">
    <v-snackbar
      :transition="
        snackbar ? 'slide-x-transition' : 'slide-x-reverse-transition'
      "
      outlined
      top
      right
      v-model="snackbar"
      :timeout="timeout"
      :color="type"
    >
      {{ toastMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn small icon text v-bind="attrs" @click="snackbar = false">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-container fluid class="container">
      <div
        class="left-side"
        :style="
          $vuetify.breakpoint.width > 653 ? 'border-right: 1px solid grey' : ''
        "
      >
        <div>
          <v-img
            :class="$vuetify.breakpoint.width > 653 ? '' : 'mx-auto'"
            style="max-width: 60%"
            src="/logo.png"
          ></v-img>
          <p
            class="text-caption mr-4"
            :class="$vuetify.breakpoint.width > 653 ? '' : 'text-center'"
          >
            Welcome to account request portal, simply submit your information
            you will be contact if you are recognized employee.
          </p>
        </div>
      </div>
      <div class="right-side py-10">
        <v-form v-model="valid" ref="loginForm">
          <v-card-title class="primary--text">Register</v-card-title>
          <v-card-text
            >Please fill in your information for register.</v-card-text
          >
          <v-container fluid>
            <v-row>
              <v-col cols="12"
                ><v-text-field
                  outlined
                  prepend-inner-icon="mdi-account"
                  label="First Name"
                  v-model="firstname"
                  :rules="rules.name"
                  @keydown.stop="handleEvent($event)"
                  required
                  dense
                ></v-text-field
              ></v-col>
              <v-col cols="12"
                ><v-text-field
                  prepend-inner-icon="mdi-account"
                  label="Last Name"
                  v-model="lastname"
                  :rules="rules.name"
                  @keydown.stop="handleEvent($event)"
                  required
                  dense
                  outlined
                ></v-text-field
              ></v-col>
              <v-col cols="12"
                ><v-text-field
                  outlined
                  prepend-inner-icon="mdi-email"
                  label="Email"
                  v-model="email"
                  :rules="rules.email"
                  @keydown.stop="handleEvent($event)"
                  required
                  dense
                ></v-text-field
              ></v-col>
              <v-col cols="12">
                <v-card-actions>
                  <v-btn
                    class="text-capitalize"
                    elevation="2"
                    color="primary"
                    outlined
                    :disabled="!valid"
                    @click="userRegister()"
                    :loading="loading"
                    >Register</v-btn
                  >
                  <v-spacer></v-spacer>
                  <span>Have an account?</span>
                  <nuxt-link to="login"
                    ><v-btn outlined text class="ml-1 text-capitalize">
                      Login
                    </v-btn></nuxt-link
                  >
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </div>
    </v-container>
  </v-card>
</template>

<script>
export default {
  layout: "full-screen",
  auth: "guest",
  data: () => {
    return {
      rules: {
        name: [
          (value) => !!value || "Name is required.",
          (value) => (value && value.length >= 3) || "Min 3 characters",
        ],
        // password: [
        //   (value) => !!value || "Password is required.",
        //   (value) => (value && value.length >= 6) || "Min 6 characters",
        //   (value) =>
        //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(
        //       value
        //     ) ||
        //     "Password must container one letter, one number, one special character and aleast 6 digits long",
        // ],
        email: [
          (value) => !!value || "Email is required",
          (value) =>
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              value
            ) || "E-mail must be valid",
        ],
      },
      valid: false,
      firstname: "",
      lastname: "",
      email: "",
      snackbar: false,
      loading: false,
      timeout: 3000,
      type: "",
      toastMessage: "",
    };
  },

  methods: {
    handleEvent(event) {
      if (event.key !== "Enter" || !this.valid) return;
      this.userRegister();
    },
    sendToast(type, message, timeout) {
      this.type = type;
      this.toastMessage = message;
      this.timeout = timeout;
      this.snackbar = true;
    },
    async userRegister() {
      this.loading = true;
      try {
        let response = await this.$axios("/user/pre-signup", {
          method: "POST",
          data: {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
          },
        });
        if (response.data) {
          this.loading = false;
          return this.sendToast("success", response.data.message, 3000);
        }
        this.loading = false;
        this.sendToast("error", "Unknown error occurred", 3000);
      } catch (err) {
        if (err.response) {
          let errors = err.response.data;
          this.loading = false;
          errors.forEach((error) => {
            this.sendToast("error", error.message, 3000);
          });
        } else if (err.request) {
          this.loading = false;
          this.sendToast(
            "error",
            err.request.data ||
              "You seem to be having a network issue, please check your internet connection",
            3000
          );
        } else {
          this.loading = false;
          this.sendToast(
            "error",
            "Unknown error occurred while creating your account, please try again",
            3000
          );
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  flex-wrap: wrap;
  overflow-x: scroll;
}

.left-side {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-rows: repeat(1fr, 12);
  grid-template-columns: repeat(1fr, 12);
}

.left-side > div {
  grid-row: 1/-1;
  grid-column: 1/-1;
  display: grid;
  grid-template-rows: repeat(1fr, 12);
  grid-template-columns: repeat(1fr, 12);
  align-items: center;
  justify-content: center;
  text-align: left;
}

v-img {
  margin: 0;
  grid-row: 1/2;
  grid-column: 1/-1;
}

.left-side > div > p {
  grid-row: 2/5;
  grid-column: 1/-1;
  padding-left: 15px;
  margin: 0;
}

.rigth-side {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
