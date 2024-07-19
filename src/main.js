import { createApp } from 'vue';
import router from '@/router';
import App from './App.vue';

// import i18n per il multilingua
import i18n from "./i18n";

// import per pinia e il persist date
import { createPinia } from 'pinia';

// import per vee validate e formGenerator
import { Field, Form, ErrorMessage } from 'vee-validate';
import FormGenerator from "@/components/form/FormGenerator.vue";

// Import PrimeVue and theme
import PrimeVue from 'primevue/config';
import { themePreset } from '@/theme';

// Import dei vari layout
import Wrapper from '@/theme/layouts/Wrapper.vue';

// Import Styles And Fonts
import './style.css';
import '@fontsource-variable/inter';
import "@fontsource-variable/material-symbols-outlined";

// import dei servizi di primeVue
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

// Create App
const app = createApp(App);

// Use Pinia
app.use(createPinia());

// Use Router
app.use(router);

// Gestione del multilingua
app.use(i18n);

// Use veeValidate
app.component('Field', Field);
app.component('Form', Form);
app.component('ErrorMessage', ErrorMessage);

// Use formGenerator
app.component('FormGenerator', FormGenerator);

// Use primevue theme
app.use(PrimeVue, {
    theme: {
        preset: themePreset,
        options: {
            darkModeSelector: '.dark',
        }
    }
});

// Use Wrapper Layout
app.component('WrapperLayout', Wrapper);

// Use primevue Services
app.use(ToastService);
app.directive('tooltip', Tooltip);

// Setto globalmente la variabile della CDN
app.provide('cdnUrl', import.meta.env.VITE_CDN_URL);

// Mount App
app.mount('#app')
