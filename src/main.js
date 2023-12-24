import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar'
import router from '@/router'
import 'v-calendar/style.css';
import CalendarComponent from '@/components/CalendarComponent.vue';
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faTimes } from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(faTimes)


createApp(App)
.use(router)
.use(setupCalendar, {})


.component('VCalendar', Calendar)
.component('VDatePicker', DatePicker)
.component('CalendarComponent', CalendarComponent)
.component('font-awesome-icon', FontAwesomeIcon)
.use(createPinia())
.mount('#app')