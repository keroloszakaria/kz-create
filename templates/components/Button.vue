<template>
  <div>
    <v-tooltip :location="location" :text="title" v-if="isTooltip">
      <template v-slot:activator="{ props }">
        <v-btn
          :color="type"
          :loading="isLoading"
          :type="action"
          :class="type"
          :disabled="disabled"
          v-bind="props"
          @click="handleClick"
        >
          <span v-html="icon"></span>
        </v-btn>
      </template>
    </v-tooltip>

    <v-btn
      v-if="title != '' && !isTooltip"
      :color="type"
      v-bind="$attrs"
      :loading="isLoading"
      :type="action"
      :class="type"
      :disabled="disabled"
      @click="handleClick"
    >
      <span v-if="icon && iconPosition == 'right'" v-html="icon"></span>
      <p>{{ title }}</p>
      <span v-if="icon && iconPosition == 'left'" v-html="icon"></span>
      <span v-if="isDropdown" v-html="icons.chevronDown"></span>
    </v-btn>
    <v-btn
      v-else-if="title == '' && !isTooltip"
      :loading="isLoading"
      :color="type"
      :type="action"
      v-bind="$attrs"
      :disabled="disabled"
      :class="type"
      @click="handleClick"
      class="font-weight-bold"
    >
      <span v-html="icon"></span>
      <slot name="content"></slot>
      <span v-if="isDropdown" v-html="icons.chevronDown"></span>
    </v-btn>
  </div>
</template>
<script setup>
const emit = defineEmits(['click'])

const handleClick = (event) => emit('click', event)

defineProps({
  isTooltip: { type: Boolean, default: false },
  location: { type: String, default: () => 'top' },
  title: { type: String, default: () => '' },
  iconPosition: {
    type: String,
    default: () => 'left',
    validator(value) {
      return ['left', 'right'].includes(value)
    }
  },
  type: {
    type: String,
    default: 'primary'
    // validator(value) {
    //   return [
    //     'primary',
    //     'danger',
    //     'warning',
    //     'close',
    //     'outline',
    //     'dark',
    //     'teleport',
    //     'primary-outline',
    //     'icon-only',
    //     'sidebar',
    //     'hidden',
    //     'no-bg',
    //     'table-icon',
    //     'filter-btn'
    //   ].includes(value)
    // }
  },
  isLoading: { type: Boolean, default: false },
  isDropdown: { type: Boolean, default: false },
  action: { type: String, default: () => 'button' },
  disabled: { type: Boolean, default: false },
  icon: { type: [String, Object] }
})
</script>

<style lang="scss" scoped>
.v-btn {
  padding: 8px 18px;
  box-shadow: none;
  border-radius: 12px;
  height: 42px;
  font-weight: 500;
  font-size: 16px;
  line-height: 160%;
  text-transform: none;
  min-width: unset;
  :deep() {
    .v-btn__content {
      gap: inherit;
      line-height: 0;
    }
  }

  :deep(.v-btn__content:has(svg)) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  &.table-icon {
    padding: 7px;
    border-radius: 8px;
    height: 36px;
    width: 36px;
    box-shadow: none;
    min-width: unset;
    :deep() {
      svg {
        width: 20px;
        height: 20px;
      }
    }
    &.restore {
      border: 1px solid #e5dfff;
      color: rgba(var(--v-theme-primary), 1);
    }

    &.edit {
      border: 1px solid #e5dfff;
      color: rgba(var(--v-theme-primary), 1);
    }

    &.view {
      border: 1px solid #cae8f4;
      color: rgba(var(--v-theme-primary), 1);
    }

    &.delete {
      border: 1px solid #fecdca;
      color: rgba(var(--v-theme-error), 1);
    }

    &.cancel {
      border: 1px solid #fecdca;
      color: rgba(var(--v-theme-error), 1);
    }
  }
  &.primary-outline {
    background-color: transparent !important;
    color: rgba(var(--v-theme-primary), 1) !important;
    border: 2px solid rgba(var(--v-theme-primary), 1);
    transition: 0.4s;

    &:hover {
      border: 2px solid rgba(var(--v-theme-primary), 1);
      color: rgba(var(--v-theme-dark_white_dafault), 1) !important;
      background-color: rgba(var(--v-theme-primary), 1) !important;
    }
  }

  &.primary {
    border: 2px solid rgba(var(--v-theme-primary), 1);
    background-color: rgba(var(--v-theme-primary), 1) !important;
    color: rgba(var(--v-theme-dark_white), 1) !important;
    transition: 0.4s;
    &:hover {
      background-color: rgba(var(--v-theme-primary_600), 1) !important;
    }
    &:disabled {
      background-color: rgba(var(--v-theme-primary), 1) !important;
      color: rgba(var(--v-theme-dark_white), 1) !important;
      border: none !important;
      opacity: 0.5;
    }
  }

  &.danger {
    background-color: rgba(var(--v-theme-danger_50), 1) !important;
    color: rgba(var(--v-theme-danger_600), 1) !important;
  }

  &.close {
    background-color: rgba(var(--v-theme-dark_75), 1);
    border: 2px solid rgba(var(--v-theme-dark_75), 1);
    color: rgba(var(--v-theme-dark_75_text), 1);
  }

  &.bg-icon-only {
    width: 16px;
    padding: 0 !important;
    color: rgba(var(--v-theme-dark_100_text), 1);
    background-color: transparent !important;
  }

  &.outline {
    border: 1px solid var(--Colors-Border-border-disabled, #d0d5dd);
  }

  &.dark {
    background-color: #11044c !important;
    color: #fff;
  }
  &.light_grey {
    background-color: #fafafa !important;
  }
  &.sidebar {
    background-color: rgba(var(--v-theme-dark_white), 1) !important;
  }
  &.no-bg {
    background-color: transparent !important;
    border: unset !important;
    color: rgba(var(--v-theme-dark_400), 1) !important;
    height: 32px !important;
    font-weight: bold !important;
  }
  &.filter-btn {
    background-color: rgba(var(--v-theme-dark_white), 1) !important;
    border: 1px solid #f0f4fa !important;
    color: #47586e !important;
    height: 42px !important;
    font-size: 12px !important;
    width: fit-content !important;
    padding: 10px;
    &:hover {
      border: 1px solid rgba(var(--v-theme-primary), 1);
    }
  }
  &.hidden {
    display: none;
  }
  &.remove-row {
    margin-top: 2.6rem !important;
    height: 58px;
    width: 58px;
    padding: 0;
    :deep(svg) {
      width: 0.8rem;
      height: 0.8rem;
    }
  }
  &.teleport {
    height: 42px;
    border-radius: 14px;
    min-width: 160px;
  }
}

@media (max-width: 600px) {
  .v-btn {
    padding: 10px 16px;
  }
}
</style>
