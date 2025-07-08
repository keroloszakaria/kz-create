export default [
  {
    name: 'roles',
    path: '/roles',
    component: () => import('../views/index.vue'),
    meta: { is_searchable: true, name: 'sidebar.roles' }
  },
  {
    name: 'add-role',
    path: '/roles/add',
    component: () => import('../views/Add.vue'),
    meta: { is_searchable: true, name: 'add_role' }
  },
  {
    name: 'edit-role',
    path: '/roles/edit-role/:id',
    component: () => import('../views/Edit.vue'),
    meta: { is_searchable: true, name: 'edit_role' }
  },
  {
    name: 'view-role',
    path: '/roles/view-role/:id',
    component: () => import('../views/View.vue'),
    meta: { is_searchable: true, name: 'view_role' }
  }
]
