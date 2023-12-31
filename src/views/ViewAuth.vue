<template>
    <div class="auth">
        <div class="tabs is-centered"></div>
        <div class="card auth-form">
            <div class="card-content">
                
                <div class="title has-text-centered">
                    Login
                    
                </div>
                
                <form
                @submit.prevent="onSubmit"
                >
                <div class="field">
                    <label class="label">
                        Email
                    </label>
                    <div class="control">
                        <input
                        class="input"
                        placeholder="e.g. alexsmith@gmail.com"
                        type="email"
                        v-model="credentials.email"
                        autocomplete="email"
                        >
                    </div>
                </div>
                
                <div class="field">
                    <label class="label">
                        Password
                    </label>
                    <div class="control">
                        <input
                        class="input"
                        placeholder="Enter a password"
                        type="password"
                        v-model="credentials.password"
                        autocomplete="password"

                        >
                    </div>
                </div>
                
                <div class="field is-grouped is-grouped-right">
                    <p class="control">
                        <button class="button is-primary">
                            Login
                        </button>
                        <RouterLink to="/" class="button is-light">
                            Cancel
                        </RouterLink>
                    </p>
                    
                </div>
            </form>
        </div>
    </div>
</div>
</template>

<script setup>
/*
imports
*/

import { watch, setBlockTracking, reactive, onMounted } from 'vue'
import { useStoreAuth } from '@/stores/storeAuth';
import { signOut } from "firebase/auth";
import { useRouter } from 'vue-router';
/*
router
*/
const router = useRouter();

/*
store
*/
const storeAuth = useStoreAuth()


/*
credentials
*/

const credentials = reactive({
    email: '',
    password: ''
})


watch(() => storeAuth.user.id, (newUserId) => {
    if (newUserId) {
        console.log('User logged in, redirecting...');
        router.push('/bookings');
    }
});

onMounted(async () => { 
storeAuth.init()
if (storeAuth.user.id) {
        console.log('User logged in, redirecting...');
        router.push('/bookings');
    }
})


/*
submit
*/

const onSubmit = async () => {
    if (!credentials.email || !credentials.password) {
        alert('Please enter an email and password');
    } else {
        await storeAuth.loginUser(credentials);
        router.push('/bookings');

    }
};



</script>

<style>

.auth-form {
    max-width: 400px;
    margin: 0 auto;
    
}</style>