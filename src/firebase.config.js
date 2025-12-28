// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, setUserId} from "firebase/analytics";
import {getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA54kZLXx9HiyDlQ2GL3dqTh9nko0AsiLc",
  authDomain: "lets-try-app-22e0a.firebaseapp.com",
  projectId: "lets-try-app-22e0a",
  storageBucket: "lets-try-app-22e0a.firebasestorage.app",
  messagingSenderId: "182074141728",
  appId: "1:182074141728:web:e78dd87cac703cf6b72045",
  measurementId: "G-GFWR2QNDDN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);