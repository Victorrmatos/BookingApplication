import { defineStore } from 'pinia';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/js/firebase';

const bookingsCollectionRef = collection(db, 'bookings');
const bookingsCollectionQuery = query(bookingsCollectionRef, orderBy('date', 'asc'));

export const useStoreBookings = defineStore('storeBookings', {
    state: () => ({
        bookings: [], // Initialize bookings as an empty array
        newBooking: {},
        bookingsLoaded: false
    }),
    
    actions: {
        async getBookings() {
            this.bookingsLoaded = false;
            onSnapshot(bookingsCollectionQuery, (querySnapshot) => {
                let bookings = [];
                querySnapshot.forEach((doc) => {
                    let booking = {
                        id: doc.id,
                        client: doc.data().client,
                        clientId: doc.data().clientId,
                        service: doc.data().service,
                        slots: doc.data().slots,
                        date: doc.data().date,
                    };
                    bookings.push(booking);
                });
                
                this.bookings = bookings;
                this.bookingsLoaded = true;
            });
        },
        async addBooking(newBookingClient, newBookingClientId, newBookingService, newBookingSlots, newBookingDate) {
            const docRef = await addDoc(bookingsCollectionRef, {
              client: newBookingClient,
              clientId: newBookingClientId,
              service: newBookingService,
              slots: newBookingSlots,
              date: newBookingDate,
            });
            return docRef.id; // Return the new booking ID
        },
      
        async deleteBooking(idToDelete) {
            await deleteDoc(doc(bookingsCollectionRef, idToDelete));
        },
      
        async updateBooking(id, client, clientId, service, slots, date) {
            await updateDoc(doc(bookingsCollectionRef, id), {
                client, 
                clientId, 
                service, 
                slots, 
                date
            });
        },
    },
});
