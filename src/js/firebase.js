// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyC9VEzF50nOC0h-aoQ9O8MZkNeXW3OnF2g',
  authDomain: 'bookingapp-62daa.firebaseapp.com',
  databaseURL: 'https://bookingapp-62daa-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'bookingapp-62daa',
  storageBucket: 'bookingapp-62daa.appspot.com',
  messagingSenderId: '1063598445575',
  appId: '1:1063598445575:web:f67a8f82dcc565fbf8c6a2',
  measurementId: 'G-13TLK96CH0'
};

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)

export {
  db
}