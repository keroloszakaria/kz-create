<template>
  <div>
    <teleport to="#teleported-items" v-if="isRendered">
      <div class="flex items-center gap-2">
        <Button
          :icon="icons.plus"
          @click="addRow"
          iconPosition="right"
          :title="$t('add_item', { item: $t('users') })"
          type="primary teleport"
        />
      </div>
    </teleport>

    <Table
      :headers="headers"
      :items="usersStore.items"
      :pagination="usersStore.pagination"
      :isLoading="usersStore.isLoading"
      :showSelect="true"
      tableName="users"
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
      :isAddLoading="usersStore.isAddLoading"
      :schema="schema"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUsersStore } from "../stores/users.js";
import { useUsersSchema } from "../schema/users.js";
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
  if (isView.value) return t("view_item", { item: t("users") });
  if (isCreate.value) return t("add_item", { item: t("users") });
  else return t("edit_item", { item: t("users") });
});

const { setBreadcrumbs } = useBreadCrumbStore();

let schema = useUsersSchema({
  isCreate: isCreate.value,
  isView: isView.value,
});

const usersStore = useUsersStore();

const headers = ref([
  { title: t("index"), disabled: true, key: "id", width: "10%" },
  { title: t("name"), key: "translation_name", align: "start" },
  { title: t("description"), key: "translation_description", width: "12%" },
]);

setBreadcrumbs([
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("users"), disabled: true, to: "" },
]);

;
;

const getItems = async (value) => await usersStore.getAll({ params: value });

const handleModal = ({
  createMode,
  viewMode,
  setItem = false,
  selectedItem = null,
}) => {
  if (selectedItem) usersStore.selectedItem = selectedItem;
  isCreate.value = createMode;
  isView.value = viewMode;
  schema = useUsersSchema({
    isCreate: isCreate.value,
    isView: isView.value,
  });
  if (setItem) updateSchemaValues(schema.value, usersStore.selectedItem);
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
  if (!isCreate.value) payload["id"] = usersStore.selectedItem.id;
  const { code, errors } = await usersStore[
    isCreate.value ? "createRow" : "updateRow"
  ](payload);
  if (code == 200) isShowModal.value = false;
  else handleErrors(schema.value, errors);
};

const deleteRow = () => {
  confirmDelete({
    title: `${t("delete_item")} ${usersStore.selectedItem.name}`,
  }).then(async (result) => {
    if (result) {
      const { code } = await usersStore.deleteRow(
        usersStore.selectedItem.id
      );
      if (code === 200) isShowModal.value = false;
    }
  });
};

onMounted(async () => {
  ;
});
</script>

<style lang="scss" scoped></style>
