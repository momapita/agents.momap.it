import { createApp } from 'vue';
import router from '@/router';
import App from './App.vue';

// import i18n per il multilingua
import i18n from "./i18n";

// import per pinia e il persist date
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// import per vee validate e formGenerator
import { Field, Form, ErrorMessage } from 'vee-validate';
import { setGlobalRules } from "@/helpers/form.js"; 
import FormGenerator from "@/components/form/FormGenerator.vue";

// import http service
import HttpService from "@/http";

// Import PrimeVue and theme
import PrimeVue from 'primevue/config';
import Ripple from 'primevue/ripple';
import { themePreset } from '@/theme';

// Import dei vari layout
import Wrapper from '@/theme/layouts/Wrapper.vue';

// Import del componente DatatableWrapper
import DataTableWrapper from '@/components/dataViews/DataTableWrapper.vue';

// Import del componente AppLink
import AppLink from '@/components/navigations/AppLink.vue';

// Import Styles And Fonts
import './style.css';
import '@fontsource-variable/inter';
import "@fontsource-variable/material-symbols-outlined";

// import dei servizi di primeVue e locali per la gestione del toast e del confirmation
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import ToastBus from '@/services/globalToastBus';

// import dei servizi di primeVue e locali per la gestione del dialog
import DialogService from 'primevue/dialogservice';
import DialogBus from '@/services/globalDialogBus';

// Import del tooltip
import Tooltip from 'primevue/tooltip';

// Directives imports
import canDirective from '@/directives/can';

// Create App
const app = createApp(App);

// Use Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
app.use(pinia);

// Gestione del multilingua
app.use(i18n);

// Use Router
app.use(router);

// Use veeValidate
app.component('Field', Field);
app.component('Form', Form);
app.component('ErrorMessage', ErrorMessage);

// setto globalmente le rules
setGlobalRules();

// Use formGenerator
app.component('FormGenerator', FormGenerator);

// Use AppLink
app.component('AppLink', AppLink);

// Use primevue theme
app.use(PrimeVue, {
    theme: {
        preset: themePreset,
        options: {
            darkModeSelector: '.dark',
        }
    },
    ripple: true
});
app.directive('ripple', Ripple);

// Use Wrapper and DataTable Wrapper
app.component('WrapperLayout', Wrapper);
app.component('DataTableWrapper', DataTableWrapper);

// Use primevue Services
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);
app.directive('tooltip', Tooltip);

// Setto globalmente la variabile della CDN
app.provide('cdnUrl', import.meta.env.VITE_CDN_URL);

// Setto globalmente la variabile del toast
app.provide('toastBus', ToastBus);

// Setto globalmente la variabile del dialog
app.provide('dialogBus', DialogBus);

// Setto globalmente l'HttpService
app.provide('HttpService', HttpService);

// Use can directive
app.directive('can', canDirective);

// Mount App
app.mount('#app')
