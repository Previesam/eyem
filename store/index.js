export const state = () => ({
    drawer: false,
    clients: [],
    loading: false,
    branch: {
        "Key": "RXllbWFzdGVycyBMaW1pdGVkIC0gVXRha28sIEFidWph",
        "Name": "Eyemasters Limited - Utako, Abuja"
    },
})

export const mutations = {
    toggleDrawer(state) {
        state.drawer = !state.drawer;
        state.drawer = false;
    },

    updateClients(state, payload) {
        state.clients.push(payload);
    },

    clearClients(state) {
        state.clients = [];
    },

    toggleLoading(state, payload) {
        state.loading = payload;
    }
}