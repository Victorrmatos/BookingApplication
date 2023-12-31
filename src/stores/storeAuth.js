import { defineStore } from 'pinia';
import { auth } from '@/js/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

export const useStoreAuth = defineStore('storeAuth', {
  state: () => {
    return {
        user: {

        }
    };
  }, // Add a comma here

  actions: {
    init(){
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user.id = user.uid
                this.user.email = user.email
              const uid = user.uid;
        
            } else {
              this.user = {}
            }
          });
    },
loginUser(credentials) {
    signInWithEmailAndPassword(auth, credentials.email, credentials.password)
    .then((userCredential) => {
      const user = credentials.user;
   

    })
    .catch((error) => {
      console.log('error.message', error.message)
    });
},

logoutUser() {
    signOut(auth).then(() => {
console.log('user signed out')
    }).catch((error) => {
     console.log('error', error.meassage)
    });
}
  },

  
});
