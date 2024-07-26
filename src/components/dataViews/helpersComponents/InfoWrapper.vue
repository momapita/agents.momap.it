<template lang="">
    <div>
        {{ data?.info || 'Nessuna informazione' }}
    </div>
</template>

<script setup>
    
    // based imports
    import { inject, onMounted, ref } from "vue";

    // recupero il riferimento del dialog globale
    const dialogRef = inject('dialogRef');

    const data = ref(null);

    onMounted(() => {
        data.value = dialogRef.value.data;
    });

</script>