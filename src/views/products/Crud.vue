<template>
    <FormGenerator
        ref="formRef"
        class="w-full"
        :tKey="'table'"
        :fields="formModel"
        :key="formKey"
        :blocked="blocked"
        @submit="onSubmit"
    />
</template>

<script setup>
    
    // based imports
    import { inject, onMounted, ref, computed, nextTick } from "vue";

    // Middleware and error handler import and services
    import Middleware from '@/router/middleware.js';
    import { executeWithGlobalErrorHandling, executeFormWithGlobalErrorHandling } from '@/helpers/errorHandler';

    // services and models imports
    import { fillFormModel } from "@/helpers/form.js"; 

    // recupero il riferimento del dialog globale
    const dialogRef = inject('dialogRef');

    // http service
    const HttpService = inject('HttpService');

    // definisco il modello per il form
    const formModel = ref({
        pr__product_id: {
            key: "pr__product_id",
            label: "pr__product_id",
            placeholder: "pr__product_id",
            model: null,
            type: "text",
            notShow: true
        },
        pr__fatt_api_code: {
            key: "pr__fatt_api_code",
            label: "pr__fatt_api_code",
            placeholder: "pr__fatt_api_code",
            model: null,
            type: "number",
            rules: 'required',
        },
        pr__fatt_api_name: {
            key: "pr__fatt_api_name",
            label: "pr__fatt_api_name",
            placeholder: "pr__fatt_api_name",
            model: null,
            type: "text",
            rules: 'required',
        },
        pr__fatt_api_net_price: {
            key: "pr__fatt_api_net_price",
            label: "pr__fatt_api_net_price",
            placeholder: "pr__fatt_api_net_price",
            model: null,
            type: "number",
            bind: {
                mode: "currency",
                currency: "EUR",
                locale: "it-IT",
                min: 0,
                max: 1000000
            },
            rules: 'required|min:0|max:1000000',
        },
        pr__fatt_api_description: {
            key: "pr__fatt_api_description",
            label: "pr__fatt_api_description",
            placeholder: "pr__fatt_api_description",
            model: null,
            type: "text"
        },
        pr__fatt_api_category: {
            key: "pr__fatt_api_category",
            label: "pr__fatt_api_category",
            placeholder: "pr__fatt_api_category",
            model: null,
            type: "text"
        },
        pr__fatt_api_notes: {
            key: "pr__fatt_api_notes",
            label: "pr__fatt_api_notes",
            placeholder: "pr__fatt_api_notes",
            model: null,
            type: "textarea"
        }
    });

    // definisco il formKey, il riferimento e il loading
    const formKey = ref(0);
    const formRef = ref(null);
    const blocked = ref(false);

    // definisco le props derivanti dal dialog e la modalità del crud
    const props = ref(null);
    const addMode = computed(() => props?.value?.mode === 'add');

    // definisco la funzione per riempire il modello in modifica
    const fillModelEdit = executeWithGlobalErrorHandling(async () => {
        
        if(addMode.value === null || addMode.value === undefined || addMode.value === true) {
            throw new Error('addMode non trovato oppure true');
        }

        if(!props?.value){
            throw new Error('data non trovata');
        }

        const { pr__product_id: id = null } = props?.value?.event;
    
        // controllo che esista id
        if(!id || parseInt(id) <= 0 || isNaN(parseInt(id)) || parseInt(id) === undefined) {
            throw new Error('id non trovato');
        }

        // recupero i dati dell'area
        const response = await HttpService.get(`products/${id}`);

        // setto i dati nel modello
        formModel.value = fillFormModel(formModel, response.data);

    }, false);

    // definisco la funzione per il submit
    const onSubmit = executeFormWithGlobalErrorHandling(async (values) => {

        // setto il loading a true
        blocked.value = true;

        if(!Middleware.hasPermission('admin')) {
            throw new Error('Non hai i permessi per eseguire questa azione');
        }

        // recupero event
        const { event } = values;

        console.log("onSubmit", event);

        /* invio la richiesta per inserimento o modifica
        obj?.pr__product_id ? await HttpService.put('products', event) : await HttpService.post('products', event);

        // setto il loading a false
        blocked.value = false;

        // chiudo il dialog
        dialogRef.value.close();

        // ricarico la tabella 
        props?.value?.tableRef && props?.value?.tableRef.reload();*/
        
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