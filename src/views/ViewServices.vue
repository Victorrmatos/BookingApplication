<template>
    <StepIndicator class="step-indicator pt-5" :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" />
    <div class="columns">
        <div class="column avatar-card is-one-third">
            <div class="box transparent-70 ml-5 mr-5" :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }">
                <div class="card-content avatar-card-content has-text-centered">
                    <figure class="image avatar-figure is-inline-block mt-5 mb-5">
                        <img class="is-rounded avatar-img" :src="avatarUrl">
                    </figure>
                    <div class="text avatar-text mt-5 ml-5 mr-5 mb-5" @click="threeClicks">
                        {{ storeColors.avatarText }}
                    </div>
                </div>
            </div>
        </div>
        <div class="column">
            <div class="content-wrapper">
                <progress v-if="!storeServices.servicesLoaded" class="progress is-large ml-5 mr-5" max="100" :style="{ backgroundColor: 'var(--background-color)' }"></progress>
                <template v-else>
                    <div class="services">
                        <RouterLink to="/date">
                            <div v-for="service in storeServices.services" :key="service.id" class="card mb-4 transparent-70 ml-5 mr-5" @click="selectedService(service.name, service.duration)" :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }">
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

<style scoped>
@media (min-width: 1024px) {
  .column.is-one-third {
    width: 33.333%;
  }

  .column.is-two-thirds {
    width: 66.666%;
  }
}
.progress {
    margin-right: 50px;
}
.right {
    text-align: right;
}
.text, img, image, figure, label, .step-indicator {
    user-select: none;
}
.avatar-figure {
    width: 128px;
    height: 128px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 50%;
    margin: 0 auto;
}
.avatar-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 50%;
}


/* Adjust the width of avatar-card and services to 100% */
.avatar-card, .services {
    width: 100%;
}

.avatar-figure, .avatar-text {
    flex: 1;
}


</style>
