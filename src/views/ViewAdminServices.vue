<template>
    <NavBar />
    <div class="services">
        
        <AddEditService
        v-model:modelName="newServiceName"
        v-model:modelPrice="newServicePrice"
        v-model:modelDuration="newServiceDuration"
        placeholder="Add a new service"
        ref="addEditServiceRef"
        >
        <template #buttons>
            <button
            @click="addService"
            :disabled="!newServiceName"
            class="button is-link has-background-success"
            >
            Add New Service
        </button>
    </template>
</AddEditService>

<div
v-for="service in storeServices.services"
:key="service.id"
class="card mb-4"

>
<div class="card-content">
    <div class="content">
        <div class="columns">
            <div class="column left is-two-thirds">
                Name: {{ service.name }}
            </div>
            <div class="column middle is-one-sixth">
                Price: €{{ service.price }}
            </div>
            <div class="column right is-one-sixth">
                Time Slots: {{ service.duration }} 
            </div>
        </div>
        
    </div>
</div>
<footer class="card-footer">
    <RouterLink
    :to="`/editService/${ service.id }`"
    class="card-footer-item"
    href="#"
    >
    Edit
</RouterLink>
<a
@click.prevent="storeServices.deleteService(service.id)"
class="card-footer-item"
href="#"
>
Delete
</a>
</footer>
</div>
</div>
</template>

<script setup>

/*
imports
*/

import { ref } from 'vue'
import Service from '@/components/Services/Service.vue'
import AddEditService from '@/components/Services/AddEditService.vue'
import { useStoreServices } from '@/stores/storeServices'
import NavBar from '@/components/Layout/NavBar.vue'

/*
store
*/

const storeServices = useStoreServices()

/*
services
*/

const newServiceName = ref('')
const newServicePrice = ref('')
const newServiceDuration = ref('')
const addEditServiceRef = ref(null)

const addService = () => {
    storeServices.addService(newServiceName.value, newServicePrice.value, newServiceDuration.value)
    newServiceName.value = ''
    newServicePrice.value = ''
    newServiceDuration.value = ''
    addEditServiceRef.value.focusTextarea()
}

</script> 