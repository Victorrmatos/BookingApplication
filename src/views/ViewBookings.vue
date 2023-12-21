<template>
    <NavBar />
    <div class="container">
        <table class="table is-fullwidth is-striped">
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
                    <td>{{ id }}</td>
                    <td>{{ booking.date }}</td>
                    <td>
                        <router-link :to="`/clients/`">
                            {{ getClientName(booking.clientId) }}
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
                                <button class="button is-small is-danger">Delete</button>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useStoreBookings } from '@/stores/storeBookings';
import { useStoreClients } from '@/stores/storeClients'; 
import NavBar from '@/components/Layout/NavBar.vue'


const storeBookings = useStoreBookings();
const storeClients = useStoreClients();

// Method to get client name by ID
const getClientName = (clientId) => {
    const client = storeClients.clients[clientId];
    return client ? `${client.fName} ${client.lName}` : 'Unknown Client';
};

</script>
