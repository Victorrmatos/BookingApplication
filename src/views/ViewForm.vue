<template>
    <StepIndicator class="step-indicator" :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" />
    
    <div class="forms">
        <div class="field">
            <label class="label has-text-white">First Name</label>
            <div class="control">
                <input class="input" type="text" placeholder="Please enter your first name" v-model="newClient.fName">
            </div>
        </div>
        <div class="field">
            <label class="label has-text-white">Last Name</label>
            <div class="control">
                <input class="input" type="text" placeholder="Please enter your last name" v-model="newClient.lName">
            </div>
        </div>
        <div class="field">
            <label class="label has-text-white">Phone</label>
            <div class="control">
                <input class="input" type="text" placeholder="Please enter your phone number" v-model="newClient.phone">
            </div>
        </div>
        
        <div class="field">
            <label class="label has-text-white">Email</label>
            <div class="control has-icons-left has-icons-right">
                <input class="input" type="email" placeholder="Your email" v-model="newClient.email" required pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$">
                <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                </span>
            </div>
        </div>
        
        <div class="field">
            <label class="label has-text-white">Preferences</label>
            <div class="control">
                <textarea class="textarea" placeholder="Textarea" v-model="newClient.preferences"></textarea>
            </div>
        </div>
        
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox">
                    I agree to the <a href="#">terms and conditions</a>
                </label>
            </div>
        </div>
        
        
        <div class="field is-grouped">
            <div class="control">
                <RouterLink to="/confirmation">
                    <button class="button is-link" @click="submitForm">Submit</button>
                </RouterLink>
            </div>
            <div class="control">
                <button class="button is-link is-light">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStoreBookings } from '@/stores/storeBookings';
import { useStoreClients } from '@/stores/storeClients'; 
import StepIndicator from '@/components/Layout/StepIndicator.vue'



const storeBookings = useStoreBookings();
const storeClients = useStoreClients()

/*
step indicator
*/
const currentStep = ref(2)
const maxStepReached = ref(2)


// Reactive properties for form inputs
const newClient = ref({
    fName: '',
    lName: '',
    phone: '',
    email: '',
    preferences: ''
})
const submitForm = async () => {
    let clientKey;

    // Find an existing client by email
    const existingClient = storeClients.clients.find(client => 
        client.email === newClient.value.email
    );

    if (existingClient) {
        // Use the existing client's ID
        clientKey = existingClient.id;
    } else {
        // Add a new client and get the ID
        clientKey = await storeClients.addClient(
            newClient.value.fName, newClient.value.lName, 
            newClient.value.phone, newClient.value.email, 
            newClient.value.preferences
        );
    }

    // Ensure we have a valid clientKey
    if (!clientKey) {
        console.error("Failed to obtain a valid client key");
        return; // or handle the error as needed
    }

    // Update the booking's client information
    const newBooking = storeBookings.newBooking;
    if (newBooking) {
        newBooking.clientId = clientKey;
        newBooking.client = `${newClient.value.fName} ${newClient.value.lName}`;
    }
}



</script>

<style>
.step-indicator {
    user-select: none;
}

</style>

