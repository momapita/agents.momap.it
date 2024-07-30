<template>
    <div :class="sizeComputed" class="flex items-center justify-center rounded-lg p-2 transition-colors duration-200 hover:bg-yellow-100 dark:hover:bg-gray-100 cursor-pointer" @click="toggleDark()">

        <!-- Icona della luna (modalità dark) -->
        <span class="material-symbols-outlined material-symbols-font-600 text-gray-400 !hidden dark:!block"> dark_mode </span>

        <!-- Icona del sole (modalità dark) -->
        <span class="material-symbols-outlined material-symbols-font-600 text-yellow-500 !block dark:!hidden"> light_mode </span>

    </div>
</template>

<script setup>
    
    // import di base
    import { computed } from 'vue';
    import { useDark, useToggle } from '@vueuse/core';

    // definisco le props
    const props = defineProps({
        size: {
            type: String,
            default: 'md',
            validator: (value) => {
                return ['sm', 'md', 'lg', 'xs'].includes(value);
            }   
        }  
    });

    // definisco la classe computed per il size
    const sizeComputed = computed(() => {
        switch (props.size) {
            case "xs": 
                return "w-6 h-6";
            case "sm":
                return "w-8 h-8";
            case "md":
                return "w-10 h-10";
            case "lg":
                return "w-12 h-12";
            default:
                return "w-10 h-10";
        }
    });

    // Dichiaro la variabile per tenere lo state del tema
    const isDark = useDark({
        selector: 'html',
        attribute: 'class',
        valueDark: 'dark',
        valueLight: 'light',
    });

    // dichiaro lo state del tema, da richiamare per il change
    const toggleDark = useToggle(isDark);

</script>