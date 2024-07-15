import { createApp } from 'vue';
import router from '@/router';
import App from './App.vue';

// import per pinia e il persist date
import { createPinia } from 'pinia';

// import per vee validate
import { Field, Form, ErrorMessage } from 'vee-validate';

// Import PrimeVue and theme
import PrimeVue from 'primevue/config';
import { themePreset } from '@/theme';

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

// Use veeValidate
app.component('Field', Field);
app.component('Form', Form);
app.component('ErrorMessage', ErrorMessage);

// Use primevue theme
app.use(PrimeVue, {
    theme: {
        preset: themePreset,
        options: {
            darkModeSelector: '.dark',
        }
    }
});

// Use primevue Services
app.use(ToastService);
app.directive('tooltip', Tooltip);

// Mount App
app.mount('#app')
