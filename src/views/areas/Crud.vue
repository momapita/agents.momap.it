<template>
    <div>
        <FormGenerator :fields="formModel" :key="formKey" :tKey="'table'" class="w-full" @submit="onSubmit" />
    </div>
</template>

<script setup>
    
    // based imports
    import { inject, onMounted, ref, computed, nextTick } from "vue";

    // error handler import and services
    import { executeWithGlobalErrorHandling, executeFormWithGlobalErrorHandling } from '@/helpers/errorHandler';

    // services and models imports
    import formModels from "./models";
    import { fillFormModel, resetFormModel } from "@/helpers/form.js"; 

    // recupero il riferimento del dialog globale
    const dialogRef = inject('dialogRef');

    // http service
    const HttpService = inject('HttpService');

    // definisco il modello per il form e il riferimento
    const formModel = ref(formModels);
    const formKey = ref(0);

    // definisco le props derivanti dal dialog e la modalità del crud
    const props = ref(null);
    const addMode = computed(() => props?.value?.mode === 'add');

    // definisco la funzione per il reset del formModel
    const reinitFormModel = async () => {
        formModel.value = resetFormModel(formModel);
        formKey.value += 1;
    };

    // definisco la funzione per riempire il modello in modifica
    const fillModelEdit = executeWithGlobalErrorHandling(async () => {
        
        if(addMode.value === null || addMode.value === undefined || addMode.value === true) {
            throw new Error('addMode non trovato oppure true');
        }

        if(!props?.value){
            throw new Error('data non trovata');
        }

        const { ar__area_id: id = null } = props?.value?.event;
    
        // controllo che esista id
        if(!id || parseInt(id) <= 0 || isNaN(parseInt(id)) || parseInt(id) === undefined) {
            throw new Error('id non trovato');
        }

        // recupero i dati dell'area
        const response = await HttpService.get(`areas/${id}`);

        // setto i dati nel modello
        formModel.value = fillFormModel(formModel, response.data);

    }, false);

    // definisco la funzione per il submit
    const onSubmit = executeFormWithGlobalErrorHandling(async (values) => {
        console.log(values);
    });

    onMounted(async () => {
        try {

            // aspetto che il dialog venga renderizzato
            await nextTick();

            // setto i dati nelle props
            props.value = dialogRef?.value?.data || null;

            // riempio il modello in base di addMode
            addMode.value != true && await fillModelEdit();

            // incremento il formKey
            formKey.value += 1;

        } catch (error) {
            console.error(error);
        }
    });

</script>