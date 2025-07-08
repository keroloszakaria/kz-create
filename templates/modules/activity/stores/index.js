import { defineStore } from 'pinia'
import { httpRequest } from '@/services/api'
import { objectToQueryString } from '@/utils/formDataHandler'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useActivityStore = defineStore('activity', () => {
  const isLoading = ref(false)
  const isAddLoading = ref(false)
  const items = ref([])
  const selectedItem = ref({})
  const pagination = ref({
    total: 0,
    from: 0,
    to: 0,
    currentPage: 1,
    pageSize: 10
  })
  const error = ref(null)
  const router = useRouter()

  const getAll = async ({ params }) => {
    try {
      isLoading.value = true
      let queryString = ''
      if (params !== undefined) queryString = objectToQueryString(params)
      const response = await httpRequest(`/get-activity-logs?${queryString}`)
      items.value = response.data.data || response.data
      pagination.value['total'] = response.data.total || 0
      pagination.value['pageSize'] = response.data.per_page || 0
      pagination.value['currentPage'] = response.data.current_page || 1
      pagination.value['from'] = response.data.from || 0
      pagination.value['to'] = response.data.to || 0
    } catch (err) {
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const getRow = async (id) => {
    try {
      isLoading.value = true
      const response = await httpRequest(`/get-activity-logs/${id}`)
      selectedItem.value = response.data
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    isAddLoading,
    items,
    selectedItem,
    pagination,
    error,
    getAll,
    getRow
  }
})
