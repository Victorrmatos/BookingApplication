<template>
      <StepIndicator class="step-indicator" :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" />

    <div class="columns">
        <div class="column is-one-third">
            <div class="card is-dark transparent-70">
                <div class="card-content has-text-centered">
                    <figure class="image is-inline-block is-128x128">
                        <img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png">
                    </figure>
                    <div class="text mt-5" @click="threeClicks">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum perspiciatis ea ullam commodi asperiores.
                    </div>
                </div>
            </div>
            
        </div>
        <div class="column">
            <div class="services">
                <RouterLink
                to="/date">
                <div
                v-for="service in storeServices.services"
                :key="service.id"
                class="card mb-4 is-dark transparent-70"
                @click="selectedService(service.name, service.duration)"
                
                >
                <div class="card-content">
                    <div class="content">
                        <div class="columns">
                            <div class="column left">
                                <label>{{ service.name }}</label>
                            </div>
                            <div class="column right">
                                <label>Є {{ service.price }}</label>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </RouterLink>
    </div>
    
</div>

</div>

</template>

<script setup>
/*
imports
*/
import { ref, computed } from 'vue'
import { useStoreServices } from '@/stores/storeServices'
import { useStoreBookings } from '@/stores/storeBookings';
import { useRouter } from 'vue-router';
import StepIndicator from '@/components/Layout/StepIndicator.vue'
import { useStoreColors } from '@/stores/storeColors.js';

/*
appearance
*/
const storeColors = useStoreColors();
const selectedColor = computed(() => storeColors.selectedColor)


/*
router
*/
const router = useRouter();

/*
store
*/
const storeServices = useStoreServices()
const storeBookings = useStoreBookings()

/*
step indicator
*/
const currentStep = ref(0); // Update this value based on your application logic
const maxStepReached = ref(0); // Example max step reached by the user

/*
service selection
*/

const selectedService = (serviceName, duration) => {
    // Create a new booking object
    const newBooking = {
        service: serviceName,
        duration: duration,
    };
    
    // Assign new booking to storeBookings
    storeBookings.newBooking = newBooking;


}

const clickCount = ref(0);
const threeClicks = () => {
  clickCount.value++;

  if (clickCount.value === 3) {
    router.push('/adminServices');
  }
};
</script>

<style>
.right{
    text-align: right;
}
.text, img, image, figure, label, .step-indicator {
    user-select: none;
}

</style>