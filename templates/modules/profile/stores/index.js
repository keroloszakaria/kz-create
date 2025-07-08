import { defineStore } from "pinia";
import { httpRequest } from "@/services/api";
import { showAlert } from "@/composables/useAlert";
import { ref } from "vue";
import storage from "@/composables/useStorage";

const storedUser = storage.get("user");
const currentUser = storedUser ? JSON.parse(storedUser) : null;
export const useProfileStore = defineStore("profile", () => {
  const isLoading = ref(false);
  const user = ref(currentUser);
  const getUser = async () => {
    isLoading.value = true;
    try {
      const response = await httpRequest("/me", { method: "GET" });
      user.value = response.data;
      return response;
    } catch (error) {
      console.error(error);
      return error;
    } finally {
      isLoading.value = false;
    }
  };
  const updateUser = async (data) => {
    isLoading.value = true;
    try {
      const response = await httpRequest("/update-profile", {
        method: "POST",
        data,
      });
      const updatedUser = response.data;
      user.value = updatedUser;
      storage.set("user", JSON.stringify(updatedUser));
      showAlert({ title: response.message, type: "success" });
      return response;
    } catch (error) {
      showAlert({ title: error.response.data.message, type: "error" });
      return error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    user,
    getUser,
    updateUser,
  };
});
