import { defineStore } from 'pinia';

export const useStoreColors = defineStore('storeColors', {
  state: () => ({
    selectedColor: '#ffffff', // default color
  }),
  actions: {
    setColor(color) {
      this.selectedColor = color;
    }
  }
});