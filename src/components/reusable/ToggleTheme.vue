<template>
    <div class="h-12 w-12 flex items-center justify-center rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-yellow-100 cursor-pointer" @click="toggleDark()">

        <!-- Icona della luna (modalità dark) -->
        <span class="material-symbols-outlined material-symbols-font-600 text-gray-400 !block dark:!hidden"> dark_mode </span>

        <!-- Icona del sole (modalità dark) -->
        <span class="material-symbols-outlined material-symbols-font-600 text-yellow-500 !hidden dark:!block"> light_mode </span>

    </div>
</template>

<script setup>
    
    // import di base
    import { useDark, useToggle } from '@vueuse/core';

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