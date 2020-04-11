<template>
  <button
    :disabled="isLoading"
    :class="[
      'btn',
      { 'btn-flat': isLoading },
      { 'btn-cta': isPrimary },
      btnState
    ]"
    :aria-label="btnLabel"
    @click="btnClick"
  >
    <transition name="flip" mode="out-in">
      <bouncing-balls v-if="btnState === 'working'" />
      <icon-done v-if="btnState === 'complete'" class="icon" />
      <span v-if="btnState === 'error'" class="label">Oops! Try again</span>
      <span v-if="btnState === 'default'" class="label"
        ><slot>{{ btnLabel }}</slot></span
      >
    </transition>
  </button>
</template>

<script>
import BouncingBalls from '@/components/BouncingBalls';
import IconDone from '@/public/done-icon.svg';
export default {
  name: 'AppButton',
  components: {
    BouncingBalls,
    IconDone
  },
  props: {
    btnLabel: {
      type: String,
      required: false,
      default: 'Button'
    },
    isLoading: {
      type: Boolean,
      required: true
    },
    eventType: {
      type: String,
      required: false,
      default: 'default'
    },
    isPrimary: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      btnState: 'default'
    };
  },
  methods: {
    btnClick: async function() {
      try {
        // Change global state to lock controls
        this.$wait.start(this.eventType);
        // Change local button state
        this.btnState = 'working';
        // Dispatch event
        await this.$store.dispatch(this.eventType);
        // Change local button state
        this.btnState = 'complete';
      } catch (error) {
        this.btnState = 'error';
      } finally {
        // Simple `wait` Promise
        const wait = time => new Promise(resolve => setTimeout(resolve, time));

        // Wait a little to preserve visual feedback
        wait(2500).then(() => {
          this.$wait.end(this.eventType);
          this.btnState = 'default';
        });
      }
    }
  }
};
</script>

<style lang="postcss">
.btn {
  --transition-time: 0.2s;
  --transition-easing: ease-out;
  display: inline-block;
  appearance: none;
  background-color: var(--btn-bg);
  border: 1px solid var(--btn-border);
  border-radius: 4rem;
  color: var(--btn-text);
  font-size: 1.125rem;
  font-weight: 700;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  font-family: var(--font-family);
  width: 100%;
  height: 3.125rem;
  text-decoration: none;
  text-align: center;
  transition: border-color var(--transition-time) var(--transition-easing),
    background-color var(--transition-time) var(--transition-easing);

  &:disabled {
    background-color: var(--btn-bg--disabled);
    border-color: var(--btn-border--disabled);
    color: var(--btn-text--disabled);
  }

  &-cta {
    background-color: var(--btn-primary-bg);
    border-color: var(--btn-primary-border);
    color: var(--btn-primary-text);

    &::active {
      box-shadow: none;
    }

    &:disabled {
      background-color: var(--btn-bg--disabled);
      border-color: var(--btn-border--disabled);
      color: var(--btn-text--disabled);
    }
  }

  &-regular {
    width: auto;
  }

  &-small {
    font-size: 0.875rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    height: auto;
  }

  &.error {
    background-color: var(--bg-negative);
    color: var(--text-negative);
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  .label {
    display: inline-block;
  }

  .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
  }
}

.btn-flat > .double-bounce1,
.btn-cta > .double-bounce2 {
  background-color: var(--color-accent);
}

.flip-enter-active {
  perspective: 1000px;
  animation: flipIn 0.75s;
}

@keyframes flipIn {
  0% {
    transform: rotateX(90deg);
  }

  40% {
    transform: rotateX(-10deg);
  }

  70% {
    transform: rotateX(10deg);
  }

  100% {
    transform: rotateX(0deg);
  }
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
