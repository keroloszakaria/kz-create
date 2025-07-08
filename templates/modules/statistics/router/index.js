export default [
  {
    name: 'dashboard',
    path: '/dashboard',
    component: () => import('../views/index.vue'),
    meta: {
      is_searchable: true,
      name: 'sidebar.dashboard'
    }
  }
]
