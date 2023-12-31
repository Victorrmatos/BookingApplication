<template>
  <div :style="{ backgroundImage: 'url(' + storeColors.backgroundImageUrl + ')' }" class="app-container">
    <div class="container"> 

    <RouterView />
    </div>  
  </div>
</template>

  <script setup>
  /*
  imports
  */
  import { useStoreDateTime } from '@/stores/storeDateTime'
  import { useStoreBookings } from '@/stores/storeBookings';
  import { useStoreServices } from '@/stores/storeServices';
  import { onMounted, computed, watch, ref, watchEffect } from 'vue'
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
  const backgroundImageUrl = ref(''); // Define a ref for the background image URL

  /*
  mounted
  */
  
onMounted(async () => {
  storeServices.getServices();
  storeDateTime.getStdWeek();
  storeDateTime.getCustomDays();
  storeBookings.getBookings();
  storeClients.getClients();
  await storeColors.getAvatarUrl();
  await storeColors.getBackgroundUrl();
  storeColors.getColors() 
  storeColors.getAvatarText()
});



watchEffect(() => {
  document.documentElement.style.setProperty('--text-color', storeColors.textColor);
  document.documentElement.style.setProperty('--background-color', storeColors.backgroundColor);
});

const backgroundStyle = computed(() => ({
  backgroundImage: `url('${backgroundImageUrl.value}')`, // Use the ref here
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  height: '100vh',
}));


watch(() => storeColors.backgroundImageUrl, (newUrl) => {
  backgroundImageUrl.value = newUrl;
});


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

  .app-container {
  min-height: 100vh;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: #999;
}


html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: #999;
  max-width: 100%;
  height: auto;
}

.card, button {
    border: 1px solid var(--text-color);
}
  </style>