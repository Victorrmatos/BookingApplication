import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar'
import router from '@/router'
import 'v-calendar/style.css';
import CalendarComponent from '@/components/CalendarComponent.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';

const pinia = createPinia();

createApp(App)
.use(router)
.use(setupCalendar, {})
.use(pinia)

.component('VCalendar', Calendar)
.component('VDatePicker', DatePicker)
.component('CalendarComponent', CalendarComponent)
.use(createPinia())
.mount('#app')