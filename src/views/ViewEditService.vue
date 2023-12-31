<template>
    <NavBar />
    <div class="edit-Service">
        <AddEditService
        v-model:modelName="modelName"
        v-model:modelPrice="modelPrice"
        v-model:modelDuration="modelDuration"
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
            :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }"

            >
            Cancel
        </button>
        <button
        @click="handleSaveClicked"
        :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }"

        class="button is-link "
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
import { useStoreColors } from '@/stores/storeColors'
import { useStoreAuth } from '@/stores/storeAuth'



const storeAuth = useStoreAuth()



/*
router
*/

const route = useRoute()
const router = useRouter()

/*
store
*/

const storeColors = useStoreColors()
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
<style scoped>
.button {
    border: 1px solid var(--text-color);
}</style>