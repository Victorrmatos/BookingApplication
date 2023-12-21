import { defineStore } from 'pinia'
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/js/firebase'
export const useStoreDateTime = defineStore('storeDateTime', {
    state: () => {
        return { 
            stdWeek:{
                Tz6MddPkSmX85V1rJcHR:{
                    // sun:
                    // ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"],
                    // mon:
                    // ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"],
                    // tue:
                    // ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"],
                    // wed:
                    // ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"],
                    // thu:
                    // ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"],
                    // fri:
                    // ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"],
                    // sat:
                    // ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"],
                }
            }
            ,
           
            dates: [
                // {
                //     id: 'id1',
                //     date: '29-12-2023',
                //     availableSlots: ["06:00", "07:00"],
                //     bookings: 'booking id1 06:30'
                // },
                
            ],

            slots: {
            times: ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"]
            },
        }
    },
    actions: {
        async getStdWeek() {
                onSnapshot(collection(db, "stdWeek"), (querySnapshot) => {
                
                querySnapshot.forEach((doc) => {
                let stdWeek = doc.data()
                this.stdWeek.Tz6MddPkSmX85V1rJcHR = stdWeek
                });
                
              });

            // const querySnapshot = await getDocs(collection(db, "stdWeek"));
            // querySnapshot.forEach((doc) => {
            //   let stdWeek = doc.data()
            //   this.stdWeek.Tz6MddPkSmX85V1rJcHR = stdWeek
             
            // });
        },
        async getCustomDays() {
            const querySnapshot = await getDocs(collection(db, "customDays"));
            let customDays = [];
            querySnapshot.forEach((doc) => {
              let dayData = doc.data();
              customDays.push(dayData);
            });
            // Replace the current dates with the fetched data to prevent duplication
            this.dates = customDays;
          },

        addDate(newDate, newAvailableSlots, newBookings) {
            let currentDate = new Date().getTime(),
            id = currentDate.toString()
            
            let date = {
                id,
                date: newDate,
                availableSlots: newAvailableSlots,
                bookings: newBookings
            }
            this.dates.unshift(date)
        },
        deleteDate(idToDelete) {
            this.dates = this.dates.filter(date => date.id !== idToDelete )
        },
        updateDate(id, date, availableSlots, bookings){
            let index = this.dates.findIndex(date => { return date.id === id})
            this.dates[index].date = date
            this.dates[index].availableSlots = availableSlots
            this.dates[index].bookings = bookings
        },
        // getDateSlots(date){
        //     let index = this.dates.findIndex(date => { return date.date === date})
        //     return this.dates[index].availableSlots
        // }
    },
    getters: {
        getDate: (state) => {
            return (id) => {
                return state.dates.filter(date => { return date.id === id })[0].date
            }
        },
        getDateSlots: (state) => {
            return (id) => {
                return state.dates.filter(date => { return date.id === id })[0].availableSlots
            }
        },
        getBookings: (state) => {
            return (id) => {
                return state.dates.filter(date => { return date.id === id })[0].bookings
            }
        }
    }
})