export default [
  {
    name: 'login',
    path: '/login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      requiresAuth: false,
      name: 'login'
    }
  },
  {
    name: 'forgot-password',
    path: '/forgot-password',
    component: () => import('../views/ForgotPasswordView.vue'),
    meta: {
      requiresAuth: false,
      name: 'forget_password'
    }
  },
  {
    name: 'new-password',
    path: '/new-password',
    component: () => import('../views/NewPasswordView.vue'),
    meta: {
      requiresAuth: false,
      name: 'new_password'
    }
  }
]
