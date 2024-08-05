// based imports router
import { createRouter, createWebHistory } from 'vue-router';

// import middleware
import Middleware from './middleware.js';

// first views import
import HomeView from '@/views/Home.vue';

// Recupero la gerarchia di ruoli
const roleHierarchy = Middleware.getRoleHierarchy();

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    
    // Login
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
      meta: { requiresAuth: false }
    },

    // HomePage
    {
      path: '',
      name: 'home',
      component: HomeView,
      meta: { requiredRole: roleHierarchy.agent, requiresAuth: true }
    },

    // Clients
    {
      path: '/clients',
      name: 'clients',
      component: () => import('@/views/clients/View.vue'),
      meta: { requiredRole: roleHierarchy.agent, requiresAuth: true }
    },

    // Orders
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/orders/View.vue'),
      meta: { requiredRole: roleHierarchy.agent, requiresAuth: true }
    },

    // Quotes
    {
      path: '/quotes',
      name: 'quotes',
      component: () => import('@/views/quotes/View.vue'),
      meta: { requiredRole: roleHierarchy.agent, requiresAuth: true }
    },

    // Products
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/products/View.vue'),
      meta: { requiredRole: roleHierarchy.agent, requiresAuth: true }
    },

    // Areas
    {
      path: '/areas',
      name: 'areas',
      component: () => import('@/views/areas/View.vue'),
      meta: { requiredRole: roleHierarchy.master_agent, requiresAuth: true }
    },

    // Agents
    {
      path: '/agents',
      name: 'agents',
      component: () => import('@/views/agents/View.vue'),
      meta: { requiredRole: roleHierarchy.master_agent, requiresAuth: true }
    },

    // ProvisionsSchemes
    {
      path: '/provisionsSchemes',
      name: 'provisionsSchemes',
      component: () => import('@/views/provisionsSchemes/View.vue'),
      meta: { requiredRole: roleHierarchy.admin, requiresAuth: true }
    },

    // installer
    {
      path: '/installer',
      name: 'installer',
      component: () => import('@/views/installer/View.vue'),
      meta: { requiredRole: roleHierarchy.admin, requiresAuth: true }
    },

    // NotFound
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () =>  import('@/views/404.vue'),
      meta: { requiresAuth: false }
    }
  
  ]
});

// Middleware per l'autenticazione
router.beforeEach((to, from, next) => {
  Middleware.handleRoute(to, from, next);
});

export default router;
