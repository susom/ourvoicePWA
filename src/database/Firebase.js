// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//PUBLIC API!
const firebaseConfig = {
    apiKey: "AIzaSyD7H6TcSXz2hdOIcFNLqVMA-_d3T4d9q3w",
    authDomain: "som-rit-ourvoice.firebaseapp.com",
    databaseURL: "https://som-rit-ourvoice.firebaseio.com",
    projectId: "som-rit-ourvoice",
    storageBucket: "som-rit-ourvoice.appspot.com",
    messagingSenderId:"696489330177",
    appId: "1:696489330177:web:268b76243b9281a0a3e200",
    measurementId: "G-5MTXG6HGDL"
};

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
//     measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
// };

// Initialize Firebase
const firebase      = initializeApp(firebaseConfig);
const firebaseAuth  = getAuth(firebase);
const analytics     = getAnalytics(firebase);
const storage       = getStorage(firebase);
const firestore     = getFirestore(firebase);

export {firebase, firebaseAuth, analytics, storage, firestore};
