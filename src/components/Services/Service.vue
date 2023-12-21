<template>
    <div
    class="card mb-4"
    >
    <div class="card-content">
        <div class="name">
            {{ service.name }}
            <div class="has-text-right has-text-grey-light mt-2">
                <small>{{ characterLength }}</small>
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

<script setup>
/*
imports
*/

import { computed } from 'vue'
import { useStoreServices } from '@/stores/storeServices'

/*
props
*/

const props = defineProps({
    service: {
        type: Object,
        required: true
    }
})

/*
store
*/

const storeServices = useStoreServices()

/*
character length
*/

const characterLength = computed(() => {
    let length = props.service.name.length
    let description = length > 1 ? 'characters' : 'character'
    return `${ length } ${ description }`
})

</script>