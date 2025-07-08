<template>
  <VForm @submit.prevent="onSubmit" ref="form">
    <!-- <v-btn
      class="absolute inset-2"
      color="secondary"
      variant="outlined"
      @click="fillSchemaWithTestData(schema)"
      prepend-icon="mdi-auto-fix"
      size="small"
    >
      Fill with Test Data
    </v-btn> -->
    <v-row :class="formClass">
      <template v-for="(field, fieldIndex) in schema" :key="fieldIndex">
        <FieldRenderer
          :field="field"
          :fieldIndex="fieldIndex"
          @update:value="
            (event, field, parent, index) => handleValueUpdate(event, field, parent, index)
          "
        >
          <template v-for="(_, name) in $slots" :key="name" v-slot:[name]="slotData">
            <slot :name="name" v-bind="slotData"></slot>
          </template>
        </FieldRenderer>
      </template>
    </v-row>
    <slot name="submit"></slot>
  </VForm>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import textInput from '@/components/common/FieldsTypes/textInput.vue'
import passwordInput from '@/components/common/FieldsTypes/passwordInput.vue'
import textArea from '@/components/common/FieldsTypes/textArea.vue'
import numberInput from '@/components/common/FieldsTypes/numberInput.vue'
import switchbox from '@/components/common/FieldsTypes/switchbox.vue'
import selectBox from '@/components/common/FieldsTypes/selectBox.vue'
import otp from '@/components/common/FieldsTypes/otp.vue'
import phone from '@/components/common/FieldsTypes/phone.vue'
import checkbox from '@/components/common/FieldsTypes/checkBox.vue'
import editor from '@/components/common/FieldsTypes/editor.vue'
import autoComplete from '@/components/common/FieldsTypes/autoComplete.vue'
import radioButton from '@/components/common/FieldsTypes/radioButton.vue'
import dateTimeInput from '@/components/common/FieldsTypes/dateTimeInput.vue'
import combobox from '@/components/common/FieldsTypes/combobox.vue'
import fileInput from '@/components/common/FieldsTypes/fileInput.vue'
import imageUploader from '@/components/common/FieldsTypes/imageUploader.vue'
import FieldRenderer from './FieldRenderer.vue'
import { fillSchemaWithTestData } from '@/utils/formTestData'
const emit = defineEmits(['submit', 'updateSchema'])
const props = defineProps({
  formClass: String,
  schema: { type: Object },
  propsToWatch: { type: Array },
  stopValidation: { type: Boolean, default: false },
  emitOnChange: { type: Boolean, default: false }
})

const getFieldComponent = (type) => {
  const components = {
    text: textInput,
    number: numberInput,
    password: passwordInput,
    textarea: textArea,
    switchbox: switchbox,
    select: selectBox,
    otp: otp,
    phone: phone,
    checkbox: checkbox,
    datetime: dateTimeInput,
    imageUploader: imageUploader,
    autoComplete: autoComplete,
    combobox: combobox,
    editor: editor,
    files: fileInput,
    radioButton: radioButton
  }
  return components[type] || 'div'
}
provide('getFieldComponent', getFieldComponent)
const form = ref(null)
const validate = async () => await form.value?.validate()

const handleValueUpdate = (event, field, parent = null, fieldIndex = null) => {
  if (field.updateValueHandler) field.updateValueHandler(event, field, parent, fieldIndex)
  if (props.emitOnChange) emit('updateSchema', props.schema)
}

const onSubmit = async () => {
  if (!props.stopValidation) {
    const { valid } = await validate()
    if (!valid) return
  }
  emit('submit', props.schema)
}

defineExpose({ validate, getFieldComponent })
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
