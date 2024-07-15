<template>
  <div class="flex flex-col min-h-screen">
    <ToolBar />
    <div class="grow py-4 px-2 lg:px-4">
      <RouterView />
    </div>
    <BottomNavigation class="lg:!hidden" />
  </div>
</template>

<script setup>

  // navigations components imports
  import ToolBar from '@/components/navigations/ToolBar.vue';
  import BottomNavigation from '@/components/navigations/BottomNavigation.vue';

</script>