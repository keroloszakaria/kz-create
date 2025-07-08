import { defineStore } from 'pinia'
import { ref } from 'vue'
import { httpRequest } from '@/services/api'
import { useAppSettings } from '@/composables/useAppSettings'
import { showAlert } from '@/composables/useAlert'
import storage from '@/composables/useStorage'
import i18n from '@/utils/i18n'
const t = i18n.global.t

export const useSettingsStore = defineStore('settings', () => {
  const generalSettings = ref([])
  const mailServer = ref([])
  const properties = ref([])
  const requests = ref([])
  const theme = ref([])

  const getProperties = () => {
    const props = {}
    properties.value.forEach((property) => {
      props[property.key] = property.value
    })

    const { updateFavicon, updateTitle } = useAppSettings()
    updateFavicon(props['website_favorite_place_icon'])
    return props
  }
  const handleFields = (fields = []) => {
    return fields.map((field) => ({
      ...field,
      label: t(field.key),
      placeholder: t(`enter_item`, { item: t(field.key) }),
      mode: 'vertical',
      inputStyle: field.type == 'imageUploader' ? 'vertical' : 'flat',
      cols: field.type == 'imageUploader' ? { lg: 12, md: 12 } : { lg: 6, md: 6 },
      accept: field.type == 'imageUploader' ? 'png,jpg' : '',
      maxSize: field.type == 'imageUploader' ? '5 MB' : ''
    }))
  }
  async function getSettings() {
    try {
      const response = await httpRequest('/settings')
      const {
        general_settings,
        mail_server,
        properties: props,
        requests: req,
        theme
      } = response.data
      generalSettings.value = handleFields(general_settings)
      properties.value = handleFields(props)
      mailServer.value = handleFields(mail_server)
      requests.value = handleFields(req)
      theme.value = handleFields(theme)
      getProperties()
    } catch (error) {
      showAlert({ title: error.response.data.message, type: 'error' })
      return error.response.data
    }
  }

  async function updateSettings(data) {
    try {
      const response = await httpRequest('/set-settings', {
        method: 'POST',
        data,
        isFile: true
      })
      showAlert({ title: response.message, type: 'success' })
    } catch (error) {
      showAlert({ title: error.response.data.message, type: 'error' })
      return error.response.data
      console.error(error)
    }
  }

  return {
    generalSettings,
    mailServer,
    properties,
    requests,
    theme,
    getProperties,
    getSettings,
    updateSettings
  }
})
