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
            Cookies.get('jwt', { domain: import.meta.env.VITE_BASE_URL_COOKIES }) && Cookies.remove('jwt', { domain: import.meta.env.VITE_BASE_URL_COOKIES, });
        },

        logout() {
            this.removeToken();
            this.user = null;
            window.location.reload();
        }
    },

    getters: {
        
        getToken: (state) => state.token,
        
        getAuthStatus: (state) => !!state.token,

        getUser: (state) => state.user,

        getUserType: (state) => state?.user ? state?.user?.user_type || null : null

    },
    persist: {
        key: 'auth',
        storage: window.localStorage,
        paths: ['user.name', 'user.last_name', 'user.email'],
        serialize: (state) => {
            return {
                token: state.token,
                user: state.user ? {
                    name: state.user.name,
                    last_name: state.user.last_name,
                    email: state.user.email
                } : null
            };
        },
        deserialize: (storedState) => {
            return {
                token: storedState.token || null,
                user: storedState.user || null
            };
        }
    }
});