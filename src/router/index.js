// based imports router
import { createRouter, createWebHistory } from 'vue-router';

// first views import
import HomeView from '@/views/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    
    // Login
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },

    // HomePage
    {
      path: '',
      name: 'home',
      component: HomeView 
    }, 

    // NotFound
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () =>  import('@/views/404.vue')
    }
  
  ]
});

// Middleware per l'autenticazione
export default router;
