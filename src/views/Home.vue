<template>
    <div>
        {{ $t('welcome', { user: 'Valentino' }) }}
    </div>
</template>

<script setup>
    import { inject, ref } from 'vue';

    // Inietta la variabile cdnUrl
    const cdnUrl = inject('cdnUrl');
    
    const date = ref(null);
</script>