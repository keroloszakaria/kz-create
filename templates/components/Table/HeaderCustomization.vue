<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
    <template v-slot:activator="{ props }">
      <Button
        iconPosition="right"
        v-bind="props"
        :icon="icons.grid"
        type="filter-btn "
        :isDropdown="true"
      />
    </template>

    <v-card width="267" v-click-outside="cancelCustomization">
      <v-card-title class="headline grey lighten-2 mt-2">
        <div class="flex justify-between align-center gap-2">
          <h4 class="!font-[500] text-[16px] text-text_dark_bg">
            {{ $t("columns_show") }}
          </h4>
          <Button
            type="close !px-[8px] !py-[4px] !h-[32px] !text-[14px]"
            :icon="icons.reset"
            iconPosition="right"
            @click="resetPreferences"
            :title="$t('reset')"
          />
        </div>
      </v-card-title>

      <GenericForm
        :schema="schema"
        :emitOnChange="true"
        @updateSchema="updateSchema"
      />
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, watch } from "vue";
import { icons } from "@/plugins/icons";
import { createCheckBoxField } from "@/utils/fieldUtils";
import GenericForm from "@/components/common/GenericForm/index.vue";
import {
  transformSchemaToObject,
  updateSchemaValues,
} from "@/utils/formDataHandler";

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  tableName: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["updateHeaders"]);

const menu = ref(false);
const visibleHeaders = ref([]);
const schema = ref([]);

const cancelCustomization = () => {
  menu.value = false;
  loadPreferences();
};

const resetPreferences = () => {
  const savedPreferences =
    JSON.parse(localStorage.getItem("tablePreferences")) || {};
  delete savedPreferences[props.tableName];
  localStorage.setItem("tablePreferences", JSON.stringify(savedPreferences));
  visibleHeaders.value = props.headers;
  emit("updateHeaders", props.headers);
};
const loadPreferences = () => {
  const savedPreferences =
    JSON.parse(localStorage.getItem("tablePreferences")) || {};
  const savedHeaders = savedPreferences[props.tableName];
  if (savedHeaders) {
    visibleHeaders.value = savedHeaders;
    emitUpdatedHeaders();
  }
};

const emitUpdatedHeaders = () => {
  const filteredHeaders = props.headers.filter(
    (header) => visibleHeaders.value[header.key]
  );
  emit("updateHeaders", filteredHeaders);
};

const generateSchema = () => {
  schema.value = props.headers.map((header) => {
    return createCheckBoxField({
      key: header.key,
      dynamicLabel: header.title,
      disabled: header?.disabled,
      value: header.disabled,
      trueValue: true,
      falseValue: false,
      cols: { sm: 12, md: 12, lg: 12 },
    });
  });
};

const updateSchema = (data) => {
  visibleHeaders.value = transformSchemaToObject(data);
  const savedPreferences =
    JSON.parse(localStorage.getItem("tablePreferences")) || {};
  savedPreferences[props.tableName] = visibleHeaders.value;
  localStorage.setItem("tablePreferences", JSON.stringify(savedPreferences));
  emitUpdatedHeaders();
};

watch(
  () => props.headers,
  async () => {
    generateSchema();
    loadPreferences();
    await updateSchemaValues(schema.value, visibleHeaders.value);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.v-card {
  box-shadow: 0px 16px 80px 0px #00000026 !important;
  background-color: #fff !important;
  padding: 1rem !important;
  border-radius: 24px !important;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  > div {
    padding: 0 !important;
    margin: 0 !important;
  }
}
:deep() {
  .v-form {
    width: calc(100% - 1rem);
    .v-row {
      > div {
        padding-block: 0.6rem;
      }
    }
  }
}
</style>
