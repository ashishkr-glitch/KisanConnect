// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB75QgB2Zjh0_fq0ov7FNOt90URCQF5IHY",
  authDomain: "kisanlogin-ce4c0.firebaseapp.com",
  projectId: "kisanlogin-ce4c0",
  storageBucket: "kisanlogin-ce4c0.firebasestorage.app",
  messagingSenderId: "664529816939",
  appId: "1:664529816939:web:8f74c9834ef4e14850502e",
  measurementId: "G-EMEM2H72NB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);