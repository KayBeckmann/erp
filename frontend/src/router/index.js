// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../views/Home.vue'
import Admin from '../views/Admin.vue'
import Users from '../views/Users.vue'
import Groups from '../views/Groups.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'users',
        name: 'Users',
        component: Users,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'groups',
        name: 'Groups',
        component: Groups,
        meta: { requiresAuth: true, requiresAdmin: true }
      }
    ]
  },
  {
    path: '/',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation-Guard: Falls kein Token vorhanden, wird zur Login-Seite umgeleitet
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' });
  } else if (to.meta.requiresAdmin) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.groups && payload.groups.includes('Admin')) {
        next();
      } else {
        next({ name: 'Home' });
      }
    } catch (e) {
      next({ name: 'Login' });
    }
  } else {
    next();
  }
});

export default router;
