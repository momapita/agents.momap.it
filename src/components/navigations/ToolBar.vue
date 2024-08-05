
<template>

    <Toolbar class="w-full !py-4 !px-3 lg:!px-6 !rounded-none sticky top-0 mx-auto z-50 transition-all">
        
        <template #start>

            <!-- utente loggato -->
            <template v-if="isLoggedIn">
                <span class="material-symbols-outlined material-symbols-font-300 cursor-pointer" @click="visible = true"> menu </span>
                <div class="font-semibold tracking-wider lg:text-lg ml-2 lg:ml-4">
                    {{ $te(`headers.${route.name}.title`) ? $t(`headers.${route.name}.title`) : route.name }}
                </div>
            </template>

            <!-- utente non loggato -->
            <template v-else>
                <img :src="`//cdn.momap.it/branding/logos/${isDark ? 'logo' : 'logo_red'}.svg`" alt="MoMap" class="w-20 lg:w-24" lazy>
            </template>
        
        </template>

        <template #center>
            <div v-if="isLoggedIn" class="hidden lg:block">
                <BottomNavigation />
            </div>
        </template>

        <template #end>
            <div class="flex items-center justify-center flex-1 gap-4">

                <div v-if="isLoggedIn">
                    <img :src="`//cdn.momap.it/branding/logos/${isDark ? 'logo' : 'logo_red'}.svg`" alt="MoMap" class= "w-20 lg:w-24" lazy>
                </div>

                <!-- cambio lingua -->
                <template v-if="!isLoggedIn">
                    <LanguageSwitcher />
                    <ToggleTheme :size="'xs'" />
                </template>

             </div>
        </template>

    </Toolbar>

    <Drawer v-model:visible="visible" v-if="isLoggedIn">
        
        <!-- Template header -->
        <template #header>
            <div class="flex items-center gap-2">

                <!-- Button Logout @click="logout"-->
                <Button 
                    icon="pi pi-sign-out"
                    class="flex-auto"
                    severity="danger"
                    v-tooltip.top="$t('general.logout')"
                    text
                    @click="useAuthStore().logout()"
                />

                <!-- Informazioni utente -->
                <div class="flex flex-col justify-center" v-if="userData != null">
                    <span class="font-light tracking-wider leading-none">{{ userData?.name }} {{ userData?.last_name }}</span>
                    <sub class="leading-none tracking-widest text-gray-400">{{ userData?.email }}</sub>
                </div>

            </div>
        </template>

        <!-- Template body -->
        <section name="body" class="overflow-y-auto max-h-full" v-if="items && Array.isArray(items) && items.length > 0">
            <ul class="overflow-y-auto max-h-full space-y-3">
                <template v-for="(item, index) in items" :key="index">

                    <!-- Controllo se esistono figli ad item -->
                    <template v-if="item?.items && Array.isArray(item?.items)">
                        
                        <!-- sezione per apertura/chiusura del menu a discesa -->
                        <li>
                            <div 
                                v-ripple
                                class="py-3 flex items-center justify-between text-surface-600 dark:text-surface-300 cursor-pointer p-ripple" 
                                @click="toggleSection(item)"
                            >
                                <span class="font-medium" v-if="item?.label">{{ item?.label }}</span>
                                <span class="material-symbols-outlined"> {{ item?.expanded ? 'expand_less' : 'expand_more' }} </span>
                            </div>

                            <!-- ul per i figli -->
                            <transition name="fade">
                                <ul class="list-none py-2 m-0 overflow-hidden space-y-2" v-if="item?.expanded">
                                    <AppLink 
                                        v-for="(subItem, subIndex) in item?.items"
                                        :key="subIndex"
                                        v-ripple
                                        :to="subItem?.name"
                                        class="duration-150 transition-colors p-ripple"
                                    >
                                        <!-- Icona -->
                                        <span v-if="subItem?.icon" :class="subItem?.class || ''" class="material-symbols-outlined material-symbols-font-300">
                                            {{ subItem.icon }}
                                        </span>
                                        <!-- Label -->
                                        <span class="font-light tracking-wider" v-if="subItem?.label"> {{ subItem?.label }} </span>
                                    </AppLink>
                                </ul>
                            </transition>
                        </li>

                    </template>

                    <!-- Renderizzo item -->
                    <template v-else>
                        <li>
                            <AppLink 
                                v-ripple
                                :to="item?.name"
                                class="duration-150 transition-colors p-ripple"
                            >
                                <!-- Icona -->
                                <span v-if="item?.icon" :class="item?.class || ''" class="mr-3 material-symbols-outlined material-symbols-font-300">
                                    {{ item?.icon }}
                                </span>
                                <!-- Label -->
                                <span class="font-light tracking-wider" v-if="item?.label"> {{ item?.label }} </span>
                            </AppLink>
                        </li>
                    </template>

                </template>

            </ul>
        </section>

        <!-- Template footer -->
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
                <img :src="`//cdn.momap.it/branding/logos/${isDark ? 'logo' : 'logo_red'}.svg`" alt="MoMap" class="opacity-50 w-28 py-1.5 mx-auto" lazy>
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
    import { executeWithGlobalErrorHandling } from '@/helpers/errorHandler';

    // store imports
    import { useAuthStore } from '@/stores/auth.js';
    
    // components imports
    import ToggleTheme from '@/components/reusable/ToggleTheme.vue';
    import LanguageSwitcher from '@/components/reusable/LanguageSwitcher.vue';
    import BottomNavigation from '@/components/navigations/BottomNavigation.vue';

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
        },
        {
            label: 'Ordini',
            icon: 'mintmark',
            name: 'notFound',
            items: [
                {
                    label: 'I tuoi ordini',
                    icon: 'dashboard',
                    name: 'notFound'
                },
                {
                    label: 'Test123',
                    icon: 'dashboard',
                    name: 'https://www.momap.it/clienti'
                }
            ]
        },
        {
            label: 'Clienti',
            name: 'https://www.momap.it/clienti' 
        }
    ]);

    // funzione per il toggle
    const toggleSection = executeWithGlobalErrorHandling(async (item) => {
        
        if(!item || typeof item !== 'object' || Object.keys(item).length === 0) {
            throw new Error("Item not defined");
        }

        // controllo se esiste item.items
        if(item?.items && Array.isArray(item?.items)) {
            item.expanded = !item.expanded;
        }

    }, false);

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