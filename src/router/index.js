import { createRouter, createWebHashHistory } from 'vue-router'
import ViewServices from '@/views/ViewServices.vue'
import ViewEditService from '@/views/ViewEditService.vue'
import ViewDatePicker from '@/views/ViewDatePicker.vue'
import ViewForm from '@/views/ViewForm.vue'
import ViewConfirmation from '@/views/ViewConfirmation.vue'
import ViewAdminServices from '@/views/ViewAdminServices.vue'
import ViewAdminDates from '@/views/ViewAdminDates.vue'
import ViewClients from '@/views/ViewClients.vue'
import ViewBookings from '@/views/ViewBookings.vue'
import ViewAppearance from '@/views/ViewAppearance.vue'


const routes = [
  {
    path: '/',
    name: 'services',
    component: ViewServices
  },  
  {
    path: '/clients',
    name: 'clients',
    component: ViewClients
  },
  {
    path: '/bookings',
    name: 'bookings',
    component: ViewBookings
  },
  {
    path: '/adminServices',
    name: 'admin-services',
    component: ViewAdminServices
  },
  {
    path: '/adminDates',
    name: 'admin-dates',
    component: ViewAdminDates
  },
  
  {
    path: '/editService/:id',
    name: 'edit-service',
    component: ViewEditService
  },
  {
    path: '/date',
    name: 'date',
    component: ViewDatePicker
  },
  {
    path: '/appearance',
    name: 'appearance',
    component: ViewAppearance
  },
  {
    path: '/form',
    name: 'form',
    component: ViewForm
  },
  {
    path: '/confirmation',
    name: 'confirmation',
    component: ViewConfirmation
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router