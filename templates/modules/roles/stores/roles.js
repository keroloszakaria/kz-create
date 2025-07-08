import { defineStore } from 'pinia'
import { httpRequest } from '@/services/api'
import { showAlert } from '@/composables/useAlert'
import { objectToQueryString } from '@/utils/formDataHandler'
import { ref } from 'vue'
import router from '@/router/index.js'

export const useRolesStore = defineStore('roles', () => {
  const isLoading = ref(false)
  const items = ref([])
  const selectedItem = ref({})
  const pagination = ref({ total: 0, from: 0, to: 0, currentPage: 1, pageSize: 1 })
  const error = ref(null)

  const getAll = async ({ params }) => {
    try {
      isLoading.value = true
      let queryString = ''
      if (params != undefined) queryString = objectToQueryString(params)
      const response = await httpRequest(`/roles?${queryString}`)
      items.value = response.data.data || response.data
      pagination.value['total'] = response.data?.total || 0
      pagination.value['pageSize'] = response.data?.per_page || 0
      pagination.value['currentPage'] = response.data?.current_page || 1
      pagination.value['from'] = response.data?.from || 0
      pagination.value['to'] = response.data?.to || 0
    } catch (error) {
      showAlert({ title: error.message, type: 'error' })
      return error
    } finally {
      isLoading.value = false
    }
  }

  const getRow = async (id) => {
    try {
      isLoading.value = true
      const response = await httpRequest(`/roles/${id}`)
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
      const response = await httpRequest('/roles', { method: 'POST', data })
      showAlert({ title: response.message, type: 'success' })
      if (redirect) router.push('/roles')
      return response
    } catch (error) {
      showAlert({ title: error.message, type: 'error' })
      return error
    } finally {
      isLoading.value = false
    }
  }

  const updateRow = async (data, redirect = false) => {
    try {
      isLoading.value = true
      data['_method'] = 'PATCH'
      const response = await httpRequest(`/roles/${data.id}`, { method: 'POST', data })
      showAlert({ title: response.message, type: 'success' })
      if (redirect) router.push('/roles')
      else {
        const index = items.value?.findIndex((item) => item.id == data.id)
        if (index !== -1) items.value[index] = response.data
      }
      return response
    } catch (error) {
      showAlert({ title: error.message, type: 'error' })
      return error
    } finally {
      isLoading.value = false
    }
  }

  const deleteRow = async (id, redirect = false) => {
    try {
      isLoading.value = true
      const response = await httpRequest(`/roles/${id}`, { method: 'DELETE' })
      items.value = items.value.filter((item) => item.id !== id)
      showAlert({ title: response.message, type: 'success' })
      if (redirect) router.push('/roles')
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
      const response = await httpRequest(`/roles`, { method: 'DELETE', data: { ids: ids } })
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
      const response = await httpRequest(`/roles/${id}/force-delete`, { method: 'DELETE' })
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
      const response = await httpRequest(`/roles/${id}/restore`, { method: 'POST' })
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
    items,
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
