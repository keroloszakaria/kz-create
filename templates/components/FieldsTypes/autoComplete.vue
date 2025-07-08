<template>
  <div
    class="field"
    :class="[
      {
        'required-field': required,
        '!flex-col !items-start': mode === 'vertical',
      },
      inputStyle,
      classList,
    ]"
  >
    <div
      v-if="label"
      :class="{
        '!w-full !max-w-full': mode === 'vertical',
      }"
      class="field-label"
    >
      {{ label }}
    </div>
    <div v-if="inputStyle === 'viewMode' && !modelValue" class="text-dark_bg">
      {{ $t("no_found") }}
    </div>
    <div v-else :class="{ '!w-full': mode === 'vertical' }" class="flex gap-2">
      <v-autocomplete
        variant="outlined"
        hide-details="auto"
        :return-object="returnObject"
        outlined
        v-model="modelValue"
        :items="options"
        :placeholder="placeholder"
        :chips="chips"
        :closable-chips="closableChips"
        :item-value="itemValue"
        :item-title="itemTitle"
        :multiple="multiple"
        :required="required"
        :rules="rules"
        :disabled="disabled || inputStyle === 'viewMode'"
        :loading="loading"
        :clearable="clearable"
        menu-icon="mdi-chevron-down"
        dense
      >
        <template v-if="customChips" v-slot:chip="{ props, item, index }">
          <v-chip
            v-if="index < 1"
            v-bind="props"
            :prepend-avatar="item.raw.avatar"
            :text="item.raw.name"
            closable
          ></v-chip>
          <v-chip v-if="index == 1">
            + {{ modelValue.length - 1 }}
            <v-tooltip
              scroll-strategy="block"
              :offset="-1"
              activator="parent"
              location="top"
            >
              <div class="d-flex flex-column ga-1">
                <p v-for="item in tooltipList" :key="item">
                  {{ item.title }}
                </p>
              </div>
            </v-tooltip>
          </v-chip>
        </template>
        <template v-else v-slot:item="{ props, item }">
          <v-list-item :class="itemClasses" v-bind="props">
            {{ item[itemTitle] }}
          </v-list-item>
        </template>
        <template #append-inner>
          <slot name="append"></slot>
        </template>
      </v-autocomplete>
    </div>
  </div>
</template>

<script setup>
import { watch, computed } from "vue";
const modelValue = defineModel({
  type: [String, Array, Number, Object, Boolean],
});

const props = defineProps({
  classList: String,
  label: String,
  options: { type: Array, default: [] },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  closableChips: { type: Boolean, default: true },
  returnObject: { type: Boolean, default: false },
  chips: { type: Boolean, default: true },
  customChips: { type: Boolean, default: false },
  itemValue: { type: String, default: "value" },
  inputStyle: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  multiple: Boolean,
  required: Boolean,
  placeholder: String,
  autoSelectFirst: Boolean,
  itemTitle: String,
  itemClasses: String,
  rules: Array,
  mode: String,
});

const tooltipList = computed(() => {
  if (!Array.isArray(modelValue.value)) return [];
  return props.options.filter((option) =>
    modelValue.value.includes(option.value)
  );
});

watch(
  () => props.options,
  (newVal) => {
    if (modelValue.value) return;
    if (props.autoSelectFirst && newVal && props.returnObject) {
      modelValue.value = newVal[0];
    } else if (props.autoSelectFirst && newVal && !props.returnObject) {
      modelValue.value = newVal[0][props.itemValue];
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
:deep() {
  .v-field {
    --v-field-input-padding-top: 0 !important;
    --v-field-input-padding-bottom: 0 !important;
  }
}
</style>
