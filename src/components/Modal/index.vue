<template>
  <transition name="fade">
    <div v-show="show" class="modal-backdrop">
      <transition name="slide">
        <div v-show="show" class="modal" @keyup.esc="$emit('close-modal')">
          <header class="modal--header">
            <span>
              <slot name="header">Modal header</slot>
            </span>
            <button class="btn-close-modal" @click="$emit('close-modal')">
              <CloseIcon width="24" height="24" class="icon" />
            </button>
          </header>
          <div class="modal--body" :class="bodyClass">
            <slot name="default">
              This is a modal content
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import CloseIcon from "../../public/close-icon.svg";
export default {
  components: {
    CloseIcon
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    bodyClass: {
      type: String,
      required: false,
      default: null
    }
  }
};
</script>

<style lang="postcss">
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;

  /* When backdrop-filter is supported */
  @supports (backdrop-filter: blur()) {
    background-color: var(--surface-primary-bg);
    -webkit-backdrop-filter: var(--surface-primary-blur);
    backdrop-filter: var(--surface-primary-blur);
  }
}

.modal {
  background-color: var(--surface-secondary-bg);
  position: absolute;
  bottom: -4rem;
  left: 0;
  right: 0;
  width: 100vw;
  border: 1px solid var(--header-color-border);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding-bottom: 4rem;
  max-width: 28em;
  margin: 0 auto;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.12),
    0 4px 8px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.12),
    0 16px 32px rgba(0, 0, 0, 0.12), 0 32px 64px rgba(0, 0, 0, 0.12);

  &--header {
    display: flex;
    line-height: 25px;
    justify-content: space-between;
    align-items: center;
    padding-left: 1.25rem;
    padding-right: 1.125rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--header-color-border);
    font-weight: 700;
    background-color: var(--surface-tertiary-bg);
    border-bottom: 1px solid var(--surface-tertiary-border);

    .btn-close-modal {
      .icon {
        display: block;
        fill: var(--icon);
      }
    }
  }

  &--body {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-top: 1rem;
    padding-bottom: 2rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.slide-enter,
.slide-leave-to {
  transform: translateY(100%);
}
</style>
