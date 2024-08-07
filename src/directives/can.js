// import middleware
import Middleware from '@/router/middleware.js';

export default {
    mounted(el, binding) {
        
        // recupero il required role
        const requiredRole = binding.value;

        if(!Middleware.hasPermission(requiredRole)) {
            console.log('Permission denied');
            el.parentNode && el.parentNode.removeChild(el);
        }
    }
};
