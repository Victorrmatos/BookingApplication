import { defineStore } from 'pinia'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/js/firebase'

export const useStoreBookings = defineStore('storeBookings', {
    state: () => ({
        bookings: {}, // Initialize bookings as an empty object
        newBooking: {}
    }),
    
    actions: {
        async getBookings() {
            
            try {
                const querySnapshot = await getDocs(collection(db, "bookings"));
                const bookings = {};
                
                querySnapshot.forEach((doc) => {
                    // Use the document ID as the key in the bookings object
                    const bookingData = doc.data();
                    bookings[doc.id] = bookingData;
                });
                
                // Update the state with the fetched bookings
                this.bookings = bookings;
                
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        }
    }
});