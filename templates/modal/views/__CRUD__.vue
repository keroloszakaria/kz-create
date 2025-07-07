<template>
  <div>
    <teleport to="#teleported-items" v-if="isRendered">
      <div class="flex items-center gap-2">
        <Button
          :icon="icons.plus"
          @click="addRow"
          iconPosition="right"
          :title="$t('add_item', { item: $t('__CRUD_UNDERSCORE__') })"
          type="primary teleport"
        />
      </div>
    </teleport>

    <Table
      :headers="headers"
      :items="__CRUD__Store.items"
      :pagination="__CRUD__Store.pagination"
      :isLoading="__CRUD__Store.isLoading"
      :showSelect="true"
      tableName="__CRUD__"
      @searchValue="getItems"
      @rowClicked="viewRow($event)"
      @isTrashed="getItems"
      @update:options="getItems"
    />
    <AddEditModal
      width="699"
      v-model="isShowModal"
      @addEditRow="submitForm"
      @editRow="editRow"
      @deleteRow="deleteRow"
      :isCreate="isCreate"
      :isView="isView"
      :title="modalTitle"
      :isAddLoading="__CRUD__Store.isAddLoading"
      :schema="schema"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { use__CRUD_CAPITAL__Store } from "../stores/__CRUD__.js";
import { use__CRUD_CAPITAL__Schema } from "../schema/__CRUD__.js";
import { useI18n } from "vue-i18n";
import { confirmDelete } from "@/composables/useAlert";
import { useTeleport } from "@/composables/useTeleport";
import { useEnumsStore } from "@/stores/enums";
import Table from "@/components/common/Table/index.vue";
import AddEditModal from "@/components/common/AddEditModal.vue";
import { useBreadCrumbStore } from "@/stores/breadCrumb";
import {
  handleErrors,
  resetSchemaValues,
  transformSchemaToObject,
  updateSchemaValues,
} from "@/utils/formDataHandler";

const { isRendered } = useTeleport("teleported-items");
const isView = ref(false);
const isShowModal = ref(false);
const enumsStore = useEnumsStore();
const isCreate = ref(false);
const { t } = useI18n();

const modalTitle = computed(() => {
  if (isView.value) return t("view_item", { item: t("__CRUD_UNDERSCORE__") });
  if (isCreate.value) return t("add_item", { item: t("__CRUD_UNDERSCORE__") });
  else return t("edit_item", { item: t("__CRUD_UNDERSCORE__") });
});

const { setBreadcrumbs } = useBreadCrumbStore();

let schema = use__CRUD_CAPITAL__Schema({
  isCreate: isCreate.value,
  isView: isView.value,
});

const __CRUD__Store = use__CRUD_CAPITAL__Store();

const headers = ref([
  { title: t("index"), disabled: true, key: "id", width: "10%" },
  { title: t("name"), key: "translation_name", align: "start" },
  { title: t("description"), key: "translation_description", width: "12%" },
]);

setBreadcrumbs([
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("__CRUD_UNDERSCORE__"), disabled: true, to: "" },
]);

__HELP_ENUMS__;
__HELP_MODELS__;

const getItems = async (value) => await __CRUD__Store.getAll({ params: value });

const handleModal = ({
  createMode,
  viewMode,
  setItem = false,
  selectedItem = null,
}) => {
  if (selectedItem) __CRUD__Store.selectedItem = selectedItem;
  isCreate.value = createMode;
  isView.value = viewMode;
  schema = use__CRUD_CAPITAL__Schema({
    isCreate: isCreate.value,
    isView: isView.value,
  });
  if (setItem) updateSchemaValues(schema.value, __CRUD__Store.selectedItem);
  isShowModal.value = true;
};

const addRow = () => handleModal({ createMode: true, viewMode: false });

const editRow = () =>
  handleModal({ createMode: false, viewMode: false, setItem: true });

const viewRow = (item) =>
  handleModal({
    createMode: false,
    viewMode: true,
    setItem: true,
    selectedItem: item,
  });

const submitForm = async (data) => {
  const payload = transformSchemaToObject(data);
  if (!isCreate.value) payload["id"] = __CRUD__Store.selectedItem.id;
  const { code, errors } =
    await __CRUD__Store[isCreate.value ? "createRow" : "updateRow"](payload);
  if (code == 200) isShowModal.value = false;
  else handleErrors(schema.value, errors);
};

const deleteRow = () => {
  confirmDelete({
    title: `${t("delete_item")} ${__CRUD__Store.selectedItem.name}`,
  }).then(async (result) => {
    if (result) {
      const { code } = await __CRUD__Store.deleteRow(
        __CRUD__Store.selectedItem.id
      );
      if (code === 200) isShowModal.value = false;
    }
  });
};

onMounted(async () => {
  __HELP_PROMISES__
});
</script>

<style lang="scss" scoped></style>
