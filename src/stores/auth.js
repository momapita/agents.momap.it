import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', {

    state() {
        const tokenFromCookie = Cookies.get('jwt');
        return {
          token: tokenFromCookie || null,
          user: null
        };
    },

    actions: {

        setToken(token) {
            
            // setto il token
            this.token = token;

            // setto il cookie
            Cookies.set('jwt', token, {
              secure: true,
              expires: 30,
              domain: import.meta.env.VITE_BASE_URL_COOKIES,
            });

            // setto l'utente
            this.user = jwtDecode(this.token);
        },

        removeToken() {
            this.token = null;
            Cookies.get('jwt') && Cookies.remove('jwt', { domain: import.meta.env.VITE_BASE_URL_COOKIES, });
        }
    },

    getters: {
        
        getToken: (state) => state.token,
        
        getAuthStatus: (state) => !!state.token,

        getUser: (state) => state.user,

        getUserType: (state) => state?.user ? state?.user?.user_type || null : null

    }

});