<template lang="">
    <div>
        {{ infoMessage || 'Nessuna informazione' }}
    </div>
</template>

<script setup>
    
    // based imports
    import { inject, onMounted, ref } from "vue";

    // recupero il riferimento del dialog globale
    const dialogRef = inject('dialogRef');

    const infoMessage = ref(null);

    onMounted(() => {
        infoMessage.value = dialogRef.value.data;
    });

</script>