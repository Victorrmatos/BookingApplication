<template>
    <NavBar />
    <div class="card  transparent-70"
    :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)'}">
    <div class="card-content has-text-centered"
    >
    <div class="columns">
        <!-- Left Column for Inputs -->
        <div class="column control is-half">
            <!-- File input for Avatar -->
            <div class="level control has-items-left">
                <div class="file has-name">
                    <label class="file-label">
                        <input class="file-input" @change="onAvatarSelected" type="file" name="resume">
                        <span class="file-cta">
                            <span class="file-icon">
                                <i class="fas fa-upload"></i>
                            </span>
                            <span class="file-label">Avatar Image</span>
                        </span>
                        <span class="file-name">{{ avatarFileName }}</span>
                    </label>
                </div>
            </div>
            
            <!-- File input for Background -->
            <div class="level">
                <div class="level-left">
                    <div class="level-item file has-name">
                        <label class="file-label">
                            <input class="file-input" @change="onBackgroundSelected" type="file" name="background">
                            <span class="file-cta">
                                <span class="file-icon">
                                    <i class="fas fa-upload"></i>
                                </span>
                                <span class="file-label">Background</span>
                            </span>
                            <span class="file-name">{{ backgroundFileName }}</span>
                        </label>
                    </div>
                </div>
            </div>
            
            <!-- Color Picker -->
            <div class="level">
                <div class="level-left">
                    <input type="color" v-model="previewTextColor" @change="updatePreview">
                    <h2 class="level-item ml-5" :style="{ color: storeColors.textColor }">Text color</h2>
                </div>
            </div>
            
            <!-- Color Picker for Background Color -->
            <div class="level">
                <div class="level-left">
                    <input type="color" v-model="previewBackgroundColor" @change="updatePreview">
                    <h2 class="level-item ml-5" :style="{ color: storeColors.textColor }">Background color</h2>
                </div>
            </div>
            <div class="buttons">
            <button @click="saveChanges" class="button is-large mt-5"     :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)'}">
Save Changes</button>
            <button @click="cancelChanges" class="button is-large mt-5">Cancel</button>
        </div>
        </div>
        
        <!-- Right Column for Miniature Preview -->
        <div class="column is-half">
            <div class="card">
                <div class="card-content">
                    <div class="preview-container" :style="previewStyle">                        <div class="card-content">
                        <StepIndicator :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" />
                        <div class="columns is-multiline">
                            <div class="column is-half">
                                <div class="card transparent-80" :style="{ backgroundColor: previewBackgroundColor, color: previewTextColor
                                }">
                                <div class="card-content has-text-centered">
                                    <figure class="image is-62x62">
                                        <img class="is-rounded" :src="avatarUrl">
                                    </figure>
                                    <div class="text mt-5">Miniature Preview</div>
                                </div>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div
                            v-for="service in storeServices.services"
                            :key="service.id"
                            class="card mb-4 transparent-70 ml-5 mr-5"
                            @click="selectedService(service.name, service.duration)"
                            :style="{ backgroundColor: previewBackgroundColor, color: previewTextColor
                            }">
                            <div class="card-content">
                                <div class="content">
                                    <div class="columns">
                                        <div class="column left">
                                            <label>{{ service.name }}</label>
                                        </div>
                                        <div class="column right">
                                            <label>Є {{ service.price }}</label>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <!-- Additional miniature content here -->
                </div>
            </div>
        </div>
    </div>
</div>

</div>
</div>
</div>
</div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import NavBar from '@/components/Layout/NavBar.vue';
import StepIndicator from '@/components/Layout/StepIndicator.vue';
import { useStoreColors } from '@/stores/storeColors';
import { useStoreServices } from '@/stores/storeServices'

const storeServices= useStoreServices()
const storeColors = useStoreColors();
const currentStep = ref(0);
const maxStepReached = ref(0);

const avatarUrl = ref('https://bulma.io/images/placeholders/128x128.png');
const avatarFileName = ref('No file selected');
const backgroundFileName = ref('No file selected');

// Local state for preview changes
const previewTextColor = ref(storeColors.textColor);
const previewBackgroundColor = ref(storeColors.backgroundColor);

// Computed styles for preview
const previewStyle = computed(() => ({
    color: previewTextColor.value,
    backgroundColor: previewBackgroundColor.value,
    backgroundImage: `url(${storeColors.backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
}));


// Method to update preview

// Method to save changes to Firestore
const saveChanges = async () => {
    storeColors.setPreviewColors(previewTextColor.value, previewBackgroundColor.value);
    await storeColors.saveColors();
    // Update the local preview state to match the saved state
    previewTextColor.value = storeColors.textColor;
    previewBackgroundColor.value = storeColors.backgroundColor;
};

// Method to cancel changes
const cancelChanges = () => {
    previewTextColor.value = storeColors.textColor;
    previewBackgroundColor.value = storeColors.backgroundColor;
};

onMounted(async () => {
    await storeColors.getAvatarUrl();
    avatarUrl.value = storeColors.avatarImageUrl;
});

watch(() => storeColors.backgroundImageUrl, (newUrl) => {
    console.log('New Background URL:', newUrl);
});
</script>
