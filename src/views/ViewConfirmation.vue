<template>
    <div class="container">
        <StepIndicator class="step-indicator pt-5" :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" />
        <div class="box transparent-80 confirmation ml-5 mr-5"
        :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }"
>
            <h2 class="title"  :style="{ color: 'var(--text-color)'}">Please confirm your booking details:</h2>
            <div class="columns">
                <div class="column">
                    <h3>Service booked:</h3>
                    <label>{{ storeBookings.newBooking.service }}</label>
                    <h3>Booking date:</h3>
                    <label>{{ storeBookings.newBooking.date }}</label>
                    <h3>Booking time:</h3>
                    <label>{{ storeBookings.newBooking.slots?.[0] }}</label>
                </div>
                
                <!-- Client Details Section -->
                <div class="column">
                    <!-- Conditional Rendering -->
                    <template v-if="bookingClient">
                        <h3>Name:</h3>
                        <label>{{ bookingClient.fName }} {{ bookingClient.lName }}</label>
                        <h3>Email:</h3>
                        <label>{{ bookingClient.email }}</label>
                        <h3>Phone:</h3>
                        <label>{{ bookingClient.phone }}</label>
                        <h3>Preferences:</h3>
                        <label>{{ bookingClient.preferences }}</label>
                    </template>
                    <progress v-else class="progress is-large is-dark" max="100"></progress>
                </div>
            </div>
            
            <div class="control">
                <button class="button" v-if="!bookingComplete" @click="confirmBooking()"  :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }">
Confirm Booking</button>
                <h2 style="font-size:30px" v-if="bookingComplete">Thank you, {{ bookingClient.fName }}! Your appointment is confirmed!</h2>
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
