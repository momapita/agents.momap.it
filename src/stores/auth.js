import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', {

    state() {
        const tokenFromCookie = Cookies.get('jwt_token');
        return {
          token: tokenFromCookie || null
        };
    },

    actions: {

        setToken(token) {
            this.token = token;
            Cookies.set('jwt_token', token, {
              secure: true,
              expires: 30,
              domain: import.meta.env.VITE_BASE_URL_COOKIES,
            });
        },

        removeToken() {
            this.token = null;
            Cookies.get('jwt_token') && Cookies.remove('jwt_token', { domain: import.meta.env.VITE_BASE_URL_COOKIES, });
        }
    },

    getters: {
        getToken: (state) => state.token,
        getAuthStatus: (state) => !!state.token,
    }

});