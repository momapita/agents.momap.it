/*
 Per aggiungere una nuova voce alla navigazione bisogna inserire nell'array un oggetto con questa struttura: 
    {
        label: [nomeVoce] (presente in src\i18n\locales\it\headers.js, se non presente non verrà tradotta),
        icon: [nomeIcona] (icone di material-symbols-outlined),
        name: [nomeRotta o url]
    }

    Per aggiungere un figlio alla voce bisogna inserire nell'array un oggetto con questa struttura:
    {
        label: [nomeVoce] (presente in src\i18n\locales\it\headers.js, se non presente non verrà tradotta),
        icon: [nomeIcona] (icone di material-symbols-outlined),
        items: [
            {
                label: [nomeVoce] (presente in src\i18n\locales\it\headers.js, se non presente non verrà tradotta),
                icon: [nomeIcona] (icone di material-symbols-outlined),
                name: [nomeRotta o url]
            },
            {
                label: [nomeVoce] (presente in src\i18n\locales\it\headers.js, se non presente non verrà tradotta),
                icon: [nomeIcona] (icone di material-symbols-outlined),
                name: [nomeRotta o url]
            }
        ]
    }

    NB. Tutti i campi presenti saranno già filtrati con la gestione dei permessi automatica.
*/

export default [
    {
        label: 'home',
        icon: 'home',
        name: 'home',
    },
    {
        label: 'clients',
        icon: 'group',
        name: 'clients',
        class: 'text-green-500 dark:text-green-300',
    },
    {
        label: 'orders',
        icon: 'orders',
        name: 'orders',
        class: 'text-purple-500 dark:text-purple-300',
        items: [
            {
                label: 'orders',
                icon: 'orders',
                name: 'https://www.google.com/',
            }
        ]
    },
    {
        label: 'quotes',
        icon: 'request_quote',
        name: 'quotes',
    },
    {
        label: 'products',
        icon: 'inventory_2',
        name: 'products',
    },
    {
        label: 'areas',
        icon: 'activity_zone',
        name: 'areas',
    },
    {
        label: 'agents',
        icon: 'support_agent',
        name: 'agents',
    },
    {
        label: 'provisions_schemes',
        icon: 'account_balance_wallet',
        name: 'provisions_schemes',
    },
    {
        label: 'installer',
        icon: 'tools_installation_kit',
        name: 'installer',
    },
]