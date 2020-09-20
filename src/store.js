import { version } from "../package.json";
import Vue from "vue";
import Vuex from "vuex";
import VueWait from "vue-wait";
import axios from "axios";
import VueAxios from "vue-axios";

axios.defaults.withCredentials = true;
Vue.use(Vuex);
Vue.use(VueWait);
Vue.use(VueAxios, axios);

const autosave = store => {
  store.subscribe((mutation, state) => {
    // Store the state object as a JSON string
    localStorage.setItem("store", JSON.stringify(state));
  });
};

export default new Vuex.Store({
  state: {
    user: null,
    version: ""
  },
  mutations: {
    init_store(state) {
      if (localStorage.getItem("store")) {
        let store = JSON.parse(localStorage.getItem("store"));
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
        .get("/api/profile")
        .then(({ data, status }) => {
          if (status !== 200) {
            commit("destroy_profile");
          } else {
            commit("store_profile", data.profile);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    silenceTheLambs() {
      return axios.post("/api/friends", { wantRetweets: false });
    },
    releaseTheKraken() {
      return axios.post("/api/friends", { wantRetweets: true });
    },
    signOut({ commit }) {
      return axios.post("/api/signout").then(() => {
        commit("destroy_profile");
      });
    }
  },
  getters: {
    user(state) {
      return state.user;
    }
  },
  plugins: [autosave],
  strict: process.env.NODE_ENV !== "production"
});
