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
        <table class="table is-fullwidth is-striped transparent-80"
        
        >
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Client Name</th>
                    <th>Service</th>
                    <th>Slots Booked</th>
                    <th>Actions</th>
                </tr>
            </thead>
            
            <tbody>
                <tr v-for="(booking, id) in storeBookings.bookings" :key="id">
                    <td>{{ booking.id }}</td>
                    <td>{{ booking.date }}</td>
                    <td>
                        <router-link :to="`/clients/`">
                            {{ getFullClientName(booking.clientId) }}
                        </router-link>
                    </td>
                    <td>{{ booking.service }}</td>
                    <td>{{ booking.slots }}</td>
                    <td>
                        <div class="columns">
                            <div class="column">
                                <button class="button is-small is-info">Edit</button>
                            </div>
                            <div class="column">
                                <button class="button is-small is-danger" @click="storeBookings.deleteBooking(booking.id)">Delete</button>
                                
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
import { computed } from 'vue';
import { useStoreBookings } from '@/stores/storeBookings';
import { useStoreClients } from '@/stores/storeClients'; 
import NavBar from '@/components/Layout/NavBar.vue'

const storeBookings = useStoreBookings();
const storeClients = useStoreClients();
const bookingsLoaded = computed(() => storeBookings.bookingsLoaded);

const getFullClientName = (clientId) => {
    const client = storeClients.clients.find(client => client.id === clientId);
    return client ? `${client.fName} ${client.lName}` : 'Unknown Client';
};
</script>