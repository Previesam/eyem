export const state = () => ({
  type: "",
  snackbar: false,
  timeout: 2000,
  message: "Samuel"
});

export const mutations = {
  showSnackbar: (state, payload) => {
    state.message = payload.message;
    state.type = payload.type;
    if (payload.timeout) {
      state.timeout = payload.timeout;
    }
    state.snackbar = true;
  },
  closeSnackbar: state => {
    state.snackbar = false;
  }
};

export const actions = {
  snackbar: (context, payload) => {
    context.commit("showSnackbar", payload);
  }
};
