<template>
  <nav
    class="navbar transparent-70 mb-5"
    aria-label="main navigation"
    role="navigation"
    :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }"
    
  >
  <div class="container is-max-desktop px-2">
      <div class="navbar-brand">
        <div class="navbar-item is-size-4 is-family-monospace"
     :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)'}">
  {{ activePageName }}
</div>

        <a
          @click.prevent="showMobileNav = !showMobileNav"
          class="navbar-burger"
          :class="{ 'is-active' : showMobileNav }"
          aria-expanded="false"
          aria-label="menu"
          data-target="navbarBasicExample"
          role="button"
          :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)'}">

        
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarBasicExample"
        class="navbar-menu"
        :class="{ 'is-active' : showMobileNav }"
        
      >
        <div class="navbar-end" >
          <RouterLink
            to="/"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav" 
            :style="{ backgroundColor: $route.path === '/services' ? 'var(--text-color)' : 'transparent', 
        color: $route.path === '/services' ? 'var(--background-color)' : 'var(--text-color)'}"
     
          >
            New Booking
          </RouterLink>
        
          <RouterLink
            to="/adminServices"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
            :style="{ backgroundColor: $route.path === '/adminServices' ? 'var(--text-color)' : 'transparent', 
        color: $route.path === '/adminServices' ? 'var(--background-color)' : 'var(--text-color)'}"
          >
            Admin Services
          </RouterLink>
          <RouterLink
            to="/adminDates"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
            :style="{ backgroundColor: $route.path === '/adminDates' ? 'var(--text-color)' : 'transparent', 
        color: $route.path === '/adminDates' ? 'var(--background-color)' : 'var(--text-color)'}"
          >
            Admin Dates
          </RouterLink>
          <RouterLink
            to="/clients"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
            style="color: var(--text-color)"
            :style="{ backgroundColor: $route.path === '/clients' ? 'var(--text-color)' : 'transparent', 
        color: $route.path === '/clients' ? 'var(--background-color)' : 'var(--text-color)'}"
          >
            Clients
          </RouterLink>
          <RouterLink
            to="/bookings"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
            :style="{ backgroundColor: $route.path === '/bookings' ? 'var(--text-color)' : 'transparent', 
        color: $route.path === '/bookings' ? 'var(--background-color)' : 'var(--text-color)'}"
          >
            Bookings
          </RouterLink>
          <RouterLink
            to="/appearance"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
            :style="{ backgroundColor: $route.path === '/appearance' ? 'var(--text-color)' : 'transparent', 
        color: $route.path === '/appearance' ? 'var(--background-color)' : 'var(--text-color)'}"
          >
            Appearance
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
/*
  imports
*/

  import { ref, computed, watch } from 'vue'
  import { useStoreColors } from '@/stores/storeColors.js';
  import { useRoute } from 'vue-router';


/*
appearance
*/
const storeColors = useStoreColors();

/*
  mobile nav
*/

  const showMobileNav = ref(false)
  const toggleMobileNav = () => {
if (window.innerWidth <= 1023) {
  showMobileNav.value = !showMobileNav.value
}
}
const route = useRoute();
const activePageName = ref('Booking App'); // Default page name


const updateActivePageName = () => {
  switch (route.path) {
    case '/': activePageName.value = 'New Booking'; break;
    case '/adminServices': activePageName.value = 'Admin Services'; break;
    case '/adminDates': activePageName.value = 'Admin Dates'; break;
    case '/clients': activePageName.value = 'Clients'; break;
    case '/bookings': activePageName.value = 'Bookings'; break;
    case '/appearance': activePageName.value = 'Appearance'; break;
    default: activePageName.value = 'Booking App';
  }
};

watch(() => route.path, updateActivePageName, { immediate: true });



</script>


<style scoped>
@media (max-width: 1023px) {
  .navbar-menu {
    position: absolute;
    left: 0;
    width: 100%;
    
  }
  .navbar-item {
    color: var(--background-color) !important; /* Use your background color variable */
  }
}



</style>