
// Imports based on middleware
import { computed } from 'vue';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

// store imports
import { useAuthStore } from '@/stores/auth.js';

class Permissions {

    constructor() {
        this.roleHierarchy = {
            customer: 1,
            installer: 2,
            agent: 3,
            master_agent: 4,
            admin: 5
        }
    }

    #getTypeUser(){
        try {
            
            // recupero il token jwt
            const jwtToken = Cookies.get('jwt', { domain: import.meta.env.VITE_BASE_URL_COOKIES }) || null;

            if(!jwtToken){
                throw new Error('Token non valido');
            }

            const jwtData = jwtDecode(jwtToken);

            if(!jwtData || Object.keys(jwtData).length === 0 || !('user_type' in jwtData) || !jwtData.user_type){
                throw new Error('Jwt Data non valida');
            }

            // controllo se lo user_type sia presente nella gerarchia di ruoli
            if(!this.roleHierarchy[jwtData.user_type]){
                throw new Error('Tipo non presente');
            }

            return jwtData?.user_type;

        } catch (error) {
            import.meta.env.VITE_DEVELOPMENT && console.error(error);
            return null;
        }
    }

    #getRoleValue(role) {
        if (typeof role === 'number') {
            return role;
        } else if (typeof role === 'string') {
            return this.roleHierarchy[role];
        }
        return null;
    }

    hasPermission(requiredRole) {
        try {
            
            // recupero il permesso dell'utente
            const userRole = this.#getTypeUser();

            if(!userRole){
                throw new Error('Ruolo Utente non trovato o non valido');
            }

            const requiredRoleValue = this.#getRoleValue(requiredRole) || null;

            if(!requiredRoleValue){
                throw new Error('Required Role non valido');
            }

            return this.roleHierarchy[userRole] >= requiredRoleValue;

        } catch (error) {
            import.meta.env.VITE_DEVELOPMENT && console.error(error);
            return false;
        }
    }

    handleRoute(to, from, next) {

        // recupero lo stato dell'utente
        const isLoggedIn = computed(() => useAuthStore().getAuthStatus)?.value;

        if (to.meta.requiresAuth) {

            // verifico che l'utente sia loggato
            if(!isLoggedIn){
                next({ name: 'login' });
            } else {

                // verifico se la pagina ha bisogno di permessi aggiuntivi all'autenticazione
                if (to.meta.requiredRole && !this.hasPermission(to.meta.requiredRole)) {
                    return next({ name: 'home' });
                } else {
                    next();
                }

            }

        } else {

            // verifico se l'utente è loggato ma sta sulla pagina login o recupero password
            if (isLoggedIn && (to.name === 'login' || to.name === 'recoverPassword')) {
                next({ name: 'home' });
            } else {
                next();
            }
        }
    }

    getRoleHierarchy() {
        return this.roleHierarchy;
    }

}

const permissions = new Permissions();
export default permissions;
