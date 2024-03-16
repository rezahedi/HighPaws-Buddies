// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import FirebaseSimulators from "./firebase-simulators";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAh0b_V1qTmeQwKiHmcYkCVl6eEQMJVfdA",
  authDomain: "highpaws-buddies.firebaseapp.com",
  projectId: "highpaws-buddies",
  storageBucket: "highpaws-buddies.appspot.com",
  messagingSenderId: "723444273110",
  appId: "1:723444273110:web:d72cdcb4012b242c201e77"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// FirebaseSimulators({db, auth, storage})
