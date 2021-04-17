const axios = require("axios");

export const state = () => ({
    drawer: false,
    clients: [],
    loading: false,
    branch: {
        "Key": "RXllbWFzdGVycyBMaW1pdGVkIC0gVXRha28sIEFidWph",
        "Name": "Utako, Abuja"
    },
})

export const mutations = {
    toggleDrawer(state) {
        state.drawer = !state.drawer;
        state.drawer = false;
    },

    async updateClients(state) {

      state.loading = true;

      state.clients = [];

      let clients = await axios(`/api/clients`, {
        method: "GET"
      })
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log(err);
        });

      // Send data to store

      state.clients = clients

      state.loading = false;
    },

    clearClients(state) {
        state.clients = [];
    },

    toggleLoading(state, payload) {
        state.loading = payload;
    },

    switchBranch(state, payload) {
        state.branch = payload;
    }
}