
<template>
    <Toolbar class="!py-1 lg:!py-2 w-full !px-6 !rounded-none sticky top-0 mx-auto z-50 transition-all">
        
        <template #start>
            <div class="flex items-center gap-2">
                
                <!-- Logo Azienda -->
                <img :src="`//cdn.momap.it/branding/logos/${isDark ? 'logo' : 'logo_red'}.svg`" alt="MoMap" class="w-20 lg:w-28" lazy>

                <!-- Voci del menu -->
                <div class="hidden lg:inline-flex gap-2">
                    <Button label="Files" text plain />
                    <Button label="Edit" text plain />
                    <Button label="View" text plain />
                </div>

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

    // components imports
    import ToggleTheme from '@/components/reusable/ToggleTheme.vue';
    import LanguageSwitcher from '@/components/reusable/LanguageSwitcher.vue';

    // primevue imports
    import Toolbar from 'primevue/toolbar';
    import Button from 'primevue/button';
    import Avatar from 'primevue/avatar';

    // dichiaro una variabile per il dark
    const isDark = useDark();

</script>
