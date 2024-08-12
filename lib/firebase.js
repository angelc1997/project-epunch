// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjqUUZDXBEwd2N2j4EnQByRwa_tdMVCFE",
  authDomain: "e-punch-8fd20.firebaseapp.com",
  projectId: "e-punch-8fd20",
  storageBucket: "e-punch-8fd20.appspot.com",
  messagingSenderId: "233347152179",
  appId: "1:233347152179:web:1f0e35958b5b32af87e646",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const secondApp = initializeApp(firebaseConfig, "second");

export { app, secondApp };
