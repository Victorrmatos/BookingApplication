<template>

    <StepIndicator class="step-indicator pt-5" :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" />
    <div class="columns">
        <div class="column is-one-third">

            <div class="card transparent-70 ml-5 mr-5" :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }">
                <div class="card-content avatar-card-content has-text-centered">
                    <figure class="image avatar-figure is-inline-block is-256x256">
                        <img class="is-rounded has-background-dark" :src="avatarUrl">
                    </figure>
                    <div class="text avatar-text mt-5" @click="threeClicks">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum perspiciatis ea ullam commodi asperiores.
                    </div>
                </div>
            </div>
            
        </div>
        <div class="column">
            <progress
            v-if="!storeServices.servicesLoaded"
            class="progress is-large is-dark ml-5 mr-5"
            max="100"
            />
            <template v-else>
                <div class="services">
                    <RouterLink
                    to="/date">
                    <div
                    v-for="service in storeServices.services"
                    :key="service.id"
                    class="card mb-4 transparent-70 ml-5 mr-5"
                    @click="selectedService(service.name, service.duration)"
                    :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }"
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
    </template>
</div>

</div>

</template>

<script setup>
/*
imports
*/
import { ref, computed, onMounted } from 'vue'
import { useStoreServices } from '@/stores/storeServices'
import { useStoreBookings } from '@/stores/storeBookings';
import { useRouter } from 'vue-router';
import StepIndicator from '@/components/Layout/StepIndicator.vue'
import { useStoreColors } from '@/stores/storeColors.js';

/*
appearance
*/
const storeColors = useStoreColors();


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

const avatarUrl = ref('https://bulma.io/images/placeholders/128x128.png'); // Default avatar URL


onMounted(async () => {
    await storeColors.getAvatarUrl();
    avatarUrl.value = storeColors.avatarImageUrl;
});

</script>

<style>
.right{
    text-align: right;
}
.text, img, image, figure, label, .step-indicator {
    user-select: none;
}

@media screen and (max-width: 768px) {
  .avatar-card-content {
    display: flex;
    align-items: center; /* Align items vertically in the center */
    justify-content: center; /* Center items horizontally */
}
  }
  .avatar-figure, .avatar-text {
    flex: 1; /* Each child takes equal space */


  }
  .avatar-text {
    margin-right: 20px;
  }

</style>