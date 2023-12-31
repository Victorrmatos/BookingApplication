<template>
    <NavBar />
    <div class="container">
        
        <progress
v-if="!storeClients.clientsLoaded"
  class="progress is-large is-dark"
  max="100"
 />
<template
v-else
>
<div class="table-container" >
        <table class="table is-fullwidth is-striped transparent-80 is-hoverable" >
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Preferences</th>
                    <th>Upcoming</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(client, clientId) in storeClients.clients" :key="clientId"  :id="`client-row-${client.id}`">
                    <td class="scrollableId-cell">{{ client.id }}</td>
                    <td class="scrollableName-cell">{{ client.fName }}</td>
                    <td class="scrollableName-cell">{{ client.lName }}</td>
                    <td class="scrollablePhone-cell">{{ client.phone }}</td>
                    <td class="scrollableEmail-cell">{{ client.email }}</td>
                    <td>
                        <div class="scrollablePreferences-cell">{{ client.preferences }}</div>
                    </td>
                    <td>   
                        <button class="button is-small is-success compact-button ml-2" v-if="hasUpcomingBookings(client.id)" @click="navigateToBookings(client.id)">
              View Bookings
            </button>
</td>

                    <td>
                        
                    <button class="button is-small is-danger compact-button ml-2" @click="storeClients.deleteClient(client.id)">Delete</button>
                
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
        </template>
    </div>
</template>


<script setup>
import { useStoreClients } from '@/stores/storeClients'; 
import { useStoreBookings } from '@/stores/storeBookings'; 
import { useStoreAuth } from '@/stores/storeAuth'

import NavBar from '@/components/Layout/NavBar.vue'
import { useRoute, useRouter } from 'vue-router';
import { nextTick, watch, onMounted } from 'vue';

const route = useRoute();
const storeClients = useStoreClients();
const storeBookings = useStoreBookings();
const storeAuth = useStoreAuth()

const router = useRouter();

const hasUpcomingBookings = (clientId) => {
  const currentDateTime = new Date();
  return storeBookings.bookings.some((booking) => {
    return booking.clientId === clientId ;
  });
};

const navigateToBookings = (clientId) => {
  router.push({ name: 'bookings', query: { clientId } });
};


const scrollToClient = async (clientId) => {
  await nextTick();
  const clientRow = document.getElementById(`client-row-${clientId}`);
  if (clientRow) {
    clientRow.classList.add('highlighted-client');
    console.log(`Class added to: `, clientRow); // Add this line for debugging
    clientRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

// Watcher for route changes
watch(() => route.query.clientId, (newClientId) => {
  // Check if the clients are loaded
  if (storeClients.clientsLoaded && newClientId) {
    scrollToClient(newClientId);
  }
});


onMounted(async () => { 

        if (storeClients.clientsLoaded) {
    const clientId = route.query.clientId;
    if (clientId) {
      scrollToClient(clientId);
    }
  
    }
})

</script>

<style scoped>

</style>

<style>

.scrollableId-cell {
    max-width: 5rem; 
    overflow-x: auto;
}
.scrollableName-cell {
    max-width: 10rem; 
    overflow-x: auto;
}.scrollablePhone-cell {
    max-width: 5rem; 
    overflow-x: auto;
}
.scrollableEmail-cell {
    max-width: 15rem; 
    overflow-x: auto;
}


.scrollablePreferences-cell {
    max-width: 10rem;
    max-height: 50px; 
    overflow-y: auto;
    word-break: break-word;
}

.table-container .highlighted-client {
  background-color: lightgreen !important;
}

</style>