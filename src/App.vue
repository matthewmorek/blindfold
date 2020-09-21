<template>
  <div id="app">
    <AppWelcome
      v-if="!isAuthenticated"
      :is-loading="isLoading"
      @fetch-profile="fetchProfile"
      @show-modal="showModal"
    />
    <AppUser
      v-else
      :is-loading="isLoading"
      :profile="userProfile"
      @sign-out="signOut"
      @show-modal="showModal"
    />
    <AppUpdate :update-exists="updateExists" @update-app="refreshApp">
      New update available. Tap to upgrade.
    </AppUpdate>
    <!-- prettier-ignore -->
    <Modal
      :show="isVisible"
      @close-modal="hideModal"
    >
      <template #header>
        About
      </template>
      <template #default>
        <div class="about-box">
          <header class="about-box--header">
            <h2>Blindfold</h2>
          </header>
          <div class="about-box--content">
            A simple noise suppression system for Twitter built with <a href="https://vuejs.org">Vue.js</a>, <a href="https://expressjs.com">Express</a>, and <a href="https://postcss.org">modern CSS</a>.
          </div>
          <div class="section-cta">
            <a
              href="https://ko-fi.com/matthewmorek"
              class="btn btn-cta btn-regular"
            >Buy me a coffee ☕️</a>
          </div>
          <footer class="about-box--footer">
            <p>
              {{ `v${appVersion}` }} &copy; {{ currentYear }}
              <a
                href="https://matthewmorek.design"
              >Matthew Morek</a>
            </p>
          </footer>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import AppWelcome from "./layout/AppWelcome";
import AppUser from "./layout/AppUser";
import AppUpdate from "./components/AppUpdate";
import Modal from "./components/Modal";
import { version } from "../package.json";

import isEmpty from "lodash/fp/isEmpty";
// import AppIcon from './public/app-icon.svg';
import { getYear } from "date-fns";

export default {
  name: "Blindfold",
  components: {
    AppWelcome,
    AppUser,
    AppUpdate,
    Modal,
  },
  data() {
    return {
      hasErrors: false,
      error: null,
      now: new Date(),
      updateExists: false,
      worker: null,
      refreshing: false,
      isVisible: false,
      appVersion: version,
      currentYear: getYear(new Date()),
    };
  },
  computed: {
    isLoading: function () {
      return this.$wait.any;
    },
    isAuthenticated: function () {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    },
    userProfile: function () {
      return this.$store.getters.user;
    },
  },
  created() {
    // Listen for the updateReady event and update the local state accordingly
    document.addEventListener("updateReady", this.showRefreshUI, {
      once: true,
    });
    // Refresh all open app tabs when a new service worker is installed.
    navigator.serviceWorker &&
      navigator.serviceWorker.addEventListener(
        // triggered by registration.claim
        "controllerchange",
        () => {
          if (this.refreshing) return;
          this.refreshing = true;
          window.location.reload();
        }
      );
  },
  mounted() {
    this.$store.commit("reset_wait");
    this.fetchProfile();
  },
  beforeDestroy() {
    document.removeEventListener("updateReady", this.showRefreshUI);
  },
  methods: {
    isEmpty,
    getYear,
    getData: ({ data }) => data,
    fetchProfile: async function () {
      try {
        this.$wait.start("fetchProfile");
        await this.$store.dispatch("fetchProfile");
      } catch (error) {
        alert(error);
      } finally {
        this.$wait.end("fetchProfile");
      }
    },
    signOut: async function (eventType) {
      try {
        this.$wait.start(eventType);
        await this.$store.dispatch("signOut");
      } catch (error) {
        alert(error);
      } finally {
        this.$wait.end(eventType);
      }
    },
    showRefreshUI(event) {
      // Display a button inviting the user to refresh/reload the app due
      // to an app update being available.
      // The new service worker is installed, but not yet active.
      // Store the ServiceWorkerRegistration instance for later use.
      if (event.detail) {
        this.worker = event.detail;
        this.updateExists = true;
      }
    },
    refreshApp() {
      // Handle a user tap on the update app button.
      this.updateExists = false;
      // Protect against missing registration.waiting.
      if (!this.worker) {
        return;
      }
      this.worker.postMessage({ type: "SKIP_WAITING" });
    },
    hideModal() {
      this.isVisible = false;
    },
    showModal() {
      this.isVisible = true;
    },
  },
};
</script>

<style lang="postcss">
@import "./styles/global";

.icon {
  fill: var(--icon);
}

.about-box {
  padding-bottom: 1.5rem;
  text-align: center;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.875rem;
  }

  &--header {
    margin-bottom: 1rem;
  }

  &--content {
    margin-bottom: 2rem;
  }

  &--footer {
    margin-top: 2rem;
  }

  .section-cta {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;

    .btn-cta {
      font-size: 1rem;
    }
  }
}
</style>
