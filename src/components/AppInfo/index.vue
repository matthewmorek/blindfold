<template>
  <div class="app-info">
    <div class="app-info--icon">
      <AppIcon width="80%" class="icon" />
    </div>
    <h1 class="app-info--title">
      Blindfold
      <span class="app-info--subtitle">for Twitter</span>
    </h1>
    <p class="app-info--description">
      Turn off retweets.<br />
      Tune out the noise.
    </p>
  </div>
</template>

<script>
import AppIcon from "../../public/app-icon.svg";
export default {
  components: {
    AppIcon
  }
};
</script>

<style lang="postcss">
.app-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  &--icon {
    padding-left: 2rem;
    padding-right: 2rem;
    text-align: center;
  }

  &--title {
    /* text-transform: uppercase; */
    font-size: 3rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
    margin-top: -2rem;
    line-height: 1.25;
  }

  &--subtitle {
    display: block;
    font-size: 0.875rem;
    font-weight: 400;
    text-align: center;
  }

  &--description {
    font-size: 1.125rem;
    text-align: center;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
</style>
