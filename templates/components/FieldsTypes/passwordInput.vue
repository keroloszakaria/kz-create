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
    <div class="flex items-center justify-between">
      <div
        v-if="label"
        :class="{
          '!w-full !max-w-full': mode === 'vertical'
        }"
        class="field-label"
      >
        {{ label }}
      </div>
      <div v-if="isHint" class="hint-container">
        <span class="hint">
          <!-- <SvgIcon name="hint" size="xs" :transform="false" max-width="12px"></SvgIcon> -->
        </span>

        <div class="hint-message" v-html="hintMessage"></div>
      </div>
    </div>

    <span class="d-none">{{ showPassword }}</span>
    <v-text-field
      :class="{ '!w-full': mode === 'vertical' }"
      hide-details="auto"
      outlined
      v-model="modelValue"
      :placeholder="placeholder"
      :type="showPassword ? 'text' : 'password'"
      persistent-hint
      :required="required"
      :rules="rules"
      dense
      :autocomplete="autocomplete"
    >
      <template v-if="icon" #prepend-inner>
        <v-icon v-if="icon.startsWith('mdi-')" :icon="icon"></v-icon>
        <span v-else class="icon" v-html="icon"></span>
      </template>
      <template v-if="switchPassword" v-slot:append-inner>
        <v-icon v-if="showPassword" color="primary" @click="togglePasswordVisibility">
          mdi-eye-off-outline
        </v-icon>
        <v-icon v-else color="primary" @click="togglePasswordVisibility"> mdi-eye-outline </v-icon>
      </template>
    </v-text-field>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Define the model with String type
const modelValue = defineModel({
  type: String,
  default: ''
})

const props = defineProps({
  classList: { type: String, default: '' },
  mode: { type: String, default: 'horizontal' },
  inputStyle: String,
  label: String,
  placeholder: String,
  icon: String,
  switchPassword: Boolean,
  required: Boolean,
  disabled: Boolean,
  isHint: Boolean,
  hintMessage: String,
  autocomplete: String,
  rules: Array
})

const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped lang="scss">
.hint-container {
  position: relative;
  .hint {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #bbb;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #bbb;
    &:hover {
      + .hint-message {
        opacity: 1;
        display: block;
      }
    }
  }
  .hint-message {
    position: absolute;
    display: none;
    opacity: 0;
    top: 100%;
    left: 0;
    margin-top: 5px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    z-index: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    max-width: 350px;
    width: max-content;
    font-size: 12px;
    color: #333;
    transition: opacity 0.3s ease;
  }
}
</style>
