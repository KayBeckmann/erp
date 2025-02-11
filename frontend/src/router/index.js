import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Prüfen, ob der Benutzer authentifiziert ist (Token in localStorage)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && token) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
