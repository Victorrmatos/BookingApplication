<template>
        <StepIndicator class="step-indicator" :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" />

    <div class="confirmation has-text-white">
        <h2 class="title has-text-white">Please confirm your booking details:</h2>
        
        <div class="columns">
            
            <div class="column">
                
                <h3>Service booked:</h3>
                <label>{{ storeBookings.newBooking.service }}</label>
                
                <h3>Booking date:</h3>
                <label>{{ storeBookings.newBooking.date }}</label>
                
                <h3>Booking time:</h3>
                <label>{{ storeBookings.newBooking.slots[0] }}</label>
            </div>
            <div class="column">
                <h3>Name:</h3>
            <label>{{ bookingClient.fName }} {{ bookingClient.lName }}</label>
                
                <h3>Email:</h3>
                <label>{{ bookingClient.email }}</label>
                
                <h3>Phone:</h3>
                <label>{{ bookingClient.phone }}</label>
                
                <h3>Preferences:</h3>
                <label>{{ bookingClient.preferences }}</label>
            </div>
        </div>
        <div class="control">
            <button class="button" v-if="!bookingComplete" @click="confirmBooking()">Confirm Booking</button>
            <h2 style="font-size:30px" v-if="bookingComplete">Thank you, {{ bookingClient.fName }}! Your appointment is confirmed!</h2>
        </div>
    </div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import { useStoreBookings } from '@/stores/storeBookings';
import { useStoreClients } from '@/stores/storeClients'; 
import { useStoreDateTime } from '@/stores/storeDateTime'; 
import StepIndicator from '@/components/Layout/StepIndicator.vue';

const storeBookings = useStoreBookings();
const storeClients = useStoreClients();
const storeDateTime = useStoreDateTime(); 

const newBookingId = ref('');
const bookingClient = ref({});
const bookingComplete = ref(false);

/*
step indicator
*/
const currentStep = ref(3);
const maxStepReached = ref(3);

const loadBooking = () => {
  const bookingClientId = storeBookings.newBooking.clientId;
  bookingClient.value = storeClients.clients[bookingClientId] || {};
  newBookingId.value = Date.now().toString();
};

onMounted(() => {
  loadBooking();
});

const findDateIndex = (date) => {
  return storeDateTime.dates.findIndex(d => d.date === date);
};

const removeSlotsFromExistingDate = (dateIndex, slotsToRemove) => {
  if (storeDateTime.dates[dateIndex]) {
    const existingSlots = storeDateTime.dates[dateIndex].availableSlots;
    storeDateTime.dates[dateIndex].availableSlots = existingSlots.filter(slot => !slotsToRemove.includes(slot));
  }
};

const calculateAvailableSlotsForNewDate = (date, slotsToRemove) => {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
  const stdWeekdaySlots = storeDateTime.stdWeek.Tz6MddPkSmX85V1rJcHR[weekday] || [];
  const availableSlots = stdWeekdaySlots.filter((slot) => !slotsToRemove.includes(slot));
  return availableSlots;
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

const confirmBooking = () => {
  const bookingDate = storeBookings.newBooking.date;
  const bookingSlots = storeBookings.newBooking.slots;
  const parsedDate = parseDate(bookingDate);

  if (parsedDate) {
    const dateIndex = findDateIndex(bookingDate);

    if (dateIndex !== -1) {
      removeSlotsFromExistingDate(dateIndex, bookingSlots);
      if (storeDateTime.dates[dateIndex].bookings) {
        storeDateTime.dates[dateIndex].bookings.push(newBookingId.value);
      } else {
        storeDateTime.dates[dateIndex].bookings = [newBookingId.value];
      }
    } else {
      const availableSlots = calculateAvailableSlotsForNewDate(parsedDate, bookingSlots);
      const newDate = {
        date: formatDateString(parsedDate),
        availableSlots: availableSlots,
        bookings: [newBookingId.value]
      };
      storeDateTime.dates.push(newDate);
    }

    storeBookings.bookings[newBookingId.value] = storeBookings.newBooking;
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
