<template>
    <div class="steps-indicator mb-3">
      <template v-for="(step, index) in steps">
        <router-link
          v-if="index <= maxStep"
          :key="`active-${step}`"
          :to="getRouteForStep(index)"
          class="step-bar"
          :class="{ 'is-active': index === currentStep }"
        ></router-link>
        <div
          v-else
          :key="`disabled-${step}`"
          class="step-bar is-disabled"
        ></div>
      </template>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  const props = defineProps({
    totalSteps: {
      type: Number,
      required: true
    },
    currentStep: {
      type: Number,
      required: true
    },
    maxStep: { // The furthest step the user has reached
      type: Number,
      required: true
    }
  });
  
  const steps = computed(() => Array.from({ length: props.totalSteps }, (_, i) => i));
  const router = useRouter();
  
  const getRouteForStep = (index) => {
    const routes = ['/', '/date', '/form', '/confirmation'];
    return routes[index] || '/';
  };
  </script>
  
  <style scoped>
  .steps-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 30px;
    margin: 0 auto;
    background: none;
  }
  
  .step-bar {
    width: 60px;
    height: 30px;
    border-radius: 15px;
    background-color: rgba(91, 91, 91, 0.45);
    margin: 5px;
    text-decoration: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .step-bar.is-active {
    background-color: white;
  }
  
  .step-bar.is-disabled {
    background-color: #ccc;
    pointer-events: none; /* Disable click events */
  }
  </style>
  