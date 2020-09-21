<template>
  <span class="spinner">
    <span class="double-bounce1" />
    <span class="double-bounce2" />
  </span>
</template>

<script>
export default {};
</script>

<style lang="postcss">
.spinner {
  display: block;
  width: 1.5rem;
  height: 1.5rem;

  position: relative;
  margin: 0 auto;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--color-accent);
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  animation-delay: -1s;
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
}
</style>
