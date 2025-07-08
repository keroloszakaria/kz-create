export default [
  {
    path: '/activity',
    name: 'activity',
    component: () => import('../views/index.vue'),
    meta: {
      is_searchable: true,
      name: 'sidebar.activities'
    }
  }
]
