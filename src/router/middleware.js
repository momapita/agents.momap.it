/*// Funzione che controlla se esistono i permessi
export const existsPermission = () => {
    try {
        
        // recupero il token jwt
        const jwtToken = Cookies.get('jwt_token', { domain: import.meta.env.VITE_BASE_URL_COOKIES });

        if(!jwtToken){
            throw new Error('Token non definito');
        }

        const decoded = jwtDecode(jwtToken);
        const privileges = JSON.parse(decoded.privileges);

        if(!privileges) {
            throw new Error('Privilegi non definiti');
        }
        
        return privileges;

    } catch (error) {
        return {};
    }
}

// Funzione che controlla se l'utente ha i permessi
export const checkExistsPermission = (permission) => {
    try {

        const privileges = existsPermission();

        if(!privileges) {
            throw new Error('Privilegi non definiti');
        }

        // controllo se l'utente è un subuser
        const conditionSubuser = privileges['type'] == 'subuser';

        // splitto permission sul .
        const permissions = permission.split('.') ?? [];

        // accedo ricorsivamente alle chiavi 
        const test123 = permissions.reduce((current, key) => {
            return current ? current[key] : undefined;
        }, privileges);

        const exist = permission == 'type' ? !conditionSubuser : test123 ? true : false;

        const existPermission = typeof exist == 'string' ? exist == 'true' : exist;

        return existPermission;

    } catch (error) {
        return false;
    }
}

// Funzione che controlla se l'utente ha i permessi
export const checkTypeUser = (type) => {
    try {

        const privileges = existsPermission();

        if(!privileges) {
            throw new Error('Privilegi non definiti');
        }

        const user_type = privileges.type ?? null;

        if(!user_type) {
            throw new Error('Tipo utente non definito');
        }

        return user_type == type;

    } catch (error) {
        return false;
    }
}

// Funzione per controllare il check di benvenuto per fleet management
const checkerWelcomeFleetManagement = async (to, next) => {
    
    // recupero il routing
    const router = useRouter();

    // setto lo store
    await useWelcomeChecker().fetchChecker();
    
    // aspetto il fetch
    Promise.resolve();

    // verifico il check
    const showWelcome = useWelcomeChecker().getCheckWelcome || null;

    // verifico se il check è true
    if(showWelcome.value === true && to.name != 'welcome' && showWelcome !== null) {
        router.push(Tr.i18nRoute({ name: 'welcome' }));
    } else if(showWelcome.value === false && to.name == 'welcome' && showWelcome !== null) {
        router.push(Tr.i18nRoute({ name: 'fleetManagement' }));
    } else {
        next();
    }
}*/

// Middleware
export const authMiddleware = (to, from, next) => {
    //console.log('authMiddleware', to, from);
    next();
}