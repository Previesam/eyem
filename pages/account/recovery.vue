<template>
  <v-card width="500">
    <v-container fluid class="container">
      <div class="right-side py-10">
        <v-form v-model="valid" ref="loginForm">
          <v-card-title class="primary--text">Account Recovery</v-card-title>
          <v-card-text>Please provide your registered email to recover your account.</v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12"
                ><v-text-field
                  prepend-icon="mdi-email"
                  label="Registered Email"
                  v-model="email"
                  :rules="rules.email"
                  required
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
                    >Recover</v-btn
                  >
                  <v-spacer></v-spacer>
                  <nuxt-link to="/login">Back</nuxt-link>
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
  auth: false,
  data: () => {
    return {
      rules: {
        password: [
          value => !!value || "Password is required.",
          value => (value && value.length >= 6) || "Min 6 characters",
          value => (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(value) || "Password must container one letter, one number, one special character and aleast 6 digits long")
        ],
        email: [
            value => !!value || "Email is required",
            value => ( /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || 'E-mail must be valid' )
        ]
      },
      valid: false,
      email: "",
      password: ""
    };
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fill, 1fr);
  flex-wrap: wrap;
  overflow-x: scroll;
}


.rigth-side {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
