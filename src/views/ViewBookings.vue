<template>
    <NavBar />
    <div class="container">   <progress
        v-if="!storeBookings.bookingsLoaded"
        class="progress is-large is-dark"
        max="100"
        />
        <template
        v-else
        >
        <div class="field">
        <input type="checkbox" id="showOldBookings" v-model="showOldBookings" />
        <label for="showOldBookings"
        :style="{ color: 'var(--text-color)' }"
> View old bookings</label>
      </div>
        <table class="table is-fullwidth is-narrow is-hoverable transparent-80"
        
        >
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Client Name</th>
                    <th>Client Id</th>
                    <th>Service</th>
                    <th>Time Booked</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(booking, id) in filteredBookings" :key="id" class="booking"
    :class="['booking-row-' + booking.clientId, 
             { 'today-booking': isBookingToday(booking.date), 
               'old-booking': isBookingOld(booking.date) && !isBookingToday(booking.date) }]">
   
   
  
            <td  class="scrollableId-cell">{{ booking.id }}</td>
                    <td>{{ booking.date }}</td>
                    <td>
                        <router-link :to="{ path: '/clients/', query: { clientId: booking.clientId }}">
  {{ getFullClientName(booking.clientId) }}
</router-link>
                    </td>
                    <td  class="scrollableId-cell">{{ booking.clientId }}</td>
                    <td>{{ booking.service }}</td>
                    <td>{{ formatSlots(booking.slots) }}</td>
                    <td>
                        <div class="columns">
                          
                            <div class="column">
                                <button class="button is-small is-danger"
                      
                        @click="deleteBookingUpdateDay(booking.id, booking.date, booking.slots)"
                     >
                    Delete
                </button>
                                
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
            
        </table>
        
    </template>
</div>
</template>

<script setup>
import { nextTick, onMounted , ref, computed} from 'vue';
import { useStoreBookings } from '@/stores/storeBookings';
import { useStoreClients } from '@/stores/storeClients'; 
import { useStoreAuth } from '@/stores/storeAuth'
import NavBar from '@/components/Layout/NavBar.vue';
import { useStoreDateTime } from '@/stores/storeDateTime';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute();

const storeAuth = useStoreAuth()
const storeDateTime = useStoreDateTime();
const storeBookings = useStoreBookings();
const storeClients = useStoreClients();
// Reactive variable for checkbox state
const showOldBookings = ref(false);
const clientIdFromRoute = route.query.clientId;


// Modify the sortedBookings computed property
const filteredBookings = computed(() => {
  return sortedBookings.value.filter(booking => 
    showOldBookings.value || !isBookingOld(booking.date)
  );
});
// Function to convert date string from dd-mm-yyyy to yyyy-mm-dd
const convertDate = (dateStr) => {
    const parts = dateStr.split('-');
    return new Date(parts[2], parts[1]-1, parts[0]);
};

// Method to format slots into a time range string
const formatSlots = (slots) => {
  const times = storeDateTime.slots.times;
  const startTime = slots[0];
  const endTimeIndex = times.indexOf(slots[slots.length - 1]) + 1;
  const endTime = times[endTimeIndex] || times[times.length - 1];
  return `${startTime} - ${endTime}`;
};


// Sorted bookings computed property
const sortedBookings = computed(() => {
  return [...storeBookings.bookings].sort((a, b) => {
    const dateA = convertDate(a.date);
    const dateB = convertDate(b.date);

    // First, compare by dates
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;

    // If dates are the same, compare by slots
    const slotsA = parseInt(a.slots[0]); // Assuming slots is an array and you're sorting by the first slot
    const slotsB = parseInt(b.slots[0]); // Adjust as per your data structure

    return slotsA - slotsB;
  });
});
const today = new Date();
today.setHours(0, 0, 0, 0); // Remove time part for accurate comparison

// Convert dd-mm-yyyy string to Date object
const convertToDateObject = (dateStr) => {
    const parts = dateStr.split('-');
    return new Date(parts[2], parts[1] - 1, parts[0]);
};

// Check if a booking is for today
const isBookingToday = (bookingDate) => {
    let convertedDate = convertToDateObject(bookingDate);
    return convertedDate.getFullYear() === today.getFullYear() &&
           convertedDate.getMonth() === today.getMonth() &&
           convertedDate.getDate() === today.getDate();
};

// Check if a booking is older than today
const isBookingOld = (bookingDate) => {
    let convertedDate = convertToDateObject(bookingDate);
    return convertedDate < today;
};

const getFullClientName = (clientId) => {
    const client = storeClients.clients.find(client => client.id === clientId);
    return client ? `${client.fName} ${client.lName}` : 'Unknown Client';
};

const deleteBookingUpdateDay = (bookingId, bookingDate, bookingSlots) => {
    let date = storeDateTime.dates.find(obj => obj.date === bookingDate);
    storeDateTime.removeBookingFromDay(date.id, bookingId, bookingSlots);
    storeBookings.deleteBooking(bookingId);
};


const highlightClientBookings = async () => {
  await nextTick(); // Ensure the DOM is updated
  const bookingRows = document.querySelectorAll(`.booking-row-${clientIdFromRoute}`);
  bookingRows.forEach(row => {
    row.classList.add('highlighted-booking');
  });
};

onMounted(async()  => {
   await storeAuth.init()
if (!storeAuth.user.id) {
        router.push('/');
    }
    else{
  if (clientIdFromRoute) {
    highlightClientBookings();
  }
}
});

</script>
<style scoped>
.booking {
    background-color: var(--text-color); /* Highlight today's bookings */
    color: var(--background-color);
}

.today-booking {
    background-color: white;
    color: black;
}

.old-booking {
    background-color: #5A5A5A; /* Grey out older bookings */
}

.is-greyed-out {
    background-color: grey; /* Grey out buttons for older bookings */
    cursor: not-allowed;
}

.highlighted-booking {
  background-color: lightgreen !important;
}
.scrollableId-cell {
    max-width: 5rem; 
    overflow-x: auto;
}
</style>
