<template>
  <v-dialog
    v-model="dialog"
    :persistent="persistent"
    :max-width="width"
    @afterLeave="$emit('afterLeave')"
  >
    <v-card>
      <div class="title" v-if="title">
        <v-card-title v-if="title">{{ title }}</v-card-title>
        <slot name="title" v-else></slot>
        <div class="close" @click="closeModal" v-html="icons.close" v-if="isCloseable"></div>
      </div>
      <div class="content">
        <Loading v-if="!isDataLoaded" />
        <slot v-else name="content"></slot>
      </div>
      <template v-slot:actions v-if="!customAction">
        <slot name="actions"></slot>
      </template>
      <div class="loader_wrap" v-if="isLoading">
        <div class="loading_spin"></div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Loading from '@/components/common/Loading.vue'
const dialog = defineModel({ type: Boolean, default: false })

const props = defineProps({
  width: [String, Number],
  isCloseable: { type: Boolean, default: true },
  title: { type: String, default: '' },
  persistent: { type: Boolean, default: true },
  customAction: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
  isDataLoaded: { type: Boolean, default: true }
})
const emit = defineEmits(['update:modelValue', 'afterLeave'])
const closeModal = () => (dialog.value = false)
</script>

<style lang="scss" scoped>
:deep() {
  .overlay__content {
    .v-card {
      border-radius: 24px !important;
      overflow: hidden !important;
    }
  }
  .v-card {
    margin: 1rem;
    border: 3px solid rgba(var(--v-theme-dark_white)) !important;
    background-color: rgba(var(--v-theme-dark_white)) !important;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    border-radius: 24px;
    color: rgba(var(--v-theme-dark_bg), 1);
    .v-card-title {
      font-weight: 600 !important;
      font-size: 1.125rem;
      padding: 0;
    }
  }
  .content {
    padding: 1.25rem;
    position: relative;
    height: 100%;
  }
  .v-card-actions {
    justify-content: flex-start !important;
    gap: 1rem;
    padding: 1.25rem;

    .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn) {
      margin-inline-start: 0 !important;
    }
  }

  .v-field__field {
    align-items: center;
  }
}

.close {
  width: 42px;
  height: 42px;
  background-color: rgba(var(--v-theme-dark_75), 1);
  border-radius: 6px;
  padding: 6px;
  top: 0px;
  right: 10px;
  cursor: pointer;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(var(--v-theme-dark_bg), 1);
  :deep() {
    svg {
      width: 10px;
      height: 10px;
    }
  }
}
</style>
