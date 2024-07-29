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
        <div class="lg:col-span-7 flex items-center justify-center flex-col gap-4 md:gap-6 lg:gap-12">

            <!-- Block Maiusc active -->
            <Message severity="warn" v-if="capsLockOn" closable class="w-full">{{ $t('general.block_maiusc_active') }}</Message>

            <!-- Form -->
            <FormGenerator :fields="formModel" :tKey="'forms'" class="w-full" :btnSave="{ label: 'general.login' }" @submit="onSubmit" />
        </div>

    </WrapperLayout>
</template>

<script setup>

    // base imports
    import { ref, inject } from 'vue';

    // error handler import
    import { executeFormWithGlobalErrorHandling } from '@/helpers/errorHandler';

    // store imports
    import { useAuthStore } from '@/stores/auth.js';

    // import http service
    const HttpService = inject('HttpService');

    // definisco la variabile per il caps lock e la funzione per controllarlo
    const capsLockOn = ref(false);
    const checkCapsLock = (event) => {
        capsLockOn.value = event?.getModifierState && event.getModifierState('CapsLock');
    };

    // definisco il modello per il form
    const formModel = ref({
        email: {
            key: "email",
            label: ['forms.email.label', 'general.user' ],
            placeholder: "email.placeholder",
            model: null,
            type: "text",
            bind: {
                onkeydown: checkCapsLock
            },
            rules: 'required|email',
            localTranslate: true
        },
        password: {
            key: "password",
            label: "password.label",
            placeholder: "password.placeholder",
            model: null,
            type: "password",
            bind: {
                toggleMask: true,
                feedback: false,
                onkeydown: checkCapsLock
            },
            rules: 'required|min:6',
        }
    });

    const onSubmit = executeFormWithGlobalErrorHandling(async (values) => {

        // effettuo la chiamata
        const response = await HttpService.post('login', values?.event);

        // controllo che response?.data sia un tipo stringa
        if (typeof response?.data !== 'string') {
            throw new Error('Invalid response.data');
        }

        // setto il token
        useAuthStore().setToken(response?.data);

        // recupero i dati dell'utente
        const userData = useAuthStore().getUser;

        console.log(userData);
    });

</script>