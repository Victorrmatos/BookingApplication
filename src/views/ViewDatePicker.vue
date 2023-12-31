  <template>
    <StepIndicator class="step-indicator  pt-5" :totalSteps="4" :currentStep="currentStep" :maxStep="maxStepReached" />
    
    <div class="columns">
      <!-- Date Picker Section -->
      <div id="app" class="calendar column is-half mr-5">
        <v-date-picker
        v-model="state.date"
        ref="calendar"
        class="calendar is-dark transparent-70 ml-5 "
        style="width:93%"
        :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }"
        :min-date="new Date()"
        :masks="state.masks"
        :disabled-dates="state.disabledDates"
        @click="handleCalendarClick()"
        />
      </div>
      
      <!-- Time Slots Section -->
      
      <div class="column is-half has-text-centered">
        <div class="box transparent-80 confirmation ml-5 mr-5"
        :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }"
        >
        <h2 class="title is-5 ml-5 mr-5" :style="{ color: 'var(--text-color)' }">{{ state.date.toDateString() }}</h2>
      </div>
      
      
      <ul>
        
        <transition-group name="slot-transition" tag="ul" class="slots-container ml-5 mr-5">
          <template v-for="(slot, index) in state.dateSlots" :key="index">
            <li v-if="hasConsecutiveSlots(slot, storeBookings.$state.newBooking.duration, index, state.dateSlots)"
            :class="{'selectedSlot': isSelected(slot)}"
            class=" button custom-button is-rounded has-text-centered is-dark transparent-70"
            @click="selectedDateTime(slot, index)"
            :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }"
            style="border: 1px solid var(--text-color)">
            {{ slot }}
          </li>
        </template>
      </transition-group>
    </ul>
    <RouterLink to="/form">
      <div class="level">
  <div class="level-item has-text-centered">
  <button
  v-if="state.tempSelectedSlots[0]"
  @click="confirmSelection"
  class="button ml-5 mr-5 is-large is-responsive"
  :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }"
  
  >Confirm Time</button>
</div>
</div>
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
  if (state.date instanceof Date){
    const formattedDate = formatDate(state.date);
  await storeDateTime.getCustomDays(); // Ensure data is loaded
  const dateObj = storeDateTime.dates.find((d) => d.date === formattedDate);
  
  const weeklySlots = getWeeklySlots(state.date);

  // Sort slots in ascending order
  const sortedSlots = dateObj && dateObj.availableSlots
                        ? dateObj.availableSlots.sort()
                        : weeklySlots.sort();

  state.dateSlots = sortedSlots;
  
  if (!dateObj ) {
    console.warn(`No data found for date: ${formattedDate}`);
  }
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
  state.tempSelectedSlots =[]
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


.selectedSlot {
  background-color: var(--text-color) !important; /* Set the background color to white for selected slots */
  color: var(--background-color) !important; /* Set the background color to white for selected slots */
  
}
.calendar, .step-indicator, h2 {
  user-select: none;
}

.slot-transition-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.slot-transition-enter-active {
  transition: all 0.5s;
}

.custom-button {
  margin: 5px; /* Spacing between buttons */
  flex-grow: 0; /* Prevent buttons from growing */
  flex-shrink: 0; /* Prevent buttons from shrinking */
}
/* Adjust button width if needed, or use min-width and max-width to control size */
.custom-button {
  width: calc(50% - 10px); /* Example: half width minus margin */
}

.slots-container {
  display: flex; /* Use Flexbox */
  flex-wrap: wrap; /* Allow items to wrap to the next line */
  list-style: none; /* Remove default list styling */
  padding: 0; /* Remove default padding */
  margin: 0 0 20px 0; /* Adjust margin as needed */
  
}

</style>
