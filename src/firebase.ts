// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
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

if( import.meta.env.DEV ) {
  connectFirestoreEmulator(db, "localhost", 8080)
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectStorageEmulator(storage, "localhost", 9199)
}