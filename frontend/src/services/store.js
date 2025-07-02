import { createStore } from 'vuex';

const store = createStore({
  state: {
    isAuthenticated: false,
    user: null
  },
  mutations: {
    login(state, user) {
      state.isAuthenticated = true;
      state.user = user;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    }
  },
  actions: {
    login({ commit }, user) {
      commit('login', user);
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    user(state) {
      return state.user;
    }
  }
});

export default store;
