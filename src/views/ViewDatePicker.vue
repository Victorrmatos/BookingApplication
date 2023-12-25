  <template>
          <StepIndicator class="step-indicator" :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" />

    <div class="columns is-vcentered">
      <!-- Date Picker Section -->
      <div id="app" class="calendar column is-half">
        <v-date-picker
        v-model="state.date"
        ref="calendar"
        class="calendar is-dark transparent-70"
        style="width:100%"
        :style="{ backgroundColor: selectedColor }"
        :min-date="new Date()"
        :masks="state.masks"
        :disabled-dates="state.disabledDates"
        @click="handleCalendarClick()"
        />
      </div>
      
      <!-- Time Slots Section -->
      <div class="column is-half">
        <h2 class="title is-5 has-text-white">{{ state.date.toDateString() }}</h2>
        <div class="columns">
          <!-- insert progress bar here -->
          <div class="column is-half mt-2">
            
            <ul>
              <template v-for="(slot, index) in state.dateSlots" :key="index">
                <a @click="selectedDateTime(slot, index)">
                  <div
                    :class="{'selectedSlot': isSelected(slot)}"
                    class="card mb-2 has-text-centered is-dark transparent-70"
                    
                  >
                    <li v-if="index % 2 === 0 && hasConsecutiveSlots(slot, storeBookings.$state.newBooking.duration, index, state.dateSlots)">{{ slot }}</li>
                  </div>
                </a>
              </template>
            </ul>
          </div>
          <div class="column is-half">
            <ul>
              <template v-for="(slot, index) in state.dateSlots" :key="index">
                <a @click="selectedDateTime(slot, index)">
                  <div
                    :class="{'selectedSlot': isSelected(slot)}"
                    class="card mb-2 has-text-centered is-dark transparent-70"
                    
                  >

                    <li v-if="index % 2 === 1 && hasConsecutiveSlots(slot, storeBookings.$state.newBooking.duration, index, state.dateSlots)">{{ slot }}</li>
                  </div>
                </a>
              </template>
            </ul>
          </div>
        </div>
        <RouterLink to="/form">
          
          <button v-if="state.tempSelectedSlots" class="button" @click="confirmSelection">Confirm Time</button>
          
        </RouterLink>
      </div>
    </div>
  </template>

  <script setup>
  import { onMounted, watch, reactive, computed, ref } from 'vue';
  import { useStoreDateTime } from '@/stores/storeDateTime';
  import { useStoreBookings } from '@/stores/storeBookings';
  import StepIndicator from '@/components/Layout/StepIndicator.vue'
  import { useStoreColors } from '@/stores/storeColors.js';


  /*
  appearance
  */
  const storeColors = useStoreColors();
  const selectedColor = computed(() => storeColors.selectedColor)


  /*
  store
  */
  const storeDateTime = useStoreDateTime();
  const storeBookings = useStoreBookings();


  const state = reactive({
    date: new Date(),
    masks: { modelValue: 'WWW-DD-MM-YYYY' },
    dateSlots: [],
    isLoading: true, // Added loading state
    disabledDates: [], // Initialize disabled dates
    tempSelectedSlots: []

  });
  /*
  step indicator
  */
  const currentStep = ref(1)
  const maxStepReached = ref(1)

  /*
  first of the slots being booked
  */
  const isSelected = (slot) => {
    return state.tempSelectedSlots[0]===slot;
  };

  const formatDate = (date) => {
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const updateDateSlots = async () => {
  const formattedDate = formatDate(state.date);
  await storeDateTime.getCustomDays(); // Ensure data is loaded
  const dateObj = storeDateTime.dates.find((d) => d.date === formattedDate);

  const weeklySlots = getWeeklySlots(state.date);
  state.dateSlots = dateObj && dateObj.availableSlots ? dateObj.availableSlots : weeklySlots;

  if (!dateObj ) {
    console.warn(`No data found for date: ${formattedDate}`);
  }

  state.isLoading = false; // Update loading state
};

  const getWeeklySlots = (date) => {
    const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const weekDay = weekdays[date.getDay()].toLowerCase();
    return storeDateTime.stdWeek[weekDay] || [];
  };

  onMounted(async () => {
    await storeDateTime.getStdWeek();
    await storeDateTime.getCustomDays();
    updateDateSlots();
    state.disabledDates = calculateDisabledDates(); // Set initial disabled dates
  });



  const hasConsecutiveSlots = (slot, duration, index, slotsArray) => {
    // Ensure required arrays are defined
    if (!storeDateTime.slots.times || !slotsArray) {
      console.error("One of the required arrays is undefined.");
      return false;
    }

    // Find the starting index of the given slot in the standard times array
    const startingIndex = storeDateTime.slots.times.indexOf(slot);
    if (startingIndex === -1) {
      return false;
    }

    // Check if there are enough consecutive slots available
    for (let i = 0; i < duration; i++) {
      // Calculate the index of the next required slot in both the standard times array and the date-specific slots array
      const requiredSlotIndexInStore = startingIndex + i;
      const requiredSlotIndexInDateSlots = index + i;

      // Check if the indices are within bounds and if the slots match
      if (requiredSlotIndexInStore >= storeDateTime.slots.times.length || 
          requiredSlotIndexInDateSlots >= slotsArray.length ||
          storeDateTime.slots.times[requiredSlotIndexInStore] !== slotsArray[requiredSlotIndexInDateSlots]) {
        return false;
      }
    }

    return true;
  };

  const hasEnoughConsecutiveSlots = (slots) => {
    for (let i = 0; i < slots.length; i++) {
      if (hasConsecutiveSlots(slots[i], storeBookings.$state.newBooking.duration, i, slots)) {
        return true;
      }
    }
    return false;
  };

  const isDateAvailable = (date) => {
    const formattedDate = formatDate(date);
    const dateObj = storeDateTime.dates.find((d) => d.date === formattedDate);
    const availableSlots = dateObj && dateObj.availableSlots ? dateObj.availableSlots : getWeeklySlots(date);

    return hasEnoughConsecutiveSlots(availableSlots);
  };

  const handleCalendarClick = () => {
    updateDateSlots();
    state.disabledDates = calculateDisabledDates();
  };

  const calculateDisabledDates = () => {
    let disabled = [];
    const selectedYear = state.date.getFullYear();
    const selectedMonth = state.date.getMonth();

    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth + 13, 0);

    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      if (!isDateAvailable(new Date(d))) {
        disabled.push(new Date(d));
      }
    }

    return disabled.map(date => {
      return { start: date, end: date };
    });
  };

  const selectedDateTime = (slot, index) => {
    const selectedSlots = [slot];
    const duration = storeBookings.$state.newBooking.duration;

      for (let i = 1; i < duration; i++) {
        
        selectedSlots.push(state.dateSlots[index + i]);
      }
      storeBookings.newBooking.date=formatDate(state.date)
      storeBookings.newBooking.slots=selectedSlots
      state.tempSelectedSlots=selectedSlots
  };


  

  const confirmSelection = () => {
  storeBookings.newBooking.date = formatDate(state.date);
  storeBookings.newBooking.slots = [...state.tempSelectedSlots]; // Create a copy of the array
  storeBookings.newBooking.weekDay = state.date.toDateString().slice(0, 3).toLowerCase();
  const formattedDate = formatDate(state.date);
  const dateObj = storeDateTime.dates.find((d) => d.date === formattedDate);

  if (dateObj) {
    dateObj.availableSlots = dateObj.availableSlots.filter((s) => !state.tempSelectedSlots.includes(s));
  }

  state.tempSelectedSlots = []; // Clear the temporary selected slots
};

  </script>

  <style scoped>
  a, h2{
      user-select: none;
  }

  .card{
    background-color: #ccc;
  }
  .selectedSlot {
    background-color: #fff; /* Set the background color to white for selected slots */
  }
  .calendar, .step-indicator, h2 {
      user-select: none;
  }
  </style>
