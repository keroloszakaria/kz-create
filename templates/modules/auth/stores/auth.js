import { defineStore } from 'pinia'
import { ref } from 'vue'
import storage from '@/composables/useStorage'
import { setCookie, getCookie, removeCookie } from '@/composables/useCookies'
import { encrypt, decrypt } from '@/utils/crypto'
import { showAlert } from '@/composables/useAlert'
import { httpRequest } from '@/services/api'
import { useRouter } from 'vue-router'

const storedUser = storage.get('user')
const currentUser = storedUser ? JSON.parse(storedUser) : null
const userPermissions = storage.get('permissions') || null
export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const isAuthenticated = ref(!!getCookie('token'))
  const isLoading = ref(false)
  const error = ref(null)
  const permissions = ref(decrypt(JSON.parse(userPermissions)) || [])
  const user = ref(currentUser)
  const token = ref(getCookie('token'))

  const login = async (data) => {
    try {
      isLoading.value = true
      const response = await httpRequest('/login', {
        method: 'POST',
        data: data
      })

      const { user: userData, token } = response.data
      user.value = userData
      isAuthenticated.value = true
      const encryptedPermissions = encrypt(userData.permissions)
      setCookie('token', token)
      storage.set('permissions', JSON.stringify(encryptedPermissions))
      storage.set('user', JSON.stringify(userData))
      router.push('/')
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'An error occurred.'
      return error
    } finally {
      isLoading.value = false
    }
  }

  const flush = () => {
    storage.remove('user')
    storage.remove('permissions')
    removeCookie('token')
    user.value = null
    isAuthenticated.value = false
    router.push('/login')
  }

  const logOut = async () => {
    isLoading.value = true
    try {
      await httpRequest('/logout', { method: 'POST' })
      flush()
    } catch (error) {
      console.error(error)
      flush()
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    user,
    permissions,
    token,
    isAuthenticated,
    login,
    logOut,
    flush
  }
})
