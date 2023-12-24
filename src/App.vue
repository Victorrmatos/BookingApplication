<template>
 
  
  <div class="container is-max-desktop px-2 py-4">
    <RouterView />
  </div>
</template>

<script setup>
/*
imports
*/
import { useStoreDateTime } from '@/stores/storeDateTime'
import { useStoreBookings } from '@/stores/storeBookings';
import { useStoreServices } from '@/stores/storeServices';
import { onMounted } from 'vue'
import { useStoreClients } from '@/stores/storeClients';
import { useStoreColors } from '@/stores/storeColors'

/*
store
*/
const storeDateTime = useStoreDateTime()
const storeBookings = useStoreBookings()
const storeServices = useStoreServices()
const storeClients = useStoreClients()
const storeColors = useStoreColors()
/*
mounted
*/
onMounted(() => {
  storeServices.getServices()
  storeDateTime.getStdWeek()
  storeDateTime.getCustomDays()
  storeBookings.getBookings()
  storeClients.getClients()
})


</script>

<style>

@import 'bulma/css/bulma.min.css';
.transparent-70 {
  opacity: 0.9;
}
.transparent-80 {
  opacity: 0.95;
}

* {
  font-size: 18px;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-image: url('@/assets/wallpaperflare.com_wallpaper.jpg');
  background-position: center center;
  background-repeat:  no-repeat;
  background-attachment: fixed;
  background-size:  cover;
  background-color: #999;
  max-width: 100%;
  height: auto;
}


</style>