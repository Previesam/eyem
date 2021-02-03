<template>
  <div>
    <v-row d-flex class="flex-wrap justify-space-around-center">
      <v-col class="col-6 col-md-4 col-lg-4 text-center">
        <v-card class="dash-item">
          <v-card-title class="justify-center text-h2 primary--text"
            >50</v-card-title
          >
          <v-divider></v-divider>
          <v-card-actions class="caption justify-center"
            >Appointments</v-card-actions
          >
        </v-card>
      </v-col>
      <v-col class="col-6 col-md-4 col-lg-4 text-center">
        <v-card class="dash-item">
          <v-card-title class="justify-center text-h2 blue--text"
            >50</v-card-title
          >
          <v-divider></v-divider>
          <v-card-actions class="caption justify-center">On Que</v-card-actions>
        </v-card>
      </v-col>
      <v-col class="col-6 col-md-4 col-lg-4 text-center">
        <v-card class="dash-item">
          <v-card-title class="justify-center text-h2 secondary--text"
            >50</v-card-title
          >
          <v-divider></v-divider>
          <v-card-actions class="caption justify-center"
            >Total Seen</v-card-actions
          >
        </v-card>
      </v-col>
      <v-col class="col-6 col-md-4 col-lg-4 text-center">
        <v-card class="dash-item">
          <v-card-title class="justify-center text-h2 warning--text"
            >50</v-card-title
          >
          <v-divider></v-divider>
          <v-card-actions class="caption justify-center"
            >All Jobs</v-card-actions
          >
        </v-card>
      </v-col>
      <v-col class="col-6 col-md-4 col-lg-4 text-center">
        <v-card class="dash-item">
          <v-card-title class="justify-center text-h2 indigo--text"
            >50</v-card-title
          >
          <v-divider></v-divider>
          <v-card-actions class="caption justify-center"
            >Ongoing Jobs</v-card-actions
          >
        </v-card>
      </v-col>
      <v-col class="col-6 col-md-4 col-lg-4 text-center">
        <v-card class="dash-item">
          <v-card-title class="justify-center text-h2 green--text"
            >50</v-card-title
          >
          <v-divider></v-divider>
          <v-card-actions class="caption justify-center"
            >Pending Jobs</v-card-actions
          >
        </v-card>
      </v-col>
    </v-row>

    <v-row d-flex class="justify-space-around-center mt-2">
      <v-col>
        <v-card class="dash-item">
          <v-card-subtitle>Appointments</v-card-subtitle>
          <v-card-text>
            <v-row class="justify-space-around-center my-auto mx-auto">
              <v-col class="text-body-1 col-5 col-md-4 col-sm-3">Name</v-col>
              <v-col class="text-body-1">Time</v-col>
              <v-col class="text-body-1">Assigned</v-col>
              <v-col class="text-body-1 text-center">Actions</v-col>
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
          </v-card-text>
          <v-card-actions class="mt-5"> </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row d-flex class="justify-space-around-center mt-2">
      <v-col>
        <v-card class="dash-item">
          <v-card-subtitle>Messages</v-card-subtitle>
          <v-card-text>
            <v-row class="justify-space-around-center my-auto mx-auto">
              <v-col class="text-body-1 col-5 col-md-4 col-sm-3">Name</v-col>
              <v-col class="text-body-1">Time</v-col>
              <v-col class="text-body-1">Assigned</v-col>
              <v-col class="text-body-1 text-center">Actions</v-col>
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
          </v-card-text>
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
      page_title: 'Dashboard'
    };
  },
  components: {
    Logo,
    VuetifyLogo,
  },
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
