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

const servicesCollectionRef = collection(db, 'services');
const servicesCollectionQuery = query(
  servicesCollectionRef,
  orderBy('date', 'desc')
);

export const useStoreServices = defineStore('storeServices', {
  state: () => {
    return {
      services: [],
      servicesLoaded: false
    };
  }, // Add a comma here

  actions: {
    async getServices() {
        this.servicesLoaded = false
      onSnapshot(servicesCollectionQuery, (querySnapshot) => {
        let services = [];
        querySnapshot.forEach((doc) => {
          let service = {
            id: doc.id,
            name: doc.data().name,
            price: doc.data().price,
            duration: doc.data().duration,
            date: doc.data().date
          };
          services.push(service);
        });
       
          this.services = services
          this.servicesLoaded = true
        
      });
      

    },

    async addService(newServiceName, newServicePrice, newServiceDuration) {
      let currentDate = new Date().getTime();
      let date = currentDate.toString();

      await addDoc(servicesCollectionRef, {
        name: newServiceName,
        price: newServicePrice,
        duration: newServiceDuration,
        date,
      });
    },

    async deleteService(idToDelete) {
      await deleteDoc(doc(servicesCollectionRef, idToDelete));
    },

    async updateService(id, name, price, duration) {
      await updateDoc(doc(servicesCollectionRef, id), {
        name,
        price,
        duration,
      });
    },
  },

  getters: {
    getServiceName: (state) => {
      return (id) => {
        const service = state.services.find((service) => service.id === id);
        return service ? service.name : '';
      };
    },

    getServicePrice: (state) => {
      return (id) => {
        const service = state.services.find((service) => service.id === id);
        return service ? service.price : '';
      };
    },

    getServiceDuration: (state) => {
      return (id) => {
        const service = state.services.find((service) => service.id === id);
        return service ? service.duration : '';
      };
    },
  },
});
