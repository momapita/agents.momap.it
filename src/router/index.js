import { createRouter, createWebHistory, RouterView } from 'vue-router';
import Tr from "@/i18n/translation";
import { authMiddleware } from './middleware';

import LoginView from '@/views/Login.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL || '/'),
  routes: [
    {
      path: "/:locale?",
      component: RouterView,
      beforeEnter: Tr.authMiddleware,
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginView,
        },
        {
          path: '',
          name: 'home',
          component: () => import('@/views/Home.vue')
        },
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
router.beforeEach(authMiddleware);

export default router;
