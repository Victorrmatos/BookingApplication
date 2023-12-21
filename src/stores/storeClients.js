import { defineStore } from 'pinia'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/js/firebase'

export const useStoreClients = defineStore('storeClients', {
    state: () => ({
        clients: {}
    }),
    
    
    actions: {
        async getClients() {
            
            try {
                const querySnapshot = await getDocs(collection(db, "clients"));
                const clients = {};
                
                querySnapshot.forEach((doc) => {
                    // Use the document ID as the key in the bookings object
                    const clientData = doc.data();
                    clients[doc.id] = clientData;
                });
                
                // Update the state with the fetched bookings
                this.clients = clients;
                
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        }
    }
});