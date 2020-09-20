<template>
  <div class="app-container">
    <header v-if="hasHeaderSlot" class="app-header">
      <slot name="header" />
    </header>

    <main v-if="hasDefaultSlot" class="app-main">
      <slot name="default" />
    </main>

    <footer v-if="hasFooterSlot" class="app-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script>
export default {
  computed: {
    hasHeaderSlot: function () {
      return !!this.$slots.header;
    },
    hasDefaultSlot: function () {
      return !!this.$slots.default;
    },
    hasFooterSlot: function () {
      return !!this.$slots.footer;
    },
  },
  created() {
    // This is a fix for having a consistent `vh` units
    // Ref: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  },
};
</script>

<style lang="postcss">
.app-container {
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  width: 100vw;
  max-width: 28em;
  margin: 0 auto;
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-rows: max-content 1fr max-content;
}

.app-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  grid-area: header;
  padding: 0.5rem;
}

.app-main {
  display: flex;
  grid-area: main;
  flex-direction: column;
  padding: 1rem;
}

.app-footer {
  grid-area: footer;
  margin-top: auto;
  padding: 1rem;

  > .app-notice {
    margin-top: 1.5rem;
  }
}
</style>
