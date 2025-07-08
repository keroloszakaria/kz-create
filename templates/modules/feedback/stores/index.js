import { defineStore } from 'pinia'
import { httpRequest } from '@/services/api'
import { showAlert } from '@/composables/useAlert'

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    isLoading: false,
    isAddingLoading: false,
    items: [],
    selectedItem: {},
    pagination: {}
  }),
  getters: {},
  actions: {
    async sendFeedback(data) {
      this.isAddingLoading = true
      try {
        const response = await httpRequest('/feedbacks', { method: 'POST', data })
        showAlert({ title: response.message, type: 'success' })
        return response
      } catch (error) {
        showAlert({ title: error.response.data.message, type: 'error' })
        return error.response.data
      } finally {
        this.isAddingLoading = false
      }
    }
  }
})
