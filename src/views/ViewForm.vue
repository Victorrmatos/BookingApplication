<template>
    <StepIndicator class="step-indicator pt-5" :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" />
    <div
        class="box transparent-80 confirmation "
        style="min-width: 300px;"
        :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }"
        >
    <div class="form-contol ml-5 mr-5">
    <div class="field" >
        <label class="label" :style="{ color: 'var(--text-color)'}" >First Name</label>
        <div class="control has-icons-right transparent-80">
            <input
            v-model="newClient.fName"
            @input="validateFirstName"
            @blur="validateFirstName"
            :class="['input', { 'is-danger': !isFirstNameValid }]"
            placeholder="Please enter your first name"
            type="text"
            required
            :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }"
            v-autofocus
            >
            <span class="icon control is-small is-right">
                <i class="fas fa-user ml-5 mr-5"></i>
                <span class="control has-text-danger icon is-small is-right" v-if="!isFirstNameValid">
                    <i class="fas fa-times mr-5 pr-5" />
                </span>
            </span>
        </div>
    </div>
    
    <div class="field">
        <label class="label" :style="{ color: 'var(--text-color)'}" >Last Name</label>
        <div class="control has-icons-right">
            <input
            v-model="newClient.lName"
            @input="validateLastName"
            @blur="validateLastName"
            :class="['input', { 'is-danger': !isLastNameValid }]"
            placeholder="Please enter your last name"
            type="text"
            :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }"
            required
            >
            <span class="icon control is-small is-right">
                <i class="fas fa-user ml-5 mr-5"></i>
                <span class="control has-text-danger icon is-small is-right" v-if="!isLastNameValid">
                    <i class="fas fa-times mr-5 pr-5" />
                </span>
            </span>
        </div>
    </div>
 
    <div class="field">
        <label class="label" :style="{ color: 'var(--text-color)'}" >Phone</label>
        <div class="control has-icons-right">
            <input
            v-model="newClient.phone"
            @input="validatePhone"
            @blur="validatePhone"
            :class="['input', { 'is-danger': !isPhoneValid }]"
            placeholder="Please enter your phone number"
            type="tel"
            :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }"

            required
            >
            <span class="icon control is-small is-right">
                <i class="fas fa-phone  ml-5 mr-5"></i>
                <span class="control has-text-danger icon is-small is-right" v-if="!isPhoneValid">
                    <i class="fas fa-times  mr-5 pr-5" />
                </span>
            </span>
        </div>
    </div>
    
    
    <div class="field">
        <label class="label" :style="{ color: 'var(--text-color)'}" >Email</label>
        <div class="control has-icons-right">
            <input
            v-model="newClient.email"
            @input="validateEmail"
            @blur="validateEmail"
            :class="['input', { 'is-danger': !isEmailValid }]"
            placeholder="Your email"
            type="email"
            autocomplete="email"
            :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }"

            required
            >
            <span class="icon control is-small is-right">
                <i class="fas fa-envelope ml-5 mr-5"></i>
                <span class="control has-text-danger icon is-small is-right" v-if="!isEmailValid">
                    <i class="fas fa-times mr-5 pr-5" />
                </span>
            </span>
        </div>
    </div>
    
    <div class="field">
        <label class="label" :style="{ color: 'var(--text-color)'}" >Preferences</label>
        <div class="control has-icons-right">
            <textarea
                v-model="newClient.preferences"
                @input="validatePreferences"
                @blur="validatePreferences"
                :class="['textarea', { 'is-danger': !isPreferencesValid }]"
                placeholder="Textarea"
                :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }"

            ></textarea>
            <span class="icon control is-small is-right">
                <i class="fas fa-comment ml-5 mr-5"></i>
                <span class="control has-text-danger icon is-small is-right" v-if="!isPreferencesValid">
                    <i class="fas fa-times mr-5 pr-5" />
                </span>
            </span>
           
           
        </div>
    </div>
    
  
    
    <div class="field is-grouped pb-5 mt-4">
        <div class="control">
            <RouterLink to="/confirmation">
                <button class="button" :disabled="!isFormValid" @click="submitForm"
                :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }"
>Submit</button>
            </RouterLink>
        </div>
        <div class="control">
            <RouterLink to="/date" class="button"         :style="{ backgroundColor: storeColors.textColor, color: storeColors.backgroundColor }"
>Cancel</RouterLink>
        </div>
    </div>
</div>
</div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useStoreBookings } from '@/stores/storeBookings';
import { useStoreClients } from '@/stores/storeClients'; 
import StepIndicator from '@/components/Layout/StepIndicator.vue';
import { useStoreColors } from '@/stores/storeColors.js';
import { vAutofocus } from '@/directives/vAutofocus'



const storeColors = useStoreColors();
const storeBookings = useStoreBookings();
const storeClients = useStoreClients();

const newClient = ref({
    fName: '',
    lName: '',
    phone: '',
    email: '',
    preferences: ''
});


/*
validation
*/

const validationPatterns = {
    fName: /^[A-Za-z]{1,30}(?: [A-Za-z]{1,30}){0,2}$/,
    lName: /^[A-Za-z]{3,30}$/,
    phone: /\+?\d{10,15}/,
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    preferences: /^.{0,300}$/
};

const isFirstNameValid = ref(true);
const isLastNameValid = ref(true);
const isPhoneValid = ref(true);
const isEmailValid = ref(true);
const isPreferencesValid = ref(true);



const validateFirstName = () => {
    isFirstNameValid.value = validationPatterns.fName.test(newClient.value.fName) || newClient.value.fName === '';
};

const validateLastName = () => {
    isLastNameValid.value = validationPatterns.lName.test(newClient.value.lName) || newClient.value.lName === '';
};

const validatePhone = () => {
    isPhoneValid.value = validationPatterns.phone.test(newClient.value.phone) || newClient.value.phone === '';
};

const validateEmail = () => {
    isEmailValid.value = validationPatterns.email.test(newClient.value.email) || newClient.value.email === '';
};

const validatePreferences = () => {
    isPreferencesValid.value = validationPatterns.preferences.test(newClient.value.preferences) || newClient.value.preferences === '';
};

watch(() => newClient.value.fName, validateFirstName);
watch(() => newClient.value.lName, validateLastName);
watch(() => newClient.value.phone, validatePhone);
watch(() => newClient.value.email, validateEmail);
watch(() => newClient.value.preferences, validatePreferences);

const isFormValid = computed(() => {
    return isFirstNameValid.value && isLastNameValid.value && isEmailValid.value &&
           (newClient.value.fName !== '' && newClient.value.lName !== '' && newClient.value.email !== '');
})



/*
step indicator
*/
const currentStep = ref(2)
const maxStepReached = ref(2)



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

    .is-danger {
        border: 1px solid red;
    }

   

    .icon.is-small.is-right .fa-times {
        color: red;
    }
</style>

