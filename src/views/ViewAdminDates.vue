<template >
  <NavBar />
  <div @keyup.enter="saveChanges">
    <div>
      
      <h2 class="title is-size-4 is-full has-text-white has-text-centered mt-4">Modifying Time-Slots For <span class="title has-text-white">{{ displayText }}</span></h2>
      
      
      <div class="columns transparent-80 is-mobile">
        <div class="column is-one-third mt-2">
          <div v-for="(slot, index) in stdSlots" :key="slot">
            <div v-if="index % 2 === 0" class="buttons column">
              <button 
              :class="['button', 'is-rounded', 'is-small', 'is-marginless', 'custom-button', { 'is-active': isActiveSlot(slot) }]" 
              @click="toggleActiveSlot(slot)" 
              :value="slot">
              {{ slot }}
            </button>
            
          </div>
        </div>
      </div>
      <div class="column is-one-third mt-2">
        <div v-for="(slot, index) in stdSlots" :key="slot">
          <div v-if="index % 2 === 1" class="buttons column">
            <button 
            :class="['button', 'is-rounded', 'is-small', 'is-marginless', 'custom-button', { 'is-active': isActiveSlot(slot) }]" 
            @click="toggleActiveSlot(slot)" 
            :value="slot">
            {{ slot }}
          </button>
          
        </div>
      </div>
    </div>
    
    <div id="app" class="calendar column ml-4 is-one-third">
      <div class="column has-text-white"> 
        <label class="label is-3 has-text-white" for="selectedWeekday">Select a weekday:</label>
        <div class="select">      
          <select class="select is-large" id="selectedWeekday" v-model="selectedWeekday">
            <option @click="weekDaySelect" v-for="(timeSlots, day) in storeDateTime.stdWeek" :key="day" :value="day">
              {{ fullWeekdayNames[day] }}
            </option>
          </select>
        </div>  
      </div>
      <label class="label is-3 mt-3 has-text-white" for="calendar">Or select a day in the calendar:</label>
      <v-date-picker
      class="calendar"
      v-model="date"
      style="width:100%"
      :min-date="new Date()"
      :masks="masks"
      :attributes="dateAttributes"
      @click="calendarSelect" 
      :style="{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }"
      />
      <div class="is-full mt-5">
        <button class="button is-medium" @click="saveChanges">Save time slots available for {{ displayText }}</button>
        
      </div>
    </div>
    
  </div>
  
</div>
</div>
</template>

<script setup>
import { provide, ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useStoreDateTime } from '@/stores/storeDateTime';
import NavBar from '@/components/Layout/NavBar.vue';


const storeDateTime = useStoreDateTime();
const selectedWeekday = ref('sun');
const date = ref(new Date());
const masks = ref({ modelValue: 'WWW-DD-MM-YYYY' });
const stdSlots = ref([]);
const tempActiveTimeSlots = ref([]); // This holds the temporary state
const lastSelected = ref({ type: null, value: null }); // To track last selection
const dateAttributes = ref([]);
const selected = ref('calendar');


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
  
  if (dateObj) {
    tempActiveTimeSlots.value = [...dateObj.availableSlots];
  } else {
    updateSlotsForSelectedDate();
  }
  
};



const weekDaySelect = () => {
  
  selected.value = 'weekday';
  lastSelected.value = { type: 'weekday', value: selectedWeekday.value };
  
  tempActiveTimeSlots.value = storeDateTime.stdWeek[selectedWeekday.value];
  updateSlotsForSelectedDate()
};





onMounted(() => {
  updateDateAttributes();
  const handleKeyup = (event) => {
    if (event.key === 'Enter') {
      saveChanges();
    }
  };
  
  window.addEventListener('keyup', handleKeyup);

  updateDateAttributes();
  

  weekDaySelect();
  stdSlots.value = storeDateTime.slots.times;
  
  onUnmounted(() => {
    window.removeEventListener('keyup', handleKeyup);
  });
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
  dateAttributes.value = attributes;
};

// Update dateAttributes when the selected weekday or date's month changes
watch(selectedWeekday, updateDateAttributes);
watch(() => date.value?.getMonth(), updateDateAttributes, { deep: true });


 

// Update watchers
watch(() => date.value.getMonth(), () => {
  // This will trigger reactivity in the dateAttributes computed property
  
  weekDaySelect()
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
        console.log(customDay.id, customDay.date, newAvailableSlots)
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


<style>

.column-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.column-item {
  
  box-sizing: border-box;
  padding: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-button {
  background-color: #ccc; 
  color: #333; 
  width: 100%;
}

.is-active {
  background-color: #fff;
  color: #fff;
  border: 1px solid #fff;
}
</style>