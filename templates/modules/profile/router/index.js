export default [
  {
    name: 'profile',
    path: '/profile',
    component: () => import('../views/index.vue'),
    meta: { is_searchable: true, name: 'profile' }
  }
]
