<template>
    <div>
        {{ $t('forms.email.placeholder') }}

        <p>{{ $n(10000, 'currencyFormat') }}</p>
    </div>
</template>

<script setup>
    import { inject, ref } from 'vue';

    // Inietta la variabile cdnUrl
    const cdnUrl = inject('cdnUrl');
    
    const date = ref(null);
</script>