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
      <div class="left-side">
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
            Welcome
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
                  prepend-icon="mdi-account"
                  label="Name"
                  v-model="name"
                  :rules="rules.name"
                  @keydown.stop="handleEvent($event)"
                  required
                ></v-text-field
              ></v-col>
              <v-col cols="12"
                ><v-text-field
                  prepend-icon="mdi-email"
                  label="Email"
                  v-model="email"
                  :rules="rules.email"
                  @keydown.stop="handleEvent($event)"
                  required
                ></v-text-field
              ></v-col>
              <v-col cols="12">
                <v-text-field
                  prepend-icon="mdi-key"
                  label="Password"
                  v-model="password"
                  :rules="rules.password"
                  @keydown.stop="handleEvent($event)"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-card-actions>
                  <v-btn
                    class="text-capitalize"
                    elevation="2"
                    color="primary"
                    outlined
                    :disabled="!valid"
                    @click="userRegister()"
                    >Register</v-btn
                  >
                  <v-spacer></v-spacer>
                  <nuxt-link to="login"
                    ><v-card-text> Login </v-card-text></nuxt-link
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
          value => !!value || "Name is required.",
          value => (value && value.length >= 3) || "Min 3 characters"
        ],
        password: [
          value => !!value || "Password is required.",
          value => (value && value.length >= 6) || "Min 6 characters",
          value =>
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(
              value
            ) ||
            "Password must container one letter, one number, one special character and aleast 6 digits long"
        ],
        email: [
          value => !!value || "Email is required",
          value =>
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              value
            ) || "E-mail must be valid"
        ]
      },
      valid: false,
      name: "",
      email: "",
      password: ""
    };
  },

  computed: {
    timeout() {
      return this.$store.state.toast.timeout;
    },
    snackbar: {
      get() {
        return this.$store.state.toast.snackbar;
      },
      set() {
        this.$store.commit("toast/closeSnackbar");
      }
    },
    type() {
      return this.$store.state.toast.type;
    },
    toastMessage() {
      return this.$store.state.toast.message;
    }
  },

  methods: {
    handleEvent(event) {
      if (event.key !== "Enter" || !this.valid) return;
      this.userLogin();
    },
    sendToast() {
      this.$store.dispatch("toast/snackbar", {
        type: "success",
        message: `Login successful! Welcome back ${this.$auth.user.fullname}`
      });
    },
    async userRegister() {
      try {
        let response = await this.$axios("/user/signup", {
          method: "POST",
          data: {
            fullname: this.name,
            email: this.email,
            password: this.password
          }
        });
        await this.$auth.loginWith("local", {
          data: { email: this.email, password: this.password }
        });
        sendToast();
      } catch (err) {
        if (err.response) {
          let errors = err.response.data;
          errors.forEach(error => {
            this.$store.dispatch("toast/snackbar", {
              type: "error",
              message: error.message,
              timeout: 3000
            });
          });
        } else if (err.request) {
          this.$store.dispatch("toast/snackbar", {
            type: "error",
            message:
              "Unknown error occurred while creating your account, please try again",
            timeout: 3000
          });
        } else {
          this.$store.dispatch("toast/snackbar", {
            type: "error",
            message:
              "Unknown error occurred while creating your account, please try again",
            timeout: 3000
          });
        }
      }
    }
  }
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
