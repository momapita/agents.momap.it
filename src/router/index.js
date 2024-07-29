// based imports router
import { createRouter, createWebHistory } from 'vue-router';

// import middleware
import Middleware from './middleware.js';

// first views import
import HomeView from '@/views/common/Home.vue';

// Recupero la gerarchia di ruoli
const roleHierarchy = Middleware.getRoleHierarchy();

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    
    // Login
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/common/Login.vue'),
      meta: { requiresAuth: false }
    },

    // HomePage
    {
      path: '',
      name: 'home',
      component: HomeView,
      meta: { requiredRole: roleHierarchy.agent, requiresAuth: true }
    },

    // HomePage
    {
      path: '/testPermessi',
      name: 'testPermessi',
      component: HomeView,
      meta: { requiredRole: roleHierarchy.master_agent, requiresAuth: true }
    }, 

    // NotFound
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () =>  import('@/views/common/404.vue'),
      meta: { requiresAuth: false }
    }
  
  ]
});

// Middleware per l'autenticazione
router.beforeEach((to, from, next) => {
  Middleware.handleRoute(to, from, next);
});

export default router;
