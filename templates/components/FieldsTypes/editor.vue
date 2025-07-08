<template>
  <div
    class="field"
    :class="[
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
    <div
      v-if="inputStyle !== 'viewMode'"
      :class="['rounded-[16px] px-4 py-2 bg-dark_white', { '!w-full': mode === 'vertical' }]"
    >
      <QuillEditor
        :class="direction"
        :required="required"
        :rules="rules"
        theme="snow"
        v-model:content="modelValue"
        :placeholder="placeholder ? $t(placeholder) : ''"
        contentType="html"
      />
    </div>
    <div v-else-if="inputStyle === 'viewMode' && isEmpty" class="text-dark_bg">
      {{ $t('no_found') }}
    </div>
    <div v-else class="text-start" v-html="modelValue"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const modelValue = defineModel()

const props = defineProps({
  classList: { type: String, default: '' },
  label: String,
  placeholder: String,
  required: Boolean,
  rules: Array,
  direction: String,
  mode: { type: String, default: 'horizontal' },
  inputStyle: { type: String, default: '' }
})

const isEmpty = computed(() => {
  if (!modelValue.value) return true
  if (typeof modelValue.value === 'string') return modelValue.value.trim() === ''
  if (Array.isArray(modelValue.value)) return modelValue.value.length === 0
  return false
})
</script>

<style lang="scss">
.ql-toolbar.ql-snow {
  border: none;
  border-bottom: 1px solid rgba(var(--v-theme-dark_100), 1);
  direction: ltr;
}

.ql-container.ql-snow {
  min-height: 5rem;
  border: none;
}

.rtl-styles .ql-snow .ql-picker-label {
  justify-content: flex-end;
}

.rtl-styles .ql-editor.ql-blank::before {
  left: auto;
}

.rtl * {
  text-align: right;
  direction: rtl;
}

.ql-editor.ql-blank::before {
  color: rgba(var(--v-theme-flowIconBorderColor), 1);
  font-style: normal;
  font-size: 0.95rem;
  font-weight: 400;
  right: 15px;
}

.rtl-styles .ql-editor {
  text-align: right;
}

.ql-snow.ql-toolbar button.ql-active,
.ql-snow .ql-toolbar button.ql-active,
.ql-snow.ql-toolbar .ql-picker-label.ql-active,
.ql-snow .ql-toolbar .ql-picker-label.ql-active,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected {
  background-color: rgba(var(--v-theme-dark_25), 1);
  color: rgba(var(--v-theme-primary), 1);
}

.ql-snow.ql-toolbar button.ql-active .ql-stroke,
.ql-snow .ql-toolbar button.ql-active .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
.ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
  stroke: rgba(var(--v-theme-primary), 1);
}
</style>
