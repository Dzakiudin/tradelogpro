import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCFKB98S5KODJQBMl7aa-ZmpFmj1iAqnu0",
    authDomain: "trade-journal-504bc.firebaseapp.com",
    projectId: "trade-journal-504bc",
    storageBucket: "trade-journal-504bc.firebasestorage.app",
    messagingSenderId: "291564205714",
    appId: "1:291564205714:web:30dc11c3c722382c63d84b",
    measurementId: "G-WKVQ7FCH8H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = "trade-journal-504bc";
