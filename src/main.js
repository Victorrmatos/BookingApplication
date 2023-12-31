import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar'
import router from '@/router'
import 'v-calendar/style.css';
import CalendarComponent from '@/components/CalendarComponent.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';


const pinia = createPinia()
pinia.use(({ store }) => {
    store.router = markRaw(router)
  })
createApp(App)
.use(router)
.use(setupCalendar, {})

.component('VCalendar', Calendar)
.component('VDatePicker', DatePicker)
.component('CalendarComponent', CalendarComponent)
.use(pinia)
.mount('#app')