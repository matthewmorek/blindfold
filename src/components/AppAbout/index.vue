<template>
  <div class="app-about">
    <div>Made in MCR 🐝</div>
    <button class="btn-pill" @click="$emit('show-modal')">
      <InfoIcon width="32" height="32" class="icon btn-pill-icon" /><span
        class="btn-pill-label"
        >Meta</span
      >
    </button>
  </div>
</template>

<script>
import InfoIcon from "../../public/info-icon.svg";
export default {
  components: {
    InfoIcon
  }
};
</script>

<style lang="postcss">
.app-about {
  text-align: center;
  padding-top: 1rem;
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-color-dimmed);
  margin-bottom: 1.5rem;

  .btn-pill {
    display: flex;
    padding: 0;
    background-color: var(--btn-pill-bg);
    border-radius: 64px;
    align-content: center;
    align-items: center;
    font-size: 0.875rem;
    color: var(--btn-pill-text);

    .btn-pill-icon {
      display: inline-block;
      fill: var(--btn-pill-text);
    }

    .btn-pill-label {
      margin-right: 0.75rem;
    }
  }
}
</style>
