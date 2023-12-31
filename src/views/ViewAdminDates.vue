<template>
  <NavBar />
  
  <div @keyup.enter="saveChanges">
    <div class="box transparent-80 confirmation" :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }">
      <div class="columns is-mobile transparent-80">
        <div class="column has-text-centered">
          <label class="label is-3 " for="selectedWeekday" :style="{ color: storeColors.textColor }">Select a weekday:</label>
          <div class="select control">
            <select class="select is-large" id="selectedWeekday" v-model="selectedWeekday" :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }" v-autofocus>
              <option v-for="(timeSlots, day) in storeDateTime.stdWeek" :key="day" :value="day">
                {{ fullWeekdayNames[day] }}
              </option>
            </select>
          </div>
          <label class="label is-3 mt-5 " for="calendar" :style="{ color: storeColors.textColor }">Or select a day in the calendar:</label>
          <v-date-picker
          class="calendar"
          v-model="date"
          style="width: 100%"
          :min-date="new Date()"
          :masks="masks"
          :attributes="dateAttributes"
          @click="calendarSelect" 
          :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }"
          />
          <div class="is-full mt-5 ">
            <transition name="fade">
              <button v-if="displayText" class="button is-large is-responsive" @click="saveChanges" :style="{ backgroundColor: storeColors.textColor, color: storeColors.backgroundColor }" style="width: 100%">
                <span class="file-icon">
                  <i class="fas fa-save"></i>
                </span>
                Save changes for {{ displayText }}
              </button>
            </transition>
          </div>
        </div>
        
        <div class="column is-two-thirds has-text-centered">
          <transition name="fade">
            <div v-if="displayText">
              <h2 class="title is-size-4  has-text-centered" :style="{ color: storeColors.textColor }">
                Modifying Time-Slots For <span class="title " :style="{ color: 'var(--text-color)' }">{{ displayText }}</span>
              </h2>
              <div class="slot-indicator ml-5">
                <i class="fas fa-circle mr-2" :style="{ color: storeColors.textColor }"></i>
                <h2 class="ml-5" :style="{ color: 'var(--text-color)' }">Slots Available for Bookings</h2>
              </div>
              <div class="buttons-container">
          <div v-for="(slot, index) in stdSlots" :key="index" class="column is-half">
            <button 
              :class="['button', 'custom-button', 'is-fullwidth', 'is-rounded', { 'is-active': isActiveSlot(slot), 'is-booked': isBookedSlot(slot) }]" 
              @click="toggleActiveSlot(slot)" 
              :disabled="isBookedSlot(slot)"
              style="height: 30px"
              :style="{ backgroundColor: storeColors.backgroundColor, color: storeColors.textColor }"
            >
              {{ isBookedSlot(slot) ? 'Booked' : slot }}
            </button>
          </div>
        </div>
        </div>
      </transition>
    </div>
  </div>
</div>
</div>
</template>


<script setup>
import { provide, ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useStoreDateTime } from '@/stores/storeDateTime';
import { useStoreBookings } from '@/stores/storeBookings';
import { vAutofocus } from '@/directives/vAutofocus'
import { useRouter } from 'vue-router';
import { useStoreAuth } from '@/stores/storeAuth'

const router = useRouter()


const storeAuth = useStoreAuth()

import NavBar from '@/components/Layout/NavBar.vue';
import { useStoreColors } from '@/stores/storeColors'

const storeBookings = useStoreBookings()

const storeColors = useStoreColors()
const storeDateTime = useStoreDateTime();
const selectedWeekday = ref('sun');
const date = ref(new Date());
const masks = ref({ modelValue: 'WWW-DD-MM-YYYY' });
const stdSlots = ref([]);
const tempActiveTimeSlots = ref([]); // This holds the temporary state
const lastSelected = ref({ type: null, value: null }); // To track last selection
const dateAttributes = ref([]);
const selected = ref('calendar');
const dayBookedSlots = ref([])
const isBookedSlot = (slot) => {
  return dayBookedSlots.value.includes(slot);
};
const weekdayToNumber = (weekday) => {
  const map = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
  return map[weekday.toLowerCase()];
};

const selectedWeekdayNumber = ref(weekdayToNumber(selectedWeekday.value));

watch(selectedWeekday, (newValue) => {
  selectedWeekdayNumber.value = weekdayToNumber(newValue);
});

const displayText = computed(() => {
  if (selected.value === 'calendar day' && date.value) {
    return `${formatDate(date.value)}`;
  } else if (selected.value === 'weekday') {
    return `${fullWeekdayNames[selectedWeekday.value]}`;
  }
  return '';
});

const formatDate = (date) => {
  let d = new Date(date);
  let day = String(d.getDate()).padStart(2, '0');
  let month = String(d.getMonth() + 1).padStart(2, '0');
  let year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const updateSlotsForSelectedDate = () => {
  if (date.value) {
    const selectedWeekdayNumber = weekdayToNumber(selectedWeekday.value);
    const weekDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][selectedWeekdayNumber];
    
    
    // Rest of the code
    tempActiveTimeSlots.value = storeDateTime.stdWeek[weekDay];
  }
};

watch(() => date.value, (newValue, oldValue) => {
  if (newValue && (!oldValue || newValue.getMonth() !== oldValue.getMonth())) {
    // Recalculate attributes when the month changes
  }
}, { deep: true });


// Initially set the slots for the current date
updateSlotsForSelectedDate();

const calendarSelect = () => {
  selected.value = 'calendar day';
  lastSelected.value = { type: 'calendar', value: date.value };
  
  let selectedDateFormatted = formatDate(date.value);
  let dateObj = storeDateTime.dates.find(d => d.date === selectedDateFormatted);
  let bookings = storeBookings.bookings.filter(item => item.date === selectedDateFormatted);
  dayBookedSlots.value = bookings.map(item => item.slots).flat();
  
  
  if (dateObj) {
    tempActiveTimeSlots.value = [...dateObj.availableSlots];
  } else {
    updateSlotsForSelectedDate();
  }
  
};



const weekDaySelect = () => {
  dayBookedSlots.value = []
  selected.value = 'weekday';
  lastSelected.value = { type: 'weekday', value: selectedWeekday.value };
  
  tempActiveTimeSlots.value = storeDateTime.stdWeek[selectedWeekday.value];
  updateSlotsForSelectedDate()
};






  onMounted(async()  => {
   await storeAuth.init()
if (!storeAuth.user.id) {
        router.push('/');
    }
    else{
  stdSlots.value = storeDateTime.slots.times;
  updateDateAttributes();
  const handleKeyup = (event) => {
    if (event.key === 'Enter') {
      saveChanges();
    }
  };
  
  window.addEventListener('keyup', handleKeyup);
  
  updateDateAttributes();
  
  
  weekDaySelect();
  
  onUnmounted(() => {
    window.removeEventListener('keyup', handleKeyup);
  });
}
});

watch(selectedWeekday, weekDaySelect);

const activeSlotsSet = computed(() => new Set(tempActiveTimeSlots.value));

const isActiveSlot = (slot) => {
  return activeSlotsSet.value.has(slot);
};
const toggleActiveSlot = (slot) => {
  
  try {
    if (!Array.isArray(tempActiveTimeSlots.value)) {
      tempActiveTimeSlots.value = [];
    }
    const index = tempActiveTimeSlots.value.indexOf(slot);
    if (index > -1) {
      tempActiveTimeSlots.value.splice(index, 1);
    } else {
      tempActiveTimeSlots.value.push(slot);
      tempActiveTimeSlots.value.sort()
    }
  } catch (error) {
    console.error('Error in toggleActiveSlot:', error);
  }
};


const fullWeekdayNames = {
  sun: 'Sundays',
  mon: 'Mondays',
  tue: 'Tuesdays',
  wed: 'Wednesdays',
  thu: 'Thursdays',
  fri: 'Fridays',
  sat: 'Saturdays',
};

const formattedWeekdays = computed(() => fullWeekdayNames[selectedWeekday.value] || '');

// CALENDAR MODS





const parseDate = (dateStr) => {
  if (typeof dateStr === 'string') {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  return null;
};

const getSelectedWeekdayNumber = () => {
  return weekdayToNumber(selectedWeekday.value);
};

const bookingDatesSet = computed(() => {
  const bookingDates = new Set();
  storeDateTime.dates.forEach(dateObj => {
    if (dateObj.bookings && dateObj.bookings.length > 0) {
      bookingDates.add(dateObj.date);
    }
  });
  return bookingDates;
});

const updateDateAttributes = () => {
  let attributes = [];
  if (selected.value === 'weekday' && date.value instanceof Date) {
    const startOfMonth = new Date(date.value.getFullYear(), date.value.getMonth(), 1);
    const endOfMonth = new Date(date.value.getFullYear(), date.value.getMonth() + 1, 0);
    
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === selectedWeekdayNumber.value) {
        attributes.push({
          key: `highlight-${d.toISOString()}`,
          highlight: { backgroundColor: 'blue' },
          dates: new Date(d),
        });
      }
    }
    
  }
  if ( date.value instanceof Date){
    const startOfMonth = new Date(date.value.getFullYear(), date.value.getMonth(), 1);
    const endOfMonth = new Date(date.value.getFullYear(), date.value.getMonth() + 1, 0);
    
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      let formattedDate = formatDate(d);
      let attribute = {
        key: `day-${formattedDate}`,
        dates: new Date(d)
      };
      
      if (bookingDatesSet.value.has(formattedDate)) {
        // Add a dot for days with bookings
        attribute.dot = {
          backgroundColor: 'blue' // Or any color you prefer
        };
      }
      
      attributes.push(attribute);
    }
  }
  dateAttributes.value = attributes;
};

// Update dateAttributes when the selected weekday or date's month changes
watch(selectedWeekday, updateDateAttributes);
watch(() => date.value?.getMonth(), updateDateAttributes, { deep: true });




// Update watchers
watch(() => date.value, () => {
  if (date.value !== null){
    date.value.getMonth()
    weekDaySelect()
  }
  // This will trigger reactivity in the dateAttributes computed property
  
}, { deep: true });

watch(selectedWeekday, () => {
  // Trigger reactivity when the selected weekday changes
}, { deep: true });







const saveChanges = async () => {
  const newAvailableSlots = [...tempActiveTimeSlots.value];
  
  if (lastSelected.value.type === 'calendar') {
    const selectedDateFormatted = formatDate(lastSelected.value.value);
    const dateObjIndex = storeDateTime.dates.findIndex(d => d.date === selectedDateFormatted);
    if (dateObjIndex !== -1) {
      const customDay = storeDateTime.dates[dateObjIndex];
      try {
        await storeDateTime.updateCustomDay(customDay.id, customDay.date, newAvailableSlots);
      } catch (error) {
        console.error('Error updating custom day:', error);
      }
    } else {
      try {
        const docRef = await storeDateTime.addCustomDay(selectedDateFormatted, newAvailableSlots);
        const newDate = {
          id: docRef,
          date: selectedDateFormatted,
          availableSlots: newAvailableSlots
        };
        storeDateTime.dates.push(newDate);
      } catch (error) {
        console.error('Error adding custom day:', error);
      }
    }
  } else if (lastSelected.value.type === 'weekday') {
    try {
      await storeDateTime.updateStdWeek(selectedWeekday.value, newAvailableSlots);
    } catch (error) {
      console.error('Error updating standard week:', error);
    }
  }
};


</script>


<style scoped>

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0px; /* Remove gap between buttons */
  margin-bottom: 0; /* Remove bottom margin */
}

.buttons-container .column {
  flex: 1;
  min-width: calc(50% - 4px); /* Adjusted to account for reduced gap */
}

.custom-button {
  width: 100%;
  font-size: 1.1em; /* Slightly larger text inside buttons */
}

.slot-indicator {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.is-active {
  background-color: var(--text-color) !important;
  color: var(--background-color) !important;
  border: 1px solid #fff;
}

.is-booked {
  background-color: grey !important;
  cursor: not-allowed;
}

@media (max-width: 1023px) {
  .columns.is-mobile {
    flex-direction: column;
    align-items: center;
  }
  
  .column {
    width: 90%;
    max-width: 90%;
    min-width:90%;
  }
  
  
}

@media (min-width: 1024px) {
  .column.is-one-third {
    width: 33.333%;
  }
  
  .column.is-two-thirds {
    width: 66.666%;
  }
}
</style>


