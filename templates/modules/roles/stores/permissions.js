import { defineStore } from 'pinia'
import { httpRequest } from '@/services/api'
import { showAlert } from '@/composables/useAlert'
import { objectToQueryString } from '@/utils/formDataHandler'
import { ref } from 'vue'
import router from '@/router/index.js'

export const usePermissionsStore = defineStore('permissions', () => {
  const isLoading = ref(false)
  const isShowModal = ref(false)
  const items = ref([])
  const permssionGroups = ref([])
  const selectedItem = ref({})
  const pagination = ref({})
  const error = ref(null)

  const getAll = async ({ params }) => {
    try {
      isLoading.value = true
      let queryString = ''
      if (params != undefined) queryString = objectToQueryString(params)
      const response = await httpRequest(`/permissions?${queryString}`)
      items.value = response.data.data || response.data
      permssionGroups.value = groupPermissions(items.value)
      pagination.value['total'] = response.data.total || 0
      pagination.value['pageSize'] = response.data.per_page || 10
      pagination.value['page'] = response.data.current_page || 1
    } catch (error) {
      showAlert({ title: error.message, type: 'error' })
      return error
    } finally {
      isLoading.value = false
    }
  }

  const groupPermissions = (permissions) => {
    const grouped = permissions.reduce((acc, permission) => {
      const groupName = permission.group
      if (!acc[groupName]) acc[groupName] = { name: groupName, permissions: [] }
      acc[groupName].permissions.push(permission)
      return acc
    }, {})
    return Object.values(grouped)
  }

  const getRow = async (id) => {
    try {
      isLoading.value = true
      const response = await httpRequest(`/permissions/${id}`)
      selectedItem.value = response.data
    } catch (error) {
      showAlert({ title: error.message, type: 'error' })
      return error
    } finally {
      isLoading.value = false
    }
  }

  const createRow = async (data, redirect = false) => {
    try {
      isLoading.value = true
      const response = await httpRequest('/permissions', { method: 'POST', data, isFile: true })
      items.value.unshift(response.data)
      showAlert({ title: response.message, type: 'success' })
      if (redirect) router.push('/permissions')
      return response
    } catch (error) {
      showAlert({ title: error.message, type: 'error' })
      return error
    } finally {
      isLoading.value = false
    }
  }

  const updateRow = async (data) => {
    try {
      isLoading.value = true
      const response = await httpRequest(`/permissions/${data.id}`, {
        method: 'PUT',
        data,
        isFile: true
      })
      const index = items.value?.findIndex((item) => item.id == data.id)
      if (index !== -1) items.value[index] = response.data
      showAlert({ title: response.message, type: 'success' })
      return response
    } catch (error) {
      showAlert({ title: error.message, type: 'error' })
      return error
    } finally {
      isLoading.value = false
    }
  }

  const deleteRow = async (id) => {
    try {
      isLoading.value = true
      const response = await httpRequest(`/permissions/${id}`, { method: 'DELETE' })
      items.value = items.value.filter((item) => item.id !== id)
      showAlert({ title: response.message, type: 'success' })
      return response
    } catch (error) {
      showAlert({ title: error.message, type: 'error' })
      return error
    } finally {
      isLoading.value = false
    }
  }
  const deleteRows = async (ids) => {
    try {
      isLoading.value = true
      const response = await httpRequest(`/permissions`, {
        method: 'DELETE',
        data: { ids: ids }
      })
      items.value = items.value.filter((user) => !ids.includes(user.id))
      showAlert({ title: response.message, type: 'success' })
      return response
    } catch (error) {
      showAlert({ title: error.message, type: 'error' })
      return error
    } finally {
      isLoading.value = false
    }
  }
  const forceDeleteRow = async (id) => {
    try {
      isLoading.value = true
      const response = await httpRequest(`/permissions/${id}/force-delete`, {
        method: 'DELETE'
      })
      items.value = items.value.filter((item) => item.id !== id)
      showAlert({ title: response.message, type: 'success' })
      return response
    } catch (error) {
      showAlert({ title: error.message, type: 'error' })
      return error
    } finally {
      isLoading.value = false
    }
  }
  const restoreRow = async (id) => {
    try {
      isLoading.value = true
      const response = await httpRequest(`/permissions/${id}/restore`, { method: 'POST' })
      items.value = items.value.filter((item) => item.id !== id)
      showAlert({ title: response.message, type: 'success' })
      return response
    } catch (error) {
      showAlert({ title: error.message, type: 'error' })
      return error
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    isShowModal,
    items,
    permssionGroups,
    selectedItem,
    pagination,
    error,
    getAll,
    getRow,
    createRow,
    updateRow,
    deleteRow,
    deleteRows,
    forceDeleteRow,
    restoreRow
  }
})
