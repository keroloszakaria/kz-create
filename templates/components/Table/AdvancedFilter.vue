<template>
  <div>
    <Button
      iconPosition="right"
      @click="isShowModal = true"
      :icon="icons.filter"
      type="filter-btn px-[16px]"
    />
    <Modal v-model="isShowModal" width="699" :title="$t('advanced_filter')">
      <template #content>
        <GenericForm id="myForm" :schema="schema" @submit="submitForm" />
      </template>
      <template #actions>
        <div class="flex gap-4 w-100">
          <Button
            class="w-50 flex-1"
            @click="closeModal()"
            :title="$t('cancel')"
            type="close w-100"
          />
          <Button
            :title="$t('search')"
            action="submit"
            type="primary w-100"
            form="myForm"
            class="w-50 flex-1"
          />
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Modal from '@/components/common/Modal.vue'
import GenericForm from '@/components/common/GenericForm/index.vue'
import Button from '@/components/common/Button.vue'
import { resetSchemaValues, transformSchemaToObject } from '@/utils/formDataHandler'

const props = defineProps({ schema: { type: Array, default: () => [] } })
const emit = defineEmits(['submit'])
const isShowModal = ref(false)

const submitForm = (data) => {
  const payload = transformSchemaToObject(data, true)
  emit('submit', payload)
  isShowModal.value = false
}

const closeModal = () => {
  isShowModal.value = false
  resetSchemaValues(props.schema)
  emit('submit')
}
</script>

<style scoped lang="scss"></style>
