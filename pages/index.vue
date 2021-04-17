<template>
  <div>
    <v-row d-flex class="flex-wrap justify-space-around-center">
      <v-col class="col-6 col-md-4 col-lg-4 text-center">
        <v-hover v-slot="{ hover }">
          <v-card :elevation="hover ? 12 : 2" class="dash-item">
            <v-card-title class="justify-center text-h3 primary--text">{{
              clients.length.toLocaleString('en')
            }}</v-card-title>
            <v-divider></v-divider>
            <v-card-actions class="caption justify-center"
              >Total Clients</v-card-actions
            >
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="col-6 col-md-4 col-lg-4 text-center">
        <v-hover v-slot="{ hover }">
          <v-card :elevation="hover ? 12 : 2" class="dash-item">
            <v-card-title class="justify-center text-h3 blue--text">{{
              walkInClients.length
            }}</v-card-title>
            <v-divider></v-divider>
            <v-card-actions class="caption justify-center"
              >Walk-In Clients</v-card-actions
            >
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="col-6 col-md-4 col-lg-4 text-center">
        <v-hover v-slot="{ hover }">
          <v-card :elevation="hover ? 12 : 2" class="dash-item">
            <v-card-title class="justify-center text-h3 secondary--text"
              >50</v-card-title
            >
            <v-divider></v-divider>
            <v-card-actions class="caption justify-center"
              >Total Seen</v-card-actions
            >
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="col-6 col-md-4 col-lg-4 text-center">
        <v-hover v-slot="{ hover }">
          <v-card :elevation="hover ? 12 : 2" class="dash-item">
            <v-card-title class="justify-center text-h3 warning--text"
              >50</v-card-title
            >
            <v-divider></v-divider>
            <v-card-actions class="caption justify-center"
              >All Jobs</v-card-actions
            >
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="col-6 col-md-4 col-lg-4 text-center">
        <v-hover v-slot="{ hover }">
          <v-card :elevation="hover ? 12 : 2" class="dash-item">
            <v-card-title class="justify-center text-h3 indigo--text"
              >50</v-card-title
            >
            <v-divider></v-divider>
            <v-card-actions class="caption justify-center"
              >Ongoing Jobs</v-card-actions
            >
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="col-6 col-md-4 col-lg-4 text-center">
        <v-hover v-slot="{ hover }">
          <v-card :elevation="hover ? 12 : 2" class="dash-item">
            <v-card-title class="justify-center text-h3 green--text"
              >50</v-card-title
            >
            <v-divider></v-divider>
            <v-card-actions class="caption justify-center"
              >Pending Jobs</v-card-actions
            >
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-row d-flex class="justify-space-around-center mt-2">
      <v-col>
        <v-card class="dash-item">
          <v-card-title class="text-body-1 primary--text"
            >Appointments</v-card-title
          >
          <div>
            <v-row
              class="accent darken-1 text-body-2 justify-space-around-center my-auto mx-auto"
            >
              <v-col class="col-5 col-md-4 col-sm-3">Name</v-col>
              <v-col>Time</v-col>
              <v-col>Assigned</v-col>
              <v-col class="text-center">Actions</v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row
              class="justify-space-around-center my-auto mx-auto table-item"
            >
              <v-col class="text-body-2 col-5 col-md-4 col-sm-3"
                >Adeyanju Samuel</v-col
              >
              <v-col class="text-body-2">27th Dec. 2021 - 12:30pm </v-col>
              <v-col class="text-body-2">Ujunwa</v-col>
              <v-col class="text-body-2 text-center"
                ><v-icon>mdi-pencil</v-icon></v-col
              >
            </v-row>
            <v-divider></v-divider>
            <v-row
              class="justify-space-around-center my-auto mx-auto table-item"
            >
              <v-col class="text-body-2 col-5 col-md-4 col-sm-3"
                >Adeyanju Samuel</v-col
              >
              <v-col class="text-body-2">27th Dec. 2021 - 12:30pm </v-col>
              <v-col class="text-body-2">Ujunwa</v-col>
              <v-col class="text-body-2 text-center"
                ><v-icon>mdi-pencil</v-icon></v-col
              >
            </v-row>
            <v-divider></v-divider>
          </div>
          <v-card-actions class="mt-5"> </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row d-flex class="justify-space-around-center mt-2">
      <v-col>
        <v-card class="dash-item">
          <v-card-title class="text-body-1 primary--text"
            >Messages</v-card-title
          >
          <div>
            <v-row
              class="accent darken-1 text-body-2 justify-space-around-center my-auto mx-auto"
            >
              <v-col class="col-5 col-md-4 col-sm-3">Name</v-col>
              <v-col>Time</v-col>
              <v-col>Assigned</v-col>
              <v-col class="text-center">Actions</v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row
              class="justify-space-around-center my-auto mx-auto table-item"
            >
              <v-col class="col-5 col-md-4 col-sm-3">Adeyanju Samuel</v-col>
              <v-col>27th Dec. 2021 - 12:30pm </v-col>
              <v-col>Ujunwa</v-col>
              <v-col class="text-center"><v-icon>mdi-pencil</v-icon></v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row
              class="justify-space-around-center my-auto mx-auto table-item"
            >
              <v-col class="col-5 col-md-4 col-sm-3">Adeyanju Samuel</v-col>
              <v-col>27th Dec. 2021 - 12:30pm </v-col>
              <v-col>Ujunwa</v-col>
              <v-col class="text-center"><v-icon>mdi-pencil</v-icon></v-col>
            </v-row>
            <v-divider></v-divider>
          </div>
          <v-card-actions class="mt-5"> </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";

export default {
  name: "Dashboard",
  data: () => {
    return {
      page_title: "Dashboard"
    };
  },
  components: {
    Logo,
    VuetifyLogo
  },

  computed: {
    clients() {
      return this.$store.state.clients.filter(
        d =>
          d.Branch == this.$store.state.branch.Name &&
          !d.Code?.includes("walk")
      );
    },
    walkInClients() {
      return this.$store.state.clients.filter(
        d => d.Branch == this.$store.state.branch.Name && d.Code?.includes("walk")  
      );
    }
  }
};
</script>

<style scoped>
.table-item:hover {
  background-color: rgba(156, 156, 156, 0.294);
}

.dash-item {
  border-radius: 15px;
}
</style>
