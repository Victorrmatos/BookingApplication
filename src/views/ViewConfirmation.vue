<template>
    <div class="container has-text-centered">
        <StepIndicator class="step-indicator pt-5" :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" />
        <div
        class="box transparent-80 confirmation "
        style="min-width: 300px;"
        :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }"
        >
        <div class="level">
            <div class="level-item transition-container">
                <transition name="fade">
                    <div v-if="!bookingComplete" class="has-text-centered">
                        <h2 class="title pt-5" style="min-width: 290px;" :style="{ color: 'var(--text-color)'}">Please confirm your booking details:</h2>
                    </div>
                </transition>
                <transition name="fade">
                    <div v-if="bookingComplete" class="has-text-centered">
                        <h2 class="title pt-5" style="min-width: 290px;" :style="{ color: 'var(--text-color)'}">Your booking details:</h2>
                    </div>
                </transition>
            </div>
        </div>
        
        <div class="columns">
            <div class="column content ">
                <h5 :style="{ color: storeColors.textColor }"
                >Service booked:</h5>
                <h4 :style="{ color: storeColors.textColor }">{{ storeBookings.newBooking.service }}</h4>
                <h5 :style="{ color: storeColors.textColor }">Booking date:</h5>
                <h4 :style="{ color: storeColors.textColor }">{{ storeBookings.newBooking.date }}</h4>
                <h5 :style="{ color: storeColors.textColor }">Booking time:</h5>
                <h4 :style="{ color: storeColors.textColor }">{{ storeBookings.newBooking.slots?.[0] }}</h4 >
                </div>
                
                <!-- Client Details Section -->
                <div class="column content">
                    <!-- Conditional Rendering -->
                    <template  v-if="clientLoaded">
                        
                        <h5 :style="{ color: storeColors.textColor }">Name:</h5>
                        <h4 :style="{ color: storeColors.textColor }">{{ bookingClient.fName }} {{ bookingClient.lName }}</h4>
                        <h5 :style="{ color: storeColors.textColor }">Email:</h5>
                        <h4 :style="{ color: storeColors.textColor }">{{ bookingClient.email }}</h4>
                        <h5 :style="{ color: storeColors.textColor }">Phone:</h5>
                        <h4 :style="{ color: storeColors.textColor }">{{ bookingClient.phone }}</h4>
                        <h5 v-if="bookingClient.preferences" :style="{ color: storeColors.textColor }">Preferences:</h5>
                        <h4 :style="{ color: storeColors.textColor }">{{ bookingClient.preferences }}</h4>
                    </template>
                    <progress v-else class="progress is-large" max="100" :style="{ backgroundColor: 'var(--background)'}">
                    </progress> 
                </div>
            </div>
            <div class="level ">
                <div class="level-item transition-container">
                    <transition name="fade">
                        
                        <button
                        style="min-width: 290px; min-height: 50px;"
                        :style="{ color: 'var(--text)',backgroundColor: 'var(--background)'}"
                        class="button is-large is-responsive pt-4 pb-4"
                        v-if="!bookingInProgress && !bookingComplete"
                        @click="confirmBooking"
                        key="button"
                        v-autofocus>
                        Confirm Booking
                    </button>       
                </transition>
            
    
            <transition name="fade">
                
                <h2 class="title is-4 pt-4" v-if="bookingComplete" key="message"
                style="min-width: 290px;"
                 :style="{ color: 'var(--text)'}">
                    Thank you, {{ bookingClient.fName }}! Your appointment is confirmed!
                </h2>
                
            </transition>
        </div>
        
    </div>
    
    
    
</div>

</div>
</template>



<script setup>
import { watch, ref, onMounted } from 'vue';
import { useStoreBookings } from '@/stores/storeBookings';
import { useStoreClients } from '@/stores/storeClients';
import { useStoreDateTime } from '@/stores/storeDateTime';
import StepIndicator from '@/components/Layout/StepIndicator.vue';
import { useStoreColors } from '@/stores/storeColors.js';
import { vAutofocus } from '@/directives/vAutofocus'



const storeColors = useStoreColors();
const storeBookings = useStoreBookings();
const storeClients = useStoreClients();
const storeDateTime = useStoreDateTime();

const newBookingId = ref('');
const bookingClient = ref(null); // Use null initially
const bookingComplete = ref(false);
const bookingInProgress = ref(false);

const currentStep = ref(3);
const maxStepReached = ref(3);
const clientLoaded = ref(false)

const loadBooking = (clientId) => {
    if (clientId) {
        const client = storeClients.clients.find(c => c.id === clientId);
        if (client) {
            
            bookingClient.value = client;  // Directly assign the found client
            clientLoaded.value = true
        } else {
            console.error('Client not found for ID:', clientId);
        }
    }
};

onMounted(() => {
    loadBooking(storeBookings.newBooking.clientId)
});

watch(() => storeBookings.newBooking.clientId, (newClientId) => {
    loadBooking(newClientId);
});



const findDateIndex = (date) => {
    return storeDateTime.dates.findIndex(d => d.date === date);
};



const calculateAvailableSlotsForNewDate = (date, slotsToRemove) => {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    const stdWeekdaySlots = storeDateTime.stdWeek[weekday] || [];
    
    // Ensure that stdWeekdaySlots is an array before filtering
    if (Array.isArray(stdWeekdaySlots)) {
        const availableSlots = stdWeekdaySlots.filter((slot) => !slotsToRemove.includes(slot));
        return availableSlots;
    } else {
        console.error('Invalid value for stdWeekdaySlots:', stdWeekdaySlots);
        return [];
    }
};

const parseDate = (dateString) => {
    const parts = dateString.split('-');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Months are zero-based
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }
    return null; // Invalid date format
};

const formatDateString = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const confirmBooking = async () => {
    bookingInProgress.value = true;
    
    const bookingDate = storeBookings.newBooking.date;
    const bookingSlots = storeBookings.newBooking.slots;
    const parsedDate = parseDate(bookingDate);
    
    if (parsedDate) {
        const newBookingId = await storeBookings.addBooking(    
        storeBookings.newBooking.client,
        storeBookings.newBooking.clientId,
        storeBookings.newBooking.service,
        storeBookings.newBooking.slots,
        storeBookings.newBooking.date,
        );
        
        const dateIndex = findDateIndex(bookingDate);
        
        if (dateIndex !== -1) {
            // Update the existing date's available slots and add the new booking ID to its bookings array
            const existingDate = storeDateTime.dates[dateIndex];
            const updatedAvailableSlots = existingDate.availableSlots.filter((slot) => !bookingSlots.includes(slot));
            
            await storeDateTime.updateCustomDay(
            existingDate.id,
            existingDate.date,
            updatedAvailableSlots,
            newBookingId // Pass as a single value
            );
        } else {
            // Calculate available slots based on the existing slots and bookings
            const existingDate = storeDateTime.dates.find((dateObj) =>
            dateObj.date === formatDateString(parsedDate)
            );
            
            const availableSlots = existingDate
            ? existingDate.availableSlots.filter((slot) => !bookingSlots.includes(slot))
            : calculateAvailableSlotsForNewDate(parsedDate, bookingSlots);
            
            const newDate = {
                date: formatDateString(parsedDate),
                availableSlots: availableSlots,
                bookings: [newBookingId], // Use the new booking ID here
            };
            
            try {
                const docRefId = await storeDateTime.addCustomDay(newDate.date, newDate.availableSlots, newDate.bookings);
                
            } catch (error) {
                console.error('Error adding custom day:', error);
            }
        }
        
        bookingInProgress.value = false;
        bookingComplete.value = true;
        
    } else {
        console.error('Invalid booking date:', bookingDate);
        console.error("Booking failed");
        bookingInProgress.value = false;
        
        
        
    }
};


</script>

<style scoped>
.step-indicator, h2, h3, label {
    user-select: none;
}

/* General container for transitioning elements */
.transition-container {
    position: relative;
    width: 100%;
    height: 60px; /* Set a fixed height to accommodate the tallest element */
}

/* Positioning for each transitioning element */
.transition-container > * {
    position: absolute;
    top: 0;
    left: 50%; /* Center horizontally */
    transform: translateX(-50%); /* Adjust for centering */
    width: auto; /* Auto width for content */
    height: 20px; /* Consistent height */
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Fade transition */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.booking-info {
    padding-top: 100px;
}

/* Ensure elements within .level-item are centered */
.level-item {
    justify-content: center;
    display: flex;
}
</style>

