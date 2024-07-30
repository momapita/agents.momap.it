
<template>
    
    <Toolbar class=" w-full !px-6 !rounded-none sticky top-0 mx-auto z-50 transition-all">
        
        <template #start>

            <!-- utente loggato -->
            <template v-if="isLoggedIn">
                <Button class="!bg-transparent !border-none !text-surface-500 dark:!text-white" icon="pi pi-bars" @click="visible = true" />
            </template>

            <!-- utente non loggato -->
            <template v-else>
                <img :src="`//cdn.momap.it/branding/logos/${isDark ? 'logo' : 'logo_red'}.svg`" alt="MoMap" class="w-20 lg:w-24 py-1.5" lazy>
            </template>
        
        </template>

        <template #center>
            <div class="flex items-center 2" v-if="isLoggedIn">
                <img v-if="isMobile" :src="`//cdn.momap.it/branding/logos/logo_red_icon.png`" alt="MoMap" class="mx-4 w-8  block" lazy>
                <img v-else :src="`//cdn.momap.it/branding/logos/${isDark ? 'logo' : 'logo_red'}.svg`" alt="MoMap" class=" w-28 py-1.5 hidden lg:block" lazy>
            </div>
        </template>

        <template #end>
            <div class="flex items-center justify-center flex-1 gap-4">
                 
                <!-- titolo di pagina -->
                <div class="font-semibold tracking-wider lg:text-lg" v-if="isLoggedIn">
                    {{ $te(`headers.${route.name}.title`) ? $t(`headers.${route.name}.title`) : route.name }}
                </div>

                <!-- cambio lingua -->
                <template v-if="!isLoggedIn">
                    <LanguageSwitcher />
                    <ToggleTheme />
                </template>

             </div>
        </template>

    </Toolbar>

    <Drawer v-model:visible="visible" v-if="isLoggedIn">

        <template #header>
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined material-symbols-font-300 flex mr-2 items-center">account_circle</span>
                <div class="flex flex-col justify-center">
                    <span class="font-light tracking-wider leading-none">{{ userData?.name }} {{ userData?.last_name }}</span>
                    <sub class="leading-none tracking-widest text-gray-400">{{ userData?.email }}</sub>
                </div>
            </div>
        </template>
        
        <ul class="list-none p-1 m-0">
            <li v-for="item in items" :key="item.label">
                <a
                    class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple"
                    @click="toggle(item)"
                >
                    <span :class="item.color" class="mr-3 material-symbols-outlined material-symbols-font-300">
                        {{ item.icon }}
                    </span>
                    <span :class="routeName === item.name ? 'font-bold' : ''" class="font-light text-surface-700 dark:text-white tracking-wider">
                        {{ item.label }}
                    </span>
                    <span v-if="item.items" class="ml-auto material-symbols-outlined text-surface-700 dark:text-white">
                        {{ item.expanded ? 'expand_less' : 'expand_more' }}
                    </span>
                </a>
                <transition name="fade">
                    <ul v-if="item.items && item.expanded" class="pl-8">
                        <li v-for="subItem in item.items" :key="subItem.label">
                            <a
                                class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple"
                            >
                                <span :class="subItem.color" class="mr-3 material-symbols-outlined material-symbols-font-300">
                                    {{ subItem.icon }}
                                </span>
                                <span class="font-medium text-surface-700 dark:text-white tracking-wider">
                                    {{ subItem.label }}
                                </span>
                            </a>
                        </li>
                    </ul>
                </transition>
            </li>
        </ul>

        <template #footer>
            <div class="flex items-center mb-3 justify-between gap-2">
                <label>Lingua </label>
                <LanguageSwitcher />
            </div>
            <div class="flex items-center mb-6 justify-between gap-2">
                <label>Modalità </label>
                <ToggleTheme />
            </div>
            <div class="flex items-center gap-2">
                <Button label="Logout" icon="pi pi-sign-out" class="flex-auto" severity="danger" text></Button>
            </div>
        </template>

    </Drawer>

</template>

<script setup>

    // based imports
    import { ref, computed } from "vue";
    import { useRoute } from 'vue-router';

    // services imports
    import { useDark } from '@vueuse/core';
    import { isMobile } from 'mobile-device-detect';

    // store imports
    import { useAuthStore } from '@/stores/auth.js';
    
    // components imports
    import ToggleTheme from '@/components/reusable/ToggleTheme.vue';
    import LanguageSwitcher from '@/components/reusable/LanguageSwitcher.vue';

    // dichiaro una variabile per il dark
    const isDark = useDark();

    // dichiaro la route
    const route = useRoute();
    const routeName = ref(route.name);

    // dichiaro una variabile statica per i test di login
    const isLoggedIn = computed(() => useAuthStore().getAuthStatus);
    const userData = computed(() => useAuthStore().getUser);

    // definisco gli oggetti per la sidebar
    const visible = ref(false);
    const items = ref([
        {
            label: 'Home',
            icon: 'home',
            name: 'home',
            color: 'text-green-500'
        },
        {
            label: 'Ordini',
            icon: 'mintmark',
            color: 'text-purple-500',
            items: [
                {
                    label: 'I tuoi ordini',
                    icon: 'dashboard',
                    name: 'orders',
                    color: 'text-purple-500'
                }
            ]
        },
        {
            label: 'Clienti',
            icon: 'group',
            color: 'text-orange-500'

        }
    ]);

    // funzione per il toggle
    function toggle(item) {
        if (item.items) {
            item.expanded = !item.expanded;
        }
    }

</script>

<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s;
    }
    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>