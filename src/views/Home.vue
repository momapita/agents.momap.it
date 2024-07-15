<template>
    <div>
        <FormGenerator :fields="formModel" @onSave="onSave" />
    </div>
</template>

<script setup>

    // base imports
    import { ref } from 'vue';
    import * as yup from "yup";

    // definisco il modello per il form
    const formModel = ref({
        du_id: {
            key: "du_id",
            label: "du_id",
            placeholder: "du_id",
            model: null,
            type: "toggle",
            bind: {
                onLabel: "Attivo",
                offLabel: "Disattivo",
            },
            notShow: false
        },
        du_object_id: {
            key: "du_object_id",
            label: "du_object_id",
            placeholder: "du_object_id",
            model: null,
            type: "dropdown",
            bind: {
                filter: true,
                showClear: true,
                optionLabel: "go_name",
                optionValue: "go_imei",
                filterFields: ['go_name', 'go_imei'],
                display: "chip",
                options: [
                    { go_name: 'test name', go_imei: 'test' },
                    { go_name: 'test name 2', go_imei: 'test 2' },
                    { go_name: 'test name 3', go_imei: 'test 3' }
                ]
            },
            rules: yup.mixed().required(() => 'Campo obbligatorio'),
        },
        du_matricola_atac: {
            key: "du_matricola_atac",
            label: "du_matricola_atac",
            placeholder: "du_matricola_atac",
            type: "number",
            model: null,
            rules: yup.string().required(() => 'Campo obbligatorio')
        }
    });

    const onSave = (event) => {
        console.log(event);
    }

</script>