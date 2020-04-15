<template>
  <base-layout>
    <template #header>
      <div class="app-header-wrapper">
        <div class="profile">
          <app-icon width="32" class="icon profile--app-icon" />
          <span class="profile--img"
            ><img
              :src="profile.photo"
              :alt="profile.displayName"
              class="app-header-photo"
              width="24"
          /></span>
          <span class="profile--label">{{ profile.displayName }}</span>
        </div>
        <button class="btn-mini" @click="$emit('sign-out')">Sign out</button>
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

  &--app-icon {
    padding-right: 0.5rem;
    border-right: 2px solid var(--btn-border--disabled);
  }

  &--label {
    font-size: 0.75rem;
  }

  &--img {
    display: block;
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    img {
      display: block;
      border-radius: 64px;
      overflow: hidden;
      width: 1.75rem;
      height: 1.75rem;
    }
  }
}

.btn-mini {
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  font-size: 0.875rem;
  padding: 0.25rem 0.65rem;
  border-radius: 64px;
  display: block;
  line-height: 1.5;
  font-family: var(--font-family);
}

.app-main {
  align-items: center;
  justify-content: center;
  text-align: center;
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
