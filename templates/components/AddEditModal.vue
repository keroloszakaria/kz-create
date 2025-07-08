<template>
  <Modal
    v-model="dialog"
    :title="title || ''"
    :isLoading="isLoading"
    :isDataLoaded="isDataLoaded"
    :width="width"
    :persistent="true"
  >
    <template #content>
      <GenericForm
        id="myForm"
        :class="customClass"
        :schema="schema"
        @submit="$emit('addEditRow', $event)"
      />
    </template>
    <template #actions>
      <slot v-if="customAction" name="actions"></slot>
      <div v-else class="flex flex-1">
        <div class="flex gap-4 w-100" v-if="!isView">
          <Button
            class="w-50 flex-1"
            @click="dialog = false"
            :title="$t('cancel')"
            type="close w-100"
          />
          <Button
            :isLoading="isAddLoading"
            :title="submitButton || (isCreate ? $t('add') : $t('edit'))"
            action="submit"
            type="primary w-100"
            form="myForm"
            class="w-50 flex-1"
          />
        </div>
        <div class="flex gap-4 w-100" v-else>
          <Button
            class="w-50 flex-1"
            :title="$t('edit_item')"
            @click="$emit('editRow')"
            type="close w-100"
          />
          <Button
            class="w-50 flex-1"
            @click="$emit('deleteRow')"
            :title="$t(deleteButton)"
            type="danger w-100"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import Modal from '@/components/common/Modal.vue'
import GenericForm from '@/components/common/GenericForm/index.vue'
import Button from '@/components/common/Button.vue'

const dialog = defineModel({ type: Boolean, default: false })

const emit = defineEmits(['addEditRow', 'editRow', 'deleteRow'])

const props = defineProps({
  isCreate: Boolean,
  isView: Boolean,
  isLoading: Boolean,
  isAddLoading: { type: Boolean, default: false },
  isDataLoaded: { type: Boolean, default: true },
  customAction: { type: Boolean, default: false },
  deleteButton: { type: String, default: 'delete' },
  schema: Array,
  customClass: String,
  submitButton: String,
  title: String,
  width: { type: String, default: '1000' }
})
</script>

<style lang="scss" scoped>
.content {
  :deep(.v-form) {
    display: flex;
    flex-direction: column;
    .v-row {
      flex: 1;
    }
  }
}
</style>
