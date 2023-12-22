import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar'
import router from '@/router'
import 'v-calendar/style.css';
import CalendarComponent from '@/components/CalendarComponent.vue';

createApp(App)
.use(router)
.use(setupCalendar, {})

.component('VCalendar', Calendar)
.component('VDatePicker', DatePicker)
.component('CalendarComponent', CalendarComponent)
.use(createPinia())
.mount('#app')