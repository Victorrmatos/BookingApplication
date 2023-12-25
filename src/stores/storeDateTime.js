import { defineStore } from 'pinia';
import {
    collection,
    onSnapshot,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    addDoc,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '@/js/firebase';

const customDaysCollectionRef = collection(db, 'customDays');
const customDaysCollectionQuery = query(
    customDaysCollectionRef,
    orderBy('date', 'asc')
);

const stdWeekCollectionRef = collection(db, 'stdWeek');


export const useStoreDateTime = defineStore('storeDateTime', {
    state: () => ({
        stdWeek: {
            Tz6MddPkSmX85V1rJcHR: {}
        },
        dates: [],
        slots: {
            times: ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"]
        }
    }),
    actions: {
       
            async getStdWeek() {
                this.stdWeekLoaded = false
              onSnapshot(stdWeekCollectionRef, (querySnapshot) => {
                let stdWeek = [];
                querySnapshot.forEach((doc) => {
                  let std = {
                    sun: doc.data().sun,
                    mon: doc.data().mon,
                    tue: doc.data().tue,
                    wed: doc.data().wed,
                    thu: doc.data().thu,
                    fri: doc.data().fri,
                    sat: doc.data().sat,
                    sun: doc.data().sun,
                  };
                  stdWeek=(std);
                });
               
                  this.stdWeek = stdWeek
                  this.stdWeekLoaded = true
              });
              
        },
        
        async updateStdWeek(weekDay, slots) {
            await updateDoc(doc(stdWeekCollectionRef, 'Tz6MddPkSmX85V1rJcHR'), {
                [weekDay]: slots
              });
          },
        async getCustomDays() {
            onSnapshot(customDaysCollectionQuery, (querySnapshot) => {
                let customDays = [];
                querySnapshot.forEach((doc, id) => {
                    let dayData = doc.data();
                    dayData.id = doc.id
                    customDays.push(dayData);
                });
                this.dates = customDays;
            });
        },
        async addCustomDay(newDate, newAvailableSlots) {
            console.log(newDate, newAvailableSlots)
            const docRef = await addDoc(customDaysCollectionRef, {    
                date: newDate,
                availableSlots: newAvailableSlots,
             
            });

        },

        
    async updateCustomDay(id, date, newAvailableSlots) {
        await updateDoc(doc(customDaysCollectionRef, id), {
            date,
            availableSlots: newAvailableSlots,
        });
      },

        deleteDate(idToDelete) {
            this.dates = this.dates.filter(date => date.id !== idToDelete);
        },
        updateDate(id, date, availableSlots, bookings) {
            let index = this.dates.findIndex(date => date.id === id);
            this.dates[index].date = date;
            this.dates[index].availableSlots = availableSlots;
            this.dates[index].bookings = bookings;
        }
    },
    getters: {
        getDate: (state) => {
            return (id) => {
                return state.dates.find(date => date.id === id)?.date;
            };
        },
        getDateSlots: (state) => {
            return (id) => {
                return state.dates.find(date => date.id === id)?.availableSlots;
            };
        },
        getBookings: (state) => {
            return (id) => {
                return state.dates.find(date => date.id === id)?.bookings;
            };
        }
    }
});
