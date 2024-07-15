<template>
    <div>
        test123: {{ cdnUrl }}
    </div>
</template>

<script setup>
    import { inject } from 'vue';

    // Inietta la variabile cdnUrl
    const cdnUrl = inject('cdnUrl');

</script>