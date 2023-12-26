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
        :style="{ color: 'var(--text-color)'}">
          BookingApp
        </div>

        <a
          @click.prevent="showMobileNav = !showMobileNav"
          class="navbar-burger"
          :class="{ 'is-active' : showMobileNav }"
          aria-expanded="false"
          aria-label="menu"
          data-target="navbarBasicExample"
          role="button"
        >
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
            :style="{ color: 'var(--text-color)'}"
          >
            New Booking
          </RouterLink>
        
          <RouterLink
            to="/adminServices"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
            :style="{ color: 'var(--text-color)'}"
          >
            Admin Services
          </RouterLink>
          <RouterLink
            to="/adminDates"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
            :style="{ color: 'var(--text-color)'}"
          >
            Admin Dates
          </RouterLink>
          <RouterLink
            to="/clients"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
            :style="{ color: 'var(--text-color)'}"
          >
            Clients
          </RouterLink>
          <RouterLink
            to="/bookings"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
            :style="{ color: 'var(--text-color)'}"
          >
            Bookings
          </RouterLink>
          <RouterLink
            to="/appearance"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
            :style="{ color: 'var(--text-color)'}"
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

  import { ref, computed } from 'vue'
  import { useStoreColors } from '@/stores/storeColors.js';


/*
appearance
*/
const storeColors = useStoreColors();
const selectedColor = computed(() => storeColors.selectedColor)

/*
  mobile nav
*/

  const showMobileNav = ref(false)
  const toggleMobileNav = () => {
if (window.innerWidth <= 1023) {
  showMobileNav.value = !showMobileNav.value
}
}
</script>

<style>

@media (max-width: 1023px) {
  .navbar-menu {
    position: absolute;
    left: 0;
    width: 100%;
  }
}
</style>