// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBjQeMNDZRNegNQh4Rvxfa7fGvmPP4XVWk',
  authDomain: 'movie-app-8766b.firebaseapp.com',
  projectId: 'movie-app-8766b',
  storageBucket: 'movie-app-8766b.appspot.com',
  messagingSenderId: '1034136927694',
  appId: '1:1034136927694:web:45c53b288bf84ca4d23f9f',
  measurementId: 'G-8LWHS6DR2T'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
