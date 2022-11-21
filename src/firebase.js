import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAystZWLMAPgj2i9UZuZYFysYtVJcrltBc",
    authDomain: "chat-9a006.firebaseapp.com",
    projectId: "chat-9a006",
    storageBucket: "chat-9a006.appspot.com",
    messagingSenderId: "874260242810",
    appId: "1:874260242810:web:0c7a0c4f0c205d5c8af6c3",
    measurementId: "G-3X2HVHMJKV"

};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
