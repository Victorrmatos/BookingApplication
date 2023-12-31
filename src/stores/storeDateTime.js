import { defineStore } from 'pinia';
import {
    collection,
    onSnapshot,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    getDoc,
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
        async addCustomDay(newDate, newAvailableSlots, bookings =[]) {
            try {
              const docRef = await addDoc(customDaysCollectionRef, {
                date: newDate,
                availableSlots: newAvailableSlots,
                bookings: bookings
              });
              if (docRef.id) {
                return docRef.id;
              } else {
                console.error('Unable to obtain ID from docRef:', docRef);
                throw new Error('Unable to obtain ID from docRef');
              }
            } catch (error) {
              console.error('Error adding custom day:', error);
              throw error; // Rethrow the error to handle it at the calling site
            }
            return docRef.id
          },
          

          async removeBookingFromDay(dateId, bookingId, bookingSlots){
            const docRef = doc(customDaysCollectionRef, dateId);
            const customDayDoc = await getDoc(docRef);
            if (customDayDoc.exists()) {
                let customDayData = customDayDoc.data();
                let newAvailableSlots = customDayData.availableSlots

                for (let i=0;i<bookingSlots.length;i++){
                    newAvailableSlots.push(bookingSlots[i])
                }

                let newBookings = customDayData.bookings.filter(item => item !== bookingId)

                await updateDoc(docRef, {
                    
                    availableSlots: newAvailableSlots,
                    bookings: newBookings
                });

            }

          },
          async updateCustomDay(id, date, newAvailableSlots, newBookingId) {
            try {
                const docRef = doc(customDaysCollectionRef, id);
                const customDayDoc = await getDoc(docRef);
        
                if (customDayDoc.exists()) {
                    let customDayData = customDayDoc.data();
        
                    // Validate and set default values
                    const validatedDate = date || ""; // Use an empty string or a valid default
                    const validatedAvailableSlots = Array.isArray(newAvailableSlots) ? newAvailableSlots : [];
                    
                    // Initialize bookings array if it's not present
                    const validatedBookings = Array.isArray(customDayData.bookings) ? [...customDayData.bookings] : [];
                    // Add the new booking ID to the bookings array
                    if (newBookingId) {
                        validatedBookings.push(newBookingId);
                    }
        
              
        
                    // Update the document with validated data
                    await updateDoc(docRef, {
                        date: validatedDate,
                        availableSlots: validatedAvailableSlots,
                        bookings: validatedBookings
                    });
                } else {
                    console.error('Custom day document does not exist for ID:', id);
                }
            } catch (error) {
                console.error('Error updating custom day:', error);
            }
        }
,        
        
        
  

        deleteDate(idToDelete) {
            this.dates = this.dates.filter(date => date.id !== idToDelete);
        },
      
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
