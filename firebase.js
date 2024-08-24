// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhq3qJ_0o0a1EwjKpr0LeA-U8pXsdiDXc",
  authDomain: "inventory-management-d0b8d.firebaseapp.com",
  projectId: "inventory-management-d0b8d",
  storageBucket: "inventory-management-d0b8d.appspot.com",
  messagingSenderId: "287339867126",
  appId: "1:287339867126:web:20ede1ea8666f8b85235d7",
  measurementId: "G-Q3SS7770CQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}