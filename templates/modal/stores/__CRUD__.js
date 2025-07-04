import { defineStore } from "pinia";
import { httpRequest } from "@/services/api";
import { showAlert } from "@/composables/useAlert";
import { objectToQueryString } from "@/utils/formDataHandler";
import { ref } from "vue";
import { useRouter } from "vue-router";

const MODULE = "__CRUD__";

export const use__CRUD_CAPITAL__Store = defineStore(MODULE, () => {
  const isLoading = ref(false);
  const isAddLoading = ref(false);
  const items = ref([]);
  const selectedItem = ref({});
  const pagination = ref({
    total: 0,
    from: 0,
    to: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const error = ref(null);
  const router = useRouter();

  const getAll = async ({ params }) => {
    try {
      isLoading.value = true;
      let queryString = "";
      if (params !== undefined) queryString = objectToQueryString(params);
      const response = await httpRequest(`/${MODULE}?${queryString}`);
      items.value = response.data.data || response.data;
      pagination.value["total"] = response.data.total || 0;
      pagination.value["pageSize"] = response.data.per_page || 0;
      pagination.value["currentPage"] = response.data.current_page || 1;
      pagination.value["from"] = response.data.from || 0;
      pagination.value["to"] = response.data.to || 0;
    } catch (error) {
      showAlert({ title: error.response.data.message, type: "error" });
      return error.response.data;
    } finally {
      isLoading.value = false;
    }
  };

  const getRow = async (id) => {
    try {
      isLoading.value = true;
      const response = await httpRequest(`/${MODULE}/${id}`);
      selectedItem.value = response.data;
    } catch (error) {
      showAlert({ title: error.response.data.message, type: "error" });
      return error.response.data;
    } finally {
      isLoading.value = false;
    }
  };

  const createRow = async (data, redirect = true) => {
    try {
      isAddLoading.value = true;
      const response = await httpRequest(`/${MODULE}`, {
        method: "POST",
        data,
      });
      showAlert({ title: response.message, type: "success" });
      items.value.unshift(response.data);
      pagination.value["total"]++;
      pagination.value["to"]++;

      if (redirect) router.push(`/${MODULE}`);
      return response;
    } catch (error) {
      showAlert({ title: error.response.data.message, type: "error" });
      return error.response.data;
    } finally {
      isAddLoading.value = false;
    }
  };

  const updateRow = async (data, redirect = true) => {
    try {
      isAddLoading.value = true;
      const response = await httpRequest(`/${MODULE}/${data.id}`, {
        method: "PUT",
        data,
      });
      showAlert({ title: response.message, type: "success" });
      if (redirect) router.push(`/${MODULE}`);
      return response;
    } catch (error) {
      showAlert({ title: error.response.data.message, type: "error" });
      return error.response.data;
    } finally {
      isAddLoading.value = false;
    }
  };

  const deleteRow = async (id) => {
    try {
      isLoading.value = true;
      const response = await httpRequest(`/${MODULE}/${id}`, {
        method: "DELETE",
      });
      const index = items.value.findIndex((item) => item.id === id);
      items.value.splice(index, 1);
      showAlert({ title: response.message, type: "success" });
      return response;
    } catch (error) {
      showAlert({ title: error.response.data.message, type: "error" });
      return error.response.data;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    isAddLoading,
    items,
    selectedItem,
    pagination,
    error,
    getAll,
    getRow,
    createRow,
    updateRow,
    deleteRow,
  };
});
