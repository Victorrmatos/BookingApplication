<template>
    <div>
    
       <VDatePicker
            v-model="date"
            :attributes='$attrs'
            :min-date="new Date()"
            mode="date"
            style="width:100%"
            />
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedDate: null,
      };
    },
    methods: {
      onDateSelected() {
        this.$emit('date-selected', this.selectedDate);
      },
    },
  };
  </script>
  