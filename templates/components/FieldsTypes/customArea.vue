<template>
  <div class="field">
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <div class="field-label">{{ label }}</div>
          <div class="date" v-if="date">
            <img src="@/assets/images/svg/calendar-check.svg?url" alt="" />
            <span>{{ date }}</span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-textarea
            :id="id"
            hide-details="auto"
            v-model="innerValue"
            :placeholder="placeholder"
            :required="required"
            :rules="rules"
            dense
            variant="outlined"
            v-bind="$attrs"
            outlined
            :disabled="disabled"
            @keyup="emit('update:modelValue', innerValue)"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
defineProps({
  id: String,
  label: String,
  placeholder: String,
  required: Boolean,
  date: String,
  disabled: {
    type: Boolean,
    default: false
  },
  rules: Array
})
const emit = defineEmits(['update:modelValue'])
const innerValue = ref('')
</script>

<style lang="scss" scoped>
.v-expansion-panel {
  border: 1px solid rgba(var(--v-theme-on-dark_white), 1);
  background: #fafafa !important;
  border-radius: 12px;
  overflow: hidden;
}

.date {
  position: absolute;
  left: 1rem;

  display: flex;
  align-items: center;
  gap: 0.5rem;
  img {
    width: 20px;
    height: 20px;
  }
  span {
    font-weight: 500;
    color: #000000;
    font-size: 14px;
  }
}
:deep() {
  .v-expansion-panel-title {
    padding: 1rem !important;
    justify-content: flex-start;
  }
  .v-expansion-panel--active > .v-expansion-panel-title:not(.v-expansion-panel-title--static) {
    min-height: unset !important;
  }
  .v-expansion-panel-title__overlay {
    display: none;
  }
  .v-expansion-panel-text__wrapper {
    padding: 0 1rem 1rem !important;
  }
  .field-label {
    margin-bottom: 0 !important;
    padding-inline-start: 0 !important;
  }

  .v-expansion-panel-title__icon {
    width: 32px;
    height: 32px;
    border-radius: 12px;
    border: 1px solid rgba(var(--v-theme-on-dark_white), 1);
    background-color: #fff !important;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-inline-start: 8px;
  }
  .v-field {
    border: 1px solid rgba(var(--v-theme-dark_white), 1);
    background-color: #fff !important;
    textarea {
      height: 135px !important;
    }
  }
}
</style>
