<template>
  <base-layout>
    <template #header>
      <div class="app-header-wrapper">
        <app-icon width="32" class="icon" />
        <div class="profile">
          <span class="profile--label">{{ profile.displayName }}</span>
          <span class="profile--img"
            ><img
              :src="profile.photo"
              :alt="profile.displayName"
              class="app-header-photo"
              width="24"
          /></span>
        </div>
      </div>
    </template>
    <template #default>
      <div class="app-content">
        <h1 class="heading">Tailor your Twitter feed</h1>
        <div class="actions">
          <app-button
            event-type="silenceTheLambs"
            :is-loading="isLoading"
            is-primary
            >Hide retweets</app-button
          >
          <p class="spacer">or</p>
          <app-button :is-loading="isLoading" event-type="releaseTheKraken"
            >Show retweets</app-button
          >
        </div>
        <p>
          Using this tool will only affect retweets. <br />You will still see
          promoted tweets, quote tweets and cards.
        </p>
      </div>
    </template>
    <template #footer>
      <app-about @show-modal="$emit('show-modal')" />
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from '@/layout/BaseLayout';
import AppButton from '@/components/AppButton';
import AppAbout from '@/components/AppAbout';
import AppIcon from '@/public/app-icon.svg';

export default {
  components: {
    BaseLayout,
    AppButton,
    AppAbout,
    AppIcon
  },
  props: {
    isLoading: {
      type: Boolean,
      required: true
    },
    profile: {
      type: Object,
      default: null
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  }
};
</script>

<style lang="postcss">
.app-header {
  background-color: var(--app-bg);
  box-shadow: var(--header-shadow);
}

.app-header-wrapper {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  .icon {
    margin-left: 0.25rem;
  }
}

.app-content {
  max-width: 20rem;
}

.profile {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &--label {
    font-size: 0.75rem;
  }

  &--img {
    display: block;
    margin-left: 0.5rem;

    img {
      display: block;
      border-radius: 64px;
      overflow: hidden;
      width: 1.75rem;
      height: 1.75rem;
    }
  }
}

.app-main {
  align-items: center;
  justify-content: center;
  text-align: center;
  /* padding-left: 4rem; */
  /* padding-right: 4rem; */
}

.heading {
  font-size: 1.65rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.actions {
  margin-top: 1rem;
  margin-bottom: 2rem;

  .btn {
    width: 16rem;
  }
}

.spacer {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.app-footer--cta {
  display: flex;
  justify-content: center;
}
</style>
