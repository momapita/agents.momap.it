import { createRouter, createWebHistory, RouterView } from 'vue-router';
import Tr from "@/i18n/translation";
import { authMiddleware } from './middleware';

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: "/:locale?",
      component: RouterView,
      beforeEnter: Tr.routeMiddleware,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/Login.vue')
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
      component: () =>  import('@/views/Home.vue'),
      meta: { requiresAuth: false }
    }
  ]
});

// Middleware per l'autenticazione
router.beforeEach(authMiddleware);

export default router;
