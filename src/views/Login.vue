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
            <FormGenerator :fields="formModel" :tKey="'forms'" class="w-full" :btnSave="{ label: 'general.login' }" @submit="onSubmit" />
        </div>

    </WrapperLayout>
</template>

<script setup>

    // base imports
    import { ref, inject } from 'vue';
    import * as yup from "yup";
    import { useI18n } from "vue-i18n";

    // error handler import
    import { executeFormWithGlobalErrorHandling } from '@/helpers/errorHandler';

    // definisco la lingua
    const { t } = useI18n();

    // import http service
    const HttpService = inject('HttpService');

    // definisco il modello per il form
    const formModel = ref({
        email: {
            key: "email",
            label: ['forms.email.label', 'general.user' ],
            placeholder: "email.placeholder",
            model: null,
            type: "text",
            rules: yup.string().email(()=> t('forms.email.validate')).required(() => t('forms.required')),
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
                feedback: false
            },
            rules: yup.string().required(() => t('forms.required')).min(6, () => t('forms.password.validate')),
        }
    });

    const onSubmit = executeFormWithGlobalErrorHandling(async (values) => {
        const response = await HttpService.post('login', values?.event);
        console.log(response);
    });

</script>