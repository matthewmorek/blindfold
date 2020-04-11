<template>
  <div v-if="updateExists" class="snackbar" @click="$emit('update-app')">
    <slot>New update available. Tap to upgrade.</slot>
  </div>
</template>

<script>
export default {
  props: {
    updateExists: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>

<style lang="postcss">
.snackbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--bg-positive);
  color: var(--text-positive);
  text-align: center;
  font-size: var(--text-size-sm);
  font-weight: bold;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.11), 0 2px 4px 0 rgba(0, 0, 0, 0.11),
    0 4px 8px 0 rgba(0, 0, 0, 0.11), 0 6px 12px 0 rgba(0, 0, 0, 0.11),
    0 8px 16px 0 rgba(0, 0, 0, 0.11);
  cursor: default;
}
</style>
