import { version } from '../package.json';
import Vue from 'vue';
import Vuex from 'vuex';
import VueWait from 'vue-wait';
import axios from 'axios';

// import bugsnagClient from './utilities/bugsnag';

Vue.use(Vuex);
Vue.use(VueWait);

const autosave = store => {
  store.subscribe((mutation, state) => {
    // Store the state object as a JSON string
    localStorage.setItem('store', JSON.stringify(state));
  });
};

export default new Vuex.Store({
  state: {
    user: null,
    version: ''
  },
  mutations: {
    init_store(state) {
      if (localStorage.getItem('store')) {
        let store = JSON.parse(localStorage.getItem('store'));
        // Check the version stored against current. If different, don't
        // load the cached version
        if (store.version == version) {
          this.replaceState(Object.assign(state, store));
        } else {
          state.version = version;
        }
      }
    },
    store_profile(state, data) {
      state.user = Object.assign({}, data);
    },
    destroy_profile(state) {
      state.user = null;
    },
    reset_wait(state) {
      state.wait.waitingFor = [];
    }
  },
  actions: {
    fetchProfile({ commit }) {
      return axios
        .get('/profile')
        .then(({ data }) => {
          commit('store_profile', data.profile);
        })
        .catch(error => {
          console.error(error);
        });
    },
    silenceTheLambs() {
      return axios.post('/friends', { wantRetweets: false });
    },
    releaseTheKraken() {
      return axios.post('/friends', { wantRetweets: true });
    },
    signOut({ commit }) {
      return axios.post('/signout').then(res => {
        commit('destroy_profile');
      });
    }
  },
  getters: {
    user(state) {
      return state.user;
    }
  },
  plugins: [autosave],
  strict: process.env.NODE_ENV !== 'production'
});
