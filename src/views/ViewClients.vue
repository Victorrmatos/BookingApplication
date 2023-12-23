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
        <table class="table is-fullwidth is-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Preferences</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(client, clientId) in storeClients.clients" :key="clientId">
                    <td>{{ client.id }}</td>
                    <td>{{ client.fName }}</td>
                    <td>{{ client.lName }}</td>
                    <td>{{ client.phone }}</td>
                    <td>{{ client.email }}</td>
                    <td>
                        <div class="scrollable-cell">{{ client.preferences }}</div>
                    </td>
                    <td>
                        <div class="columns">
                            <div class="column">
                                <button class="button is-small is-info">Edit</button>
                            </div>
                            <div class="column">
                                <button class="button is-small is-danger"  @click="storeClients.deleteClient(client.id)">Delete</button>
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
import { useStoreClients } from '@/stores/storeClients'; 
import NavBar from '@/components/Layout/NavBar.vue'

const storeClients = useStoreClients();
</script>

<style scoped>
.scrollable-cell {
    max-height: 50px; 
    overflow-y: auto;
    word-break: break-word;
}
</style>