// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDg9q7sLBYILH7ZEddUWPpaw-ySfF7LUOE",
  authDomain: "travelsnap-21052.firebaseapp.com",
  projectId: "travelsnap-21052",
  storageBucket: "travelsnap-21052.appspot.com",
  messagingSenderId: "257731131874",
  appId: "1:257731131874:web:c472fb8abde3f2cca021bb",
  measurementId: "G-SLEJ0FRCLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);