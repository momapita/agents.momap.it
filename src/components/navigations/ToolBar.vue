
<template>
    <Toolbar class="!py-1 lg:!py-2 w-full !px-6 !rounded-none sticky top-0 mx-auto z-50 transition-all">
        
        <template #start>
            <div class="flex items-center gap-2">

                <!-- Titolo Pagina Corrente -->
                <div class="font-semibold tracking-wider lg:text-lg">
                    {{ $te(`headers.${route.name}.title`) ? $t(`headers.${route.name}.title`) : route.name }}
                </div>

                <img :src="`//cdn.momap.it/branding/logos/${isDark ? 'logo' : 'logo_red'}.svg`" alt="MoMap" class="w-20 lg:w-28 hidden lg:block" lazy>

            </div>
        </template>

        <template #end>
            <div class="flex items-center gap-2">
                <ToggleTheme />
                <LanguageSwitcher />
                <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="w-8 h-8" />
            </div>
        </template>

    </Toolbar>
</template>

<script setup>

    // services imports
    import { useDark } from '@vueuse/core';
    import { useRoute } from 'vue-router';

    // components imports
    import ToggleTheme from '@/components/reusable/ToggleTheme.vue';
    import LanguageSwitcher from '@/components/reusable/LanguageSwitcher.vue';

    // dichiaro una variabile per il dark
    const isDark = useDark();

    // dichiaro la route
    const route = useRoute();

</script>
