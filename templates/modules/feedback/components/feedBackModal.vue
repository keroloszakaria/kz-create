<template>
  <div class="feedback">
    <Button
      type="primary"
      :icon="icons.feedback"
      @click="feedbackModal = true"
      :title="$t('your_feedback')"
    />
    <Modal v-model="feedbackModal" :width="600" :customAction="true">
      <template #content>
        <GenericForm :schema="schema" @submit="sendFeedback" ref="feedbackForm">
          <template #submit>
            <div class="flex gap-2 mt-5">
              <Button
                :title="$t('send')"
                action="submit"
                :isLoading="feedbackStore.isAddingLoading"
              />
              <Button
                :title="$t('discard')"
                type="close"
                @click="feedbackModal = false"
              />
            </div>
          </template>
        </GenericForm>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Modal from "@/components/common/Modal.vue";
import GenericForm from "@/components/common/GenericForm/index.vue";
import { transformSchemaToObject } from "@/utils/formDataHandler";
import { useFeedbackStore } from "../stores/index";
import { createTextField, createTextAreaField } from "@/utils/fieldUtils";

const feedbackStore = useFeedbackStore();
const feedbackModal = ref(false);
const feedbackForm = ref(null);

const schema = ref([
  createTextField({
    t,
    key: "email",
    label: "email",
    isEmail: true,
    cols: { md: 12, lg: 12 },
  }),
  createTextAreaField({
    t,
    key: "feedback",
    label: "note",
    required: true,
    cols: { md: 12, lg: 12 },
  }),
]);

const sendFeedback = async (data) => {
  const { valid } = await feedbackForm.value.validate();
  if (!valid) return;
  const form = transformSchemaToObject(data);
  const { code } = await feedbackStore.sendFeedback(form);
  if (code == 200) feedbackModal.value = false;
};
</script>

<style lang="scss" scoped>
.feedback {
  :deep(.v-btn) {
    margin-inline-start: 20px;
    padding: 10px 20px;
    height: 40px;
    font-weight: 500 !important;
    font-size: 14px !important;

    svg {
      width: 22px;
      height: 22px;
    }
  }
}
</style>
