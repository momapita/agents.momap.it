<template>
    <div>
        {{ $t('forms.email.placeholder') }}
        {{ $n(10000, 'currencyFormat') }}
    </div>
    <DataTableWrapper :pageName="'users'" :contextMenuSelection="contextMenuSelection" />
</template>

<script setup>
    import { ref } from 'vue';


    const contextMenuSelection = ref({
        compactMenu: false,
        show: true,
        frozen: true,
        obj: [
            {
                type: 'edit',
                disabled: false,
                action: (event) => {
                    console.log("edit", event);
                }
            },
            {
                type: 'delete',
                disabled: false,
                action: (event) => {
                    console.log("delete", event);
                }
            },
            {
                type: 'export',
                disabled: false,
                action: (event) => {
                    console.log("export", event);
                }
            },
            {
                type: 'share',
                disabled: false,
                action: (event) => {
                    console.log("share", event);
                }
            }
        ]
    });

</script>