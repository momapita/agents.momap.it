// based imports router
import { createRouter, createWebHistory, RouterView } from 'vue-router';
import Tr from "@/i18n/translation";

// first views import
import HomeView from '@/views/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: "/:locale?",
      component: RouterView,
      beforeEnter: Tr.routeMiddleware,
      children: [

        // Login
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/Login.vue'),
        },

        // HomePage
        {
          path: '',
          name: 'home',
          component: HomeView 
        }
        
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () =>  import('@/views/Home.vue')
    }
  ]
});

// Middleware per l'autenticazione
export default router;
