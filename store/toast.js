export const state = () => ({
  snackbars: []
});

export const mutations = {
  addSnackbar: (state, payload) => {
    state.snackbars.push(payload);
  },
  resetSnackbars: (state, payload) => {
    state.snackbars = [];
  },
  closeSnackbar: (state, index) => {
    state.snackbars.splice(index, 1);
  }
};

export const actions = {
  callAddSnackbar: (context, payload) => {
    context.commit("addSnackbar", payload);
  },
  callCloseSnackbar: (context, payload) => {
    context.commit("closeSnackbar", payload);
  }
};
