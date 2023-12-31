<template>
    <div
    class="card p-4 mb-5 transparent-70"
    :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }"
    
    >
    <label
    v-if="label"
    class="label has-text-white"
    >
    {{ label }}
</label>

<div class="field">
    <div class="control">
        <div class="columns">
            
            <div class="column is-two-thirds">
                
                <label class="label"             :style="{ color: 'var(--text-color)'}"
                >Name</label>
                <input
                :value="modelName"
                @input="$emit('update:modelName',  $event.target.value)"
                class="input uniform-height"
                :placeholder="placeholderName"
                ref="textareaRef"
                maxlength="100"
                v-autofocus
                />
            </div>
            <div class=" column is-one-sixth">
                <label class="label "            :style="{ color: 'var(--text-color)'}"
                >Price (€)</label>
                <input
                
                :value="modelPrice"
                @input="$emit('update:modelPrice',  $event.target.value)"
                class="input uniform-height"
                :placeholder="placeholderPrice"
                ref="textareaRef"
                maxlength="100"
                
                />
            </div>
            <div class="column is-one-sixth field">
                
                <div class="field ">
                    <label class="label "            :style="{ color: 'var(--text-color)'}"
                    >Duration</label>
                    <div class="control">
                        <div class="select"
                        
                        >
                            <select :value="modelDuration"
                           
                            @input="$emit('update:modelDuration',  $event.target.value)">
                            <option value="1">30 min</option>
                            <option value="2">1 hour</option>
                            <option value="3">1.5 hours</option>
                            <option value="4">2 hours</option>
                        </select>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    
    
    
</div>
</div>

<div class="field is-grouped is-grouped-right">
    <div class="control">
        <slot name="buttons"  />
    </div>
</div>
</div>
</template>

<script setup>

/*
imports
*/

import { ref } from 'vue'
import { vAutofocus } from '@/directives/vAutofocus'

/*
props
*/


const props = defineProps({
    modelName: {
        type: String,
        required: true
    },
    modelPrice: {
        type: String,
        required: true
    },
    modelDuration: {
        type: String,
        required: true
    },
    bgColor: {
        type: String,
        default: 'success'
    },
    placeholderName: {
        type: String,
        default: 'Type something...'
    },
    placeholderPrice: {
        type: String,
        default: 'Type something...'
    },
    placeholderDuration: {
        type: String,
        default: 'Type something...'
    },
    label: {
        type: String
    }
})

/*
emits
*/

const emit = defineEmits(['update:modelName','update:modelPrice','update:modelDuration'])

/*
focus textarea
*/

const textareaRef = ref(null)

const focusTextarea = () => {
    textareaRef.value.focus()
}

defineExpose({
    focusTextarea
})

</script>

<style scoped>
.uniform-height {
  height: 2.8em; /* Example height, adjust as needed */
}
</style>