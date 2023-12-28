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

<progress
v-if="!storeServices.servicesLoaded"
  class="progress is-large is-dark ml-5 mr-5"
  max="100"
 />
<template
v-else
>
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
</template>
</div>
<div class="ml-5" v-if="!storeServices.services.length">
No services added.
</div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useStoreServices } from '@/stores/storeServices'
import { useDateFormat } from '@vueuse/core'
import NavBar from '@/components/Layout/NavBar.vue';
import AddEditService from '@/components/Services/AddEditService.vue';



const storeServices = useStoreServices()
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

const props = defineProps({
    service: {
        type: Object
    }
})

const dateFormatted = computed(() => {
    let date = new Date(parseInt(props.service.date))
    let dateFormatted = useDateFormat(date, 'DD-MM-YYYY')
    return dateFormatted.value
})
</script>