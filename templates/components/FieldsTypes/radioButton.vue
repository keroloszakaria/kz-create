<template>
  <div
    :class="[
      'field',
      {
        'required-field': required,
        '!flex-col !items-start': mode === 'vertical'
      },
      inputStyle,
      classList
    ]"
  >
    <div
      v-if="label"
      :class="{
        '!w-full !max-w-full': mode === 'vertical'
      }"
      class="field-label"
    >
      {{ label }}
    </div>
    <div v-if="inputStyle === 'viewMode' && !modelValue" class="text-dark_bg">
      {{ $t('no_found') }}
    </div>
    <v-radio-group
      v-else
      :class="{ '!w-full': mode === 'vertical' }"
      v-model="modelValue"
      :required="required"
      :disabled="disabled || inputStyle === 'viewMode'"
      hide-details="auto"
    >
      <v-radio
        v-for="option in options"
        :key="option.value"
        :disabled="disabled"
        :label="$t(option[itemTitle])"
        :value="option[itemValue]"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script setup>
const modelValue = defineModel({ type: [String, Number] })
const props = defineProps({
  classList: { type: String, default: '' },
  inputStyle: { type: String, default: '' },
  mode: { type: String, default: 'horizontal' },
  label: String,
  placeholder: String,
  disabled: Boolean,
  itemTitle: String,
  itemValue: String,
  options: Array,
  required: Boolean,
  rules: Array
})
</script>

<style lang="scss" scoped>
:deep(.v-label--clickable) {
  &::after {
    content: none !important;
  }
}
.v-radio-group {
  :deep(.v-input__control) {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    .v-label {
      flex: 1;
      margin-inline-start: 0 !important;
      margin-bottom: 0 !important;
      opacity: 1;
      color: rgba(var(--v-theme-text_600), 1) !important;
    }
    .v-selection-control-group {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      flex: 1;
    }
  }
}

:deep(.vertical) {
  .v-input__control {
    flex-direction: column !important;
    .v-label,
    .v-selection-control-group {
      width: 100%;
    }
    .v-selection-control-group {
      gap: 0.5rem;
    }
  }
}

.required-field {
  :deep(.v-selection-control) {
    flex: none;
    min-width: 100px;
  }
  :deep(.v-label) {
    position: relative;
    display: block;
    &::after {
      content: '*';
      color: rgba(var(--v-theme-error), 1);
      position: absolute;
      margin-inline-start: 4px;
      font-weight: 500;
      font-size: 1rem;
      width: 1px;
    }
  }
}
</style>
