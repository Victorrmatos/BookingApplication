<template>
    <div class="container">
        <StepIndicator class="step-indicator pt-5" :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" />
        <div v-if="bookingClient"
         class="box transparent-80 confirmation ml-5 mr-5"
        :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }"
        >
        <div class="level">
            <div class="level-item has-text-centered">
                <h2 class="title"  :style="{ color: 'var(--text-color)'}">Please confirm your booking details:</h2>
            </div>
        </div>
        <div class="columns has-text-centered">
            <div class="column content">
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
                <template >
                    <h5 :style="{ color: storeColors.textColor }">Name:</h5>
                    <h4 :style="{ color: storeColors.textColor }">{{ bookingClient.fName }} {{ bookingClient.lName }}</h4>
                    <h5 :style="{ color: storeColors.textColor }">Email:</h5>
                    <h4 :style="{ color: storeColors.textColor }">{{ bookingClient.email }}</h4>
                    <h5 :style="{ color: storeColors.textColor }">Phone:</h5>
                    <h4 :style="{ color: storeColors.textColor }">{{ bookingClient.phone }}</h4>
                    <h5 :style="{ color: storeColors.textColor }">Preferences:</h5>
                    <h4 :style="{ color: storeColors.textColor }">{{ bookingClient.preferences }}</h4>
                </template>
                
            </div>
        </div>
        <div class="level">
            <div class="level-item has-text-centered">
                <div class="control">
                    <button class="button is-large" v-if="!bookingComplete" @click="confirmBooking()"  :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }">
                        Confirm Booking</button>
                        <h2 style="font-size:30px" v-if="bookingComplete">Thank you, {{ bookingClient.fName }}! Your appointment is confirmed!</h2>
                    </div>
                </div>
            </div>
            
        </div>
        <progress v-else class="progress is-large" max="100" :style="{ backgroundColor: 'var(--background)'}"></progress>
    </div>
</template>



<script setup>
import { watch, ref, onMounted } from 'vue';
import { useStoreBookings } from '@/stores/storeBookings';
import { useStoreClients } from '@/stores/storeClients';
import { useStoreDateTime } from '@/stores/storeDateTime';
import StepIndicator from '@/components/Layout/StepIndicator.vue';
import { useStoreColors } from '@/stores/storeColors.js';



const storeColors = useStoreColors();
const storeBookings = useStoreBookings();
const storeClients = useStoreClients();
const storeDateTime = useStoreDateTime();

const newBookingId = ref('');
const bookingClient = ref(null); // Use null initially
const bookingComplete = ref(false);
const currentStep = ref(3);
const maxStepReached = ref(3);


const loadBooking = (clientId) => {
    if (clientId) {
        const client = storeClients.clients.find(c => c.id === clientId);
        if (client) {
            bookingClient.value = client;  // Directly assign the found client
            
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
            console.log(      existingDate.id,
            existingDate.date,
            updatedAvailableSlots,
            [newBookingId])
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
        
        bookingComplete.value = true;
    } else {
        console.error('Invalid booking date:', bookingDate);
    }
};


</script>

<style>
.step-indicator, h2, h3, label {
    user-select: none;
}



</style>
