// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore , enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration object
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Its a PUBLIC API! SO CHECK IT IN
const firebaseConfig = {
    apiKey: "AIzaSyD7H6TcSXz2hdOIcFNLqVMA-_d3T4d9q3w",
    authDomain: "som-rit-ourvoice.firebaseapp.com",
    databaseURL: "https://som-rit-ourvoice.firebaseio.com",
    projectId: "som-rit-ourvoice",
    storageBucket: "som-rit-ourvoice.appspot.com",
    messagingSenderId:"696489330177",
    appId: "1:696489330177:web:268b76243b9281a0a3e200",
    measurementId: "G-5MTXG6HGDL",
    persistence: true,
    forceOwnership: true,
    // experimentalTabSynchronization: true
};

// Initialize Firebase
const firebase              = initializeApp(firebaseConfig);
export const auth           = getAuth(firebase);
export const storage        = getStorage(firebase);
export const firestore      = getFirestore(firebase);
enableIndexedDbPersistence(firestore);
export const analytics      = getAnalytics(firebase);
