import { createApp } from 'vue';
import router from '@/router';
import App from './App.vue';

// import per pinia e il persist date
import { createPinia } from 'pinia';

// Import PrimeVue and theme
import PrimeVue from 'primevue/config';
import { themePreset } from '@/theme';

// Import Styles And Fonts
import './style.css';
import '@fontsource-variable/inter';

// Create App
const app = createApp(App);

// Use Pinia
app.use(createPinia());

// Use Router
app.use(router);

// Use primevue
app.use(PrimeVue, {
    theme: {
        preset: themePreset,
        options: {
            darkModeSelector: '.dark',
        }
    }
});


// Mount App
app.mount('#app')
