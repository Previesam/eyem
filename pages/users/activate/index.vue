<template>
  <v-card width="700" height="500" class="rounded-xl">
    <v-container fluid class="pa-0" justify-content-center align-items-center>
      <v-tabs class="rounded-xl" v-model="tabs" fixed-tabs
        ><v-tab href="#mobile-tabs-5-1"><span>Activating</span></v-tab
        ><v-divider vertical color="primary"></v-divider
        ><v-tab :disabled="!activated" href="#mobile-tabs-5-2"
          ><span>Choose a password</span></v-tab
        ></v-tabs
      >
      <v-card-text>
        <v-tabs-items v-model="tabs">
          <v-tab-item value="mobile-tabs-5-1">
            <v-card flat d-flex>
              <v-card-text class="mt-15">
                <v-progress-linear
                  :indeterminate="loading"
                  color="cyan"
                ></v-progress-linear>
              </v-card-text>
              <v-card-text class="text-center">
                {{ activationStatus }}
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="mobile-tabs-5-2">
            <v-card flat>
              <v-card-text>
                <v-form ref="setPasswordForm" v-model="valid">
                  <v-container fluid class="pa-0 mt-5">
                    <v-row>
                      <v-col cols="12"
                        ><v-card-subtitle class="pa-0"
                          >Choose a password</v-card-subtitle
                        ></v-col
                      >
                      <v-col cols="12" class="mt-8">
                        <v-text-field
                          prepend-inner-icon="mdi-key"
                          label="Password"
                          outlined
                          v-model="password"
                          :rules="rules.password"
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          prepend-inner-icon="mdi-key"
                          label="Confirm Password"
                          outlined
                          v-model="confirmPassword"
                          :rules="rules.confirmPassword"
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-btn
                          @click="submitPassword()"
                          :disabled="!valid"
                          outlined
                          color="primary"
                          >Save</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "Activation",
  layout: "full-screen",
  auth: false,
  data: (vm) => ({
    activated: false,
    loading: false,
    activationStatus: "",
    password: "",
    confirmPassword: "",
    valid: false,
    tabs: null,
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
      confirmPassword: [
        (value) => !!value || "Confirm password is required.",
        (value) => (value && value.length >= 6) || "Min 6 characters",
        (value) =>
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(
            value
          ) ||
          "Password must container one letter, one number, one special character and aleast 6 digits long",
        (value) =>
          value === vm.password ||
          "Password mismatch, please confirm that the password is correct",
      ],
    },
  }),
  beforeCreate() {
    let code = this.$route?.query?.code;
    if (!code) return this.$router.push("/login");
  },
  async mounted() {
    let code = this.$route?.query?.code;
    this.activationStatus = "Activating...";
    this.loading = true;
    try {
      let response = await this.$axios(`/user/activate/${code}`, {
        method: "POST",
      });
      this.sendToast("success", response.data.message, 3000);
      this.loading = false;
      this.activationStatus = "Activated!!";
      this.activated = true;
      setTimeout(() => {
        this.tabs = "mobile-tabs-5-2";
      }, 6000 * 3);
    } catch (err) {
      if (err.response)
        return (
          this.sendToast("error", err.response.data.message, 3000),
          console.log(err.response.data.message),
          (this.loading = false),
          (this.activationStatus = `Error!!! ${err.response.data.message}`)
        );
      this.sendToast("error", err.request.message, 3000);
      console.log(err);
      this.loading = false;
      this.activationStatus = `Error!!! ${err.request.message}`;
    }
  },
  methods: {
    sendToast(color, message, timeout) {
      this.$store.dispatch("toast/callAddSnackbar", {
        color,
        message,
        timeout,
      });
    },
    async submitPassword() {
      let data = {
        password: this.password,
        confirmPassword: this.confirmPassword,
      };
      try {
        let response = await this.$axios(
          `/user/set-password/${this.$route.query.code}`,
          {
            method: "POST",
            data,
          }
        );
        this.sendToast("success", response.data.message, 3000);
        this.$router.push("/login");
      } catch (err) {
        if (err.response) {
          this.sendToast("error", err.response.message, 3000);
        } else if (err.request) {
          this.sendToast("error", err.request.message, 3000);
        }
      }
    },
  },
};
</script>

<style scoped>
</style>