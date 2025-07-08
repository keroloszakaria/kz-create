import { useAuthStore } from '../stores/auth'
import auth from '../router'

export async function authGuard(to, from, next) {
  const authStore = useAuthStore()
  const { user, isAuthenticated } = authStore
  if (to.path === from.path) return next()
  const authRoutes = auth.map((route) => route.path)
  if (isAuthenticated) {
    if (authRoutes.includes(to.path)) return next('/')
    return next()
  }

  if (to.meta.requiresAuth) {
    if (!user?.email || !isAuthenticated) return next('/login')
    return next()
  }
  next()
}
