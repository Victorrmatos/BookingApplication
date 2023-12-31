<template>
    <NavBar />
    <div class="card transparent-70"
         :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)'}">
      <div class="card-content has-text-centered">
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
                      <i class="fa-solid fa-upload"></i>
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

            <textarea type="textarea" class="textarea" v-model="tempAvatarText" v-autofocus></textarea>


            <div class="buttons">
              <button @click="saveChanges" class="button is-large mt-5"
                      :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)'}">
                      <span class="file-icon">
                        <i class="fas fa-save"></i>
                      </span>  Save Changes
              </button>
              <button @click="cancelChanges" class="button is-large mt-5">
            
                <span class="file-icon">
                        <i class="fas fa-cancel"></i>
                      </span>Cancel
                    </button>
            </div>
          </div>
          <!-- Right Column for Miniature Preview -->
          <div class="column is-half">
            <div class="card">
              <div class="card-content">
                <div class="preview-container" :style="previewStyle">
                  <div class="card-content">
                    <StepIndicator :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" 
                    />
                    <div class="columns is-multiline">
                      <div class="column is-half">
                        <div class="card transparent-80" :style="{ backgroundColor: previewBackgroundColor, color: previewTextColor }">
                          <div class="card-content has-text-centered">
                            <figure class="image is-62x62">
                              <img class="is-rounded" :src="avatarUrl">
                            </figure>
                            <div class="text mt-5">Miniature Preview</div>
                          </div>
                        </div>
                      </div>
                      <div class="column is-half">
                        <div v-for="service in storeServices.services" :key="service.id"
                             class="card mb-4 transparent-70 "
                             @click="selectedService(service.name, service.duration)"
                             :style="{ backgroundColor: previewBackgroundColor, color: previewTextColor }">
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
  import { useStoreServices } from '@/stores/storeServices';
  import { useStoreAuth } from '@/stores/storeAuth'
  import { vAutofocus } from '@/directives/vAutofocus'
  import { useRouter } from 'vue-router';

  const router = useRouter()


  const storeAuth = useStoreAuth()
  const storeServices = useStoreServices();
  const storeColors = useStoreColors();
  const currentStep = ref(0);
  const maxStepReached = ref(0);
  
  const selectedAvatarFile = ref(null);
  const selectedBackgroundFile = ref(null);
  
  const avatarUrl = ref('https://bulma.io/images/placeholders/128x128.png');
  const backgroundImageUrl = ref('');
  const avatarFileName = ref('No file selected');
  const backgroundFileName = ref('No file selected');
  const avatarText = ref('')
  const tempAvatarText = ref(storeColors.avatarText)


  const onAvatarSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
      avatarFileName.value = file.name;
      selectedAvatarFile.value = file;
      avatarUrl.value = URL.createObjectURL(file);
    }
  };
  
  const onBackgroundSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
      backgroundFileName.value = file.name;
      selectedBackgroundFile.value = file;
      backgroundImageUrl.value = URL.createObjectURL(file);
    }
  };
  
  const previewTextColor = ref(storeColors.textColor);
  const previewBackgroundColor = ref(storeColors.backgroundColor);
  
  const previewStyle = computed(() => ({
    color: previewTextColor.value,
    backgroundColor: previewBackgroundColor.value,
    backgroundImage: `url(${backgroundImageUrl.value || storeColors.backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }));
  
  const updatePreview = () => {
    // Code to update preview
  };
  
  const saveChanges = async () => {
    if (selectedAvatarFile.value) {
      await storeColors.updateAvatarImage(selectedAvatarFile.value);
    }
    if (selectedBackgroundFile.value) {
      await storeColors.updateBackgroundImage(selectedBackgroundFile.value);
    }
    storeColors.setPreviewColors(previewTextColor.value, previewBackgroundColor.value);
    await storeColors.saveColors();
    avatarText.value=tempAvatarText.value
    await storeColors.saveAvatarText(avatarText.value)
  
  };
    
  const cancelChanges = () => {
    previewTextColor.value = storeColors.textColor;
    previewBackgroundColor.value = storeColors.backgroundColor;
    tempAvatarText.value = storeColors.avatarText
  };
  
 
    onMounted(async()  => {
   await storeAuth.init()
if (!storeAuth.user.id) {
        router.push('/');
    }
    else{
    await storeColors.getAvatarUrl();
    avatarUrl.value = storeColors.avatarImageUrl;
    await storeColors.getAvatarText()
    tempAvatarText.value = storeColors.avatarText
    }
  });
  
 
  </script>
  
  <style scoped>
  .preview-container {
    position: relative;
    width: 100%;
    padding-top: 0; /* Aspect ratio: 2:1 */
  }
  
  /* Step Indicator */
  .preview-container .step-indicator {
    position: absolute;
    top: 0; /* Adjust as needed */
    left: 50%;
    transform: translateX(-50%);
    width: 90%; /* Adjust as needed */
    height: 10%; /* Adjust as needed */
  }
  
  /* Avatar Card */
  .preview-container .avatar-card {
  position: absolute;
  top: 20%;
  left: 5%;
  width: 30%; /* Adjust as needed */
  height: 60%;
  overflow: hidden;
  max-width: 60px; /* Maximum width for the avatar card */
}

/* Image and Figure within the Avatar Card */
.preview-container .avatar-card figure,
.preview-container .avatar-card img {
  max-width: 100%; /* Ensure they don't exceed the card's width */
  height: auto; /* Maintain aspect ratio */
}
  
  /* Services Cards */
  .preview-container .services {
    position: absolute;
    top: 20%; /* Adjust as needed */
    right: 5%; /* Adjust as needed */
    width: 60%; /* Adjust as needed */
    height: 60%; /* Adjust as needed */
    overflow: hidden;
  }
  
  /* Adjustments for smaller screens */
  @media (max-width: 361px) {
    .preview-container {
      padding-top: 0%; /* Adjust for a different aspect ratio */
    }

  
    .preview-container .services {
      width: 90%; /* Full width on smaller screens */

      left: 5%; /* Centered with a margin */
      top: 5%; /* Adjust as needed */
      height: 45%; /* Adjust as needed */
    }
    
    .preview-container .services {
      top: 55%; /* Position below the avatar card */
    }
  }
  @media (max-width: 360px) {
  .columns.is-mobile {
    flex-direction: column;
    align-items: center;
  }

  .card {
    width: 100%;
    max-width: 100%;
    margin: auto;
  }
}
  </style>
  
