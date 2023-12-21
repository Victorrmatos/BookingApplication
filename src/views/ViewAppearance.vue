<template>
    <NavBar />
    <h2 class="has-text-white">Colour select:</h2>
    <input type="color" v-model="selectedColor" @change="updateColor">
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useStoreColors } from '@/stores/storeColors'
  import NavBar from '@/components/Layout/NavBar.vue'

  const storeColors = useStoreColors();
  const selectedColor = computed(() => storeColors.selectedColor);
  
  const updateColor = (event) => {
    storeColors.setColor(event.target.value);
  };
  </script>