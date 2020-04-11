<template>
  <base-layout>
    <template #default>
      <app-info />
    </template>
    <template #footer>
      <div class="app-footer--cta">
        <a href="/auth" class="btn btn-cta">Sign in with Twitter</a>
      </div>
      <!-- prettier-ignore -->
      <app-notice>
        <template
          #text
        >This service is free. You will confirm your intention after signing in with Twitter.</template>
      </app-notice>
      <app-about @show-modal="$emit('show-modal')" />
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from '../BaseLayout';
import AppInfo from '../../components/AppInfo';
import AppNotice from '../../components/AppNotice';
import AppAbout from '../../components/AppAbout';

export default {
  components: {
    BaseLayout,
    AppInfo,
    AppNotice,
    AppAbout
  },
  props: {
    isLoading: {
      type: Boolean
    }
  }
};
</script>

<style lang="postcss">
.btn-cta {
  display: inline-block;
  text-align: center;
}
</style>
