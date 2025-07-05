export default [
  {
    path: '/users',
    name: 'users',
    component: () => import('@/modules/dataEntry/views/users.vue'),
    meta: {
      is_searchable: true,
      name: 'users'
    },
  },
  // __ROUTES__
];