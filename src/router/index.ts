import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/chat',
  },
  {
    path: '/create-account',
    name: 'CreateAccount',
    component: () => import('@/views/CreateAccount.vue'),
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/Chat.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.initializeAuth()

  const requiresAuth = to.meta.requiresAuth
  const isAuthenticated = authStore.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    // Redirect to create account if not authenticated
    next('/create-account')
  } else if (to.path === '/create-account' && isAuthenticated) {
    // Redirect to chat if already authenticated
    next('/chat')
  } else {
    next()
  }
})

export default router
