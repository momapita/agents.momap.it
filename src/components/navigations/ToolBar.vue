
<template>
    <!--<Toolbar class="!py-1 lg:!py-2 w-full !px-6 !rounded-none sticky top-0 mx-auto z-50 transition-all">
        
        <template #start>
            <div class="flex items-center gap-2">
                 Titolo Pagina Corrente 
                <div class="font-semibold tracking-wider lg:text-lg">
                    {{ $te(`headers.${route.name}.title`) ? $t(`headers.${route.name}.title`) : route.name }}
                </div>

            </div>
        </template>
        <template #center>
            
        </template>

        <template #end>
            <div class="flex items-center gap-2">
                <ToggleTheme />
                <LanguageSwitcher />
                <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="w-8 h-8" />
            </div>
        </template>

    </Toolbar>-->
    
    <MegaMenu :model="items" class="p-4 bg-surface-0" >
            <template #start>
                    <img :src="`//cdn.momap.it/branding/logos/logo_red_icon.png`" alt="MoMap" class="mx-4 w-10 hidden lg:block" lazy>
            </template>
            <template #item="{ item }">
                <a v-if="item.root" :class="{ 'text-momap font-semibold p-0' : item.name != routeName }" class="flex items-center cursor-pointer px-4 py-2 overflow-hidden relative  text-lg" style="border-radius: 2rem">
                    <span class="material-symbols-outlined material-symbols-font-300">{{ item.icon }}</span>

                    <span  class="ml-2 mt-1 tracking-wider ">{{ item.label }}</span>
                </a>
                <a v-else-if="!item.image" class="flex items-center p-4 cursor-pointer mb-2 gap-3">
                    <span class="inline-flex items-center justify-center rounded-full bg-primary text-primary-contrast w-12 h-12">
                        <i :class="[item.icon, 'text-lg']"></i>
                    </span>
                    <span class="inline-flex flex-col gap-1">
                        <span class="font-bold text-lg">{{ item.label }}</span>
                        <span class="whitespace-nowrap">{{ item.subtext }}</span>
                    </span>
                </a>
                <div v-else class="flex flex-col items-start gap-4 p-2">
                    <img alt="megamenu-demo" :src="item.image" class="w-full" />
                    <span>{{ item.subtext }}</span>
                    <Button :label="item.label" outlined />
                </div>
            </template>
            <template #end>
                <div class="flex items-center flex-row gap-2">
                <div class="font-semibold tracking-widest lg:text-lg">
                    {{ $te(`headers.${route.name}.title`) ? $t(`headers.${route.name}.title`) : route.name }}
                </div>
                <div class="relative inline-block">
                    <Avatar 
                    image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" 
                    class="w-8 h-8 cursor-pointer" 
                    @mouseover="showMenu = true" 
                    @mouseleave="showMenu = false" 
                    @click="toggleMenu"
                    />
                    <transition name="fade">
                        <div 
                            v-if="showMenu" 
                            :class="isDark  ? 'bg-surface-800 border-surface-700' : 'bg-surface-50 border-surface-300' "
                            class="absolute top-10 right-0 w-56 z-10 border  rounded shadow-md p-4 gap-4 flex flex-col"
                            @mouseover="showMenu = true" 
                            @mouseleave="showMenu = false"
                        >
                            <div class="flex items-center justify-between gap-2">
                                <label>Mode: </label>
                                <ToggleTheme />
                            </div>
                            <div class="flex items-center justify-between gap-2">
                                <label>Lang: </label>
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </transition>
                </div>
                </div>
            </template>
        </MegaMenu>
</template>

<script setup>

    // services imports
    import { useDark } from '@vueuse/core';
    import { useRoute } from 'vue-router';
    import { Slide } from 'vue3-burger-menu' 
    // components imports
    import ToggleTheme from '@/components/reusable/ToggleTheme.vue';
    import LanguageSwitcher from '@/components/reusable/LanguageSwitcher.vue';

    // dichiaro una variabile per il dark
    const isDark = useDark();

    // dichiaro la route
    const route = useRoute();
    import { ref } from "vue";
    //ottengo il path corrente
    const routeName = ref(route.name);
    const showMenu = ref(false);

    const toggleMenu = () => {
    showMenu.value = !showMenu.value;
    };
    const items = ref([
        {
            label: 'Home',
            root: true,
            icon: 'home',
            name: 'home'
        
        },
        {
            label: 'Ordini',
            icon: 'mintmark',
            root: true
        },
        {
            label: 'Clienti',
            icon: 'group',
            root: true
        }
    ]);
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>