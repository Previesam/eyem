<template>
  <v-card width="900">
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
            Welcome Back
          </p>
        </div>
      </div>
      <div class="right-side py-10">
        <v-form v-model="valid" ref="loginForm">
          <v-card-title class="primary--text">Login</v-card-title>
          <v-card-text
            >Please fill in your login details to continue.</v-card-text
          >
          <v-container fluid>
            <v-row>
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
                  required
                  @keydown.stop="handleEvent($event)"
                ></v-text-field>
              </v-col>
              <nuxt-link to="account/recovery"
                ><v-card-text> Forgot Password </v-card-text></nuxt-link
              >
              <v-col cols="12">
                <v-card-actions>
                  <v-btn
                    :loading="loading"
                    class="text-capitalize"
                    elevation="2"
                    color="primary"
                    outlined
                    :disabled="!valid"
                    @click="userLogin()"
                    >Login</v-btn
                  >
                  <v-spacer></v-spacer>
                  <nuxt-link to="register"
                    ><v-card-text> Sign Up </v-card-text></nuxt-link
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
        password: [
          (value) => !!value || "Password is required.",
          (value) => (value && value.length >= 6) || "Min 6 characters",
          (value) =>
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(
              value
            ) ||
            "Password must container one letter, one number, one special character and aleast 6 digits long",
        ],
        email: [
          (value) => !!value || "Email is required",
          (value) =>
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              value
            ) || "E-mail must be valid",
        ],
      },
      valid: false,
      email: "samsmart.ass59@gmail.com",
      password: "Sam@@2015!",
      loading: false,
    };
  },
  methods: {
    handleEvent(event) {
      if (event.key !== "Enter" || !this.valid) return;
      this.userLogin();
    },
    sendToast(color, message, timeout) {
      this.$store.dispatch("toast/callAddSnackbar", {
        color,
        message,
        timeout,
      });
    },
    async userLogin() {
      this.loading = true;
      try {
        let response = await this.$auth.loginWith("local", {
          data: { email: this.email, password: this.password },
        });
        // this.$router.push('/');
        setTimeout(
          this.sendToast("success", `Login Successful!!`, 3000),
          6000 * 5
        );
        this.loading = false;
      } catch (err) {
        if (err.response) {
          let error = err.response.data;
          this.sendToast("error", error.message, 3000);
          this.loading = false;
        } else if (err.request) {
          this.sendToast(
            "error",
            "An error occurred while logging your in, please try again",
            3000
          );
          this.loading = false;
        } else {
          this.sendToast(
            "error",
            "Unknown error occurred while login to your account, please try again",
            3000
          );
          this.loading = false;
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
