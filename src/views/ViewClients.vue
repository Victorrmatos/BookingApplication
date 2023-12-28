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
<div class="table-container">
        <table class="table is-fullwidth is-striped transparent-80">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Preferences</th>
                 
                </tr>
            </thead>
            <tbody>
                <tr v-for="(client, clientId) in storeClients.clients" :key="clientId">
                    <td class="scrollableId-cell">{{ client.id }}</td>
                    <td class="scrollableName-cell">{{ client.fName }}</td>
                    <td class="scrollableName-cell">{{ client.lName }}</td>
                    <td class="scrollablePhone-cell">{{ client.phone }}</td>
                    <td class="scrollableEmail-cell">{{ client.email }}</td>
                    <td>
                        <div class="scrollablePreferences-cell">{{ client.preferences }}</div>
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
import NavBar from '@/components/Layout/NavBar.vue'

const storeClients = useStoreClients();
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
    max-width: 10rem; 
    overflow-x: auto;
}


.scrollablePreferences-cell {
    max-width: 10rem;
    max-height: 50px; 
    overflow-y: auto;
    word-break: break-word;
}

</style>