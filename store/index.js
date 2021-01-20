import { Store } from "vuex";

export const state = {
    drawer: false
}

export const mutations = {
    toggleDrawer (state) {
        state.drawer = !state.drawer;
        state.drawer = false;
    }
}