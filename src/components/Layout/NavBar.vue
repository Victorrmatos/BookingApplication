<template>
  <nav
    class="navbar is-dark transparent-80 mb-5"
    aria-label="main navigation"
    role="navigation"
  >
    <div class="container is-max-desktop px-2">
      <div class="navbar-brand">
        <div class="navbar-item is-size-4 is-family-monospace">
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
        <div class="navbar-end">
          <RouterLink
            to="/"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
          >
            Services
          </RouterLink>
          <RouterLink
            to="/date"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
          >
            Date
          </RouterLink>
          <RouterLink
            to="/form"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
          >
            Form
          </RouterLink>
          <RouterLink
            to="/confirmation"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
          >
            Confirmation
          </RouterLink>
          <RouterLink
            to="/adminServices"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
          >
            Admin Services
          </RouterLink>
          <RouterLink
            to="/adminDates"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
          >
            Admin Dates
          </RouterLink>
          <RouterLink
            to="/clients"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
          >
            Clients
          </RouterLink>
          <RouterLink
            to="/bookings"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
          >
            Bookings
          </RouterLink>
          <RouterLink
            to="/appearance"
            class="navbar-item"
            active-class="is-active"
            @click.prevent="toggleMobileNav"
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