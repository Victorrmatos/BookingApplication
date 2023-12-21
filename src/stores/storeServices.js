import { defineStore } from 'pinia'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/js/firebase'

export const useStoreServices = defineStore('storeServices', {
    state: () => {
        return { 
            services: [
                
                
            ]
        }
    },
    actions: {
        async getServices() {
            try {
                const querySnapshot = await getDocs(collection(db, "services"));
                const services = [];
                
                querySnapshot.forEach((doc) => {
                    const serviceData = doc.data();
                    services.push({
                        id: doc.id,
                        name: serviceData.name,
                        price: serviceData.price,
                        duration: serviceData.duration
                    });
                });
                
                // Update the state with the fetched services (an array)
                this.services = services;
                
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        },
        
        
        addService(newServiceName, newServicePrice, newServiceDuration) {
            let currentDate = new Date().getTime(),
            id = currentDate.toString()
            
            let service = {
                id,
                name: newServiceName,
                price: newServicePrice,
                duration: newServiceDuration
            }
            this.services.unshift(service)


        },
        deleteService(idToDelete) {
            this.services = this.services.filter(service => service.id !== idToDelete )
        },
        updateService(id, name, price, duration){
            let index = this.services.findIndex(service => { return service.id === id})
            this.services[index].name = name
            this.services[index].price = price
            this.services[index].duration = duration
        }
    },
    getters: {
        
        getServiceName: (state) => {
            return (id) => {
                return state.services.filter(service => { return service.id === id })[0].name
            }
        },
        getServicePrice: (state) => {
            return (id) => {
                return state.services.filter(service => { return service.id === id })[0].price
            }
        },
        getServiceDuration: (state) => {
            return (id) => {
                return state.services.filter(service => { return service.id === id })[0].duration
            }
        }
    }
})