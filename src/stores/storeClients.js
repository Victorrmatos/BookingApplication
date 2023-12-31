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

const clientsCollectionRef = collection(db, 'clients');
const clientsCollectionQuery = query(
    clientsCollectionRef,
    orderBy('lName', 'asc')
    );
    
    export const useStoreClients = defineStore('storeClients', {
        state: () => ({
            clients: [],
            clientsLoaded: false
        }),
        
        
        actions: {
            async getClients() {
                this.clientsLoaded = false
                onSnapshot(clientsCollectionQuery, (querySnapshot) => {
                    let clients = [];
                    querySnapshot.forEach((doc) => {
                        let client = {
                            id: doc.id,
                            fName: doc.data().fName,
                            lName: doc.data().lName,
                            email: doc.data().email,
                            date: doc.data().date,
                            phone: doc.data().phone,
                            preferences: doc.data().preferences
                        };
                        clients.push(client);
                    });
                    
                    this.clients = clients
                    this.clientsLoaded = true
                });
            },

            async addClient(newClientfName, newClientlName, newClientPhone, newClientEmail, newClientPreferences) {
                let currentDate = new Date().getTime();
                let date = currentDate.toString();
            
                const docRef = await addDoc(clientsCollectionRef, {
                    fName: newClientfName,
                    lName: newClientlName,
                    email: newClientEmail,
                    phone: newClientPhone,
                    preferences: newClientPreferences,
                    date,
                });
            
                return docRef.id; // Return the ID of the newly added client
            }  ,
          
              async deleteClient(idToDelete) {
                await deleteDoc(doc(clientsCollectionRef, idToDelete));
              },
          
              async updateClient(id, fName, lName, phone, email, preferences) {
                await updateDoc(doc(clientsCollectionRef, id), {
                  fName,
                  lName,
                  phone,
                  email,
                  preferences
                });
              },
            },
          
            getters: {
              getClientFName: (state) => {
                return (id) => {
                  const client = state.clients.find((client) => client.id === id);
                  return client ? client.fName : '';
                };
              },
          
              getClientLName: (state) => {
                return (id) => {
                  const client = state.clients.find((client) => client.id === id);
                  return client ? client.lName : '';
                };
              },
          
              getClientPhone: (state) => {
                return (id) => {
                  const client = state.clients.find((client) => client.id === id);
                  return client ? client.phone : '';
                };
              },

              getClientEmail: (state) => {
                return (id) => {
                  const client = state.clients.find((client) => client.id === id);
                  return client ? client.email : '';
                };
              },

              getClientPreferences: (state) => {
                return (id) => {
                  const client = state.clients.find((client) => client.id === id);
                  return client ? client.preferences : '';
                };
              },
            },
          });
          