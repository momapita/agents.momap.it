<template>
    <WrapperLayout>

        <!-- Immagine -->
        <div class="flex items-center justify-center lg:col-span-5">
            <img 
                src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                class="w-full object-contain h-full"
                lazy
                alt="Phone image"
            />
        </div>

        <!-- Form -->
        <div class="lg:col-span-7 flex items-center justify-center">
            <FormGenerator :fields="formModel" @onSave="onSave" class="w-full" />
        </div>

    </WrapperLayout>
</template>

<script setup>

    // base imports
    import { ref } from 'vue';
    import * as yup from "yup";

    // definisco il modello per il form
    const formModel = ref({
        email: {
            key: "email",
            label: "Email",
            placeholder: "Inserisci l'email del tuo account",
            model: null,
            type: "text",
            rules: yup.string().email(()=> 'Email non valida').required(() => 'Campo obbligatorio'),
        },
        password: {
            key: "password",
            label: "Password",
            placeholder: "Inserisci la password del tuo account",
            model: null,
            type: "password",
            bind: {
                toggleMask: true,
                feedback: false
            },
            rules: yup.string().required(() => 'Campo obbligatorio').min(6, () => 'La password deve avere almeno 6 caratteri'),
        }
    });

    const onSave = (event) => {
        console.log(event);
    }

</script>