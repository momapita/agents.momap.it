<template>
  
  <!-- Toast component -->
  <ToastWrapper />

  <!-- Dinamic Dialog component -->
  <DynamicDialogWrapper />

  <!-- Main component -->
  <div class="flex flex-col h-screen">
    <ToolBar/>
    <div class="grow py-4 px-2 lg:px-6 overflow-y-auto overflow-x-hidden">
      <RouterView/>
    </div>
    <BottomNavigation v-if="isLoggedIn" class="lg:!hidden" />
  </div>

</template>

<script setup>

  // based imports
  import { ref, onMounted } from 'vue';

  // services imports
  import { useDark } from '@vueuse/core';

  // import Toast component
  import ToastWrapper from '@/components/reusable/ToastWrapper.vue';

  // import Dinamic Dialog component
  import DynamicDialogWrapper from '@/components/reusable/DinamicDialogWrapper.vue';

  // navigations components imports
  import ToolBar from '@/components/navigations/ToolBar.vue';
  import BottomNavigation from '@/components/navigations/BottomNavigation.vue';

  // dichiaro una variabile statica per i test di login
  const isLoggedIn = ref(false);

  // hoock di caricamento
  onMounted(() => {
    useDark();
  });

</script>