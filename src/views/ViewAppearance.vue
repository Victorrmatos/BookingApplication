<template>
    <NavBar />
    <div class="card">
    <div class="card-content has-text-centered has-background-dark">
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
                        <h2 class="level-item has-text-white">Colour select:</h2>
                        <input type="color" class="level-item" v-model="selectedColor" @change="updateColor">
                    </div>
                </div>
            </div>
            
            <!-- Right Column for Miniature Preview -->
            <div class="column is-half">
                <div class="card">
                    <div class="card-content">
                    <div class="preview-container" :style="backgroundStyle">
                        <div class="card-content">
                            <StepIndicator :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" />
                            <div class="columns is-multiline">
                                <div class="column is-half">
                                    <div class="card is-dark transparent-70">
                                        <div class="card-content has-text-centered">
                                            <figure class="image is-62x62">
                                                <img class="is-rounded" :src="avatarUrl">
                                            </figure>
                                            <div class="text mt-5">Miniature Preview</div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Additional miniature content here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div></div>
        </div>
    </div>
</div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import NavBar from '@/components/Layout/NavBar.vue';
import StepIndicator from '@/components/Layout/StepIndicator.vue';
import { useStoreColors } from '@/stores/storeColors';

const storeColors = useStoreColors();
const selectedColor = computed(() => storeColors.selectedColor);

const currentStep = ref(0); // Initialize with a default value
const maxStepReached = ref(0); // Initialize with a default value

const avatarUrl = ref('https://bulma.io/images/placeholders/128x128.png'); // Default avatar URL
const backgroundImageUrl = ref('')
const avatarFileName = ref('No file selected');
const backgroundFileName = ref('No file selected');


const onAvatarSelected = async (event) => {
    const file = event.target.files[0];
  if (file) {
    avatarFileName.value = file.name; // Update file name
    await storeColors.updateAvatarImage(file);
  }
};

const onBackgroundSelected = async (event) => {
    const file = event.target.files[0];
    if (file) {
        backgroundFileName.value = file.name; // Update file name
        await storeColors.updateBackgroundImage(file);

    }
};

const updateColor = (event) => {
    storeColors.setColor(event.target.value);
};

const backgroundStyle = computed(() => ({
    backgroundImage: `url(${storeColors.backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
}));

// Fetch avatar URL from Firestore on component mount
onMounted(async () => {
    await storeColors.getAvatarUrl();
    avatarUrl.value = storeColors.avatarImageUrl;

    await storeColors.getBackgroundUrl();
});

watch(() => storeColors.backgroundImageUrl, (newUrl) => {
  console.log('New Background URL:', newUrl);
});




</script>