<template>
  <div class="app-notice">
    <div class="app-notice--text">
      <slot name="text" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="postcss">
.app-notice {
  display: flex;
  align-items: center;

  &--text {
    font-size: 0.875rem;
    text-align: center;
    color: var(--text-color);
  }
}
</style>
