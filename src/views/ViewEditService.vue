<template>
    <NavBar />
    <div class="edit-Service">
        <AddEditService
        v-model:modelName="modelName"
        v-model:modelPrice="modelPrice"
        v-model:modelDuration="modelDuration"
        bgColor="link"
        placeholderName="Edit Service Name"
        placeholderPrice="Edit Price"
        placeholderDuration="Edit Duration"
        label="Edit Service"
        ref="addEditServiceRef"
        >
        <template #buttons>
            <button
            @click="$router.back()"
            class="button is-link is-light mr-2"
            >
            Cancel
        </button>
        <button
        @click="handleSaveClicked"
        class="button is-link has-background-link"
        :disabled="!modelName"
        
        >
        Save Service
    </button>
</template>
</AddEditService>
</div>
</template>

<script setup>

/*
imports
*/

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddEditService from '@/components/Services/AddEditService.vue'
import { useStoreServices } from '@/stores/storeServices'
import NavBar from '@/components/Layout/NavBar.vue'


/*
router
*/

const route = useRoute()
const router = useRouter()

/*
store
*/

const storeServices = useStoreServices()

/*
service
*/

const modelName = ref('')
const modelPrice = ref('')
const modelDuration = ref('')

modelName.value = storeServices.getServiceName(route.params.id)
modelPrice.value = storeServices.getServicePrice(route.params.id)
modelDuration.value = storeServices.getServiceDuration(route.params.id)

const handleSaveClicked = () => {
    storeServices.updateService(route.params.id, modelName.value, modelPrice.value, modelDuration.value)
    router.push('/adminServices')
}

</script>
