import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkFmAfO799EGOsaAO5sXGflf--3Igijkw",
  authDomain: "rubik-cube-f4fad.firebaseapp.com",
  projectId: "rubik-cube-f4fad",
  storageBucket: "rubik-cube-f4fad.appspot.com",
  messagingSenderId: "784763228380",
  appId: "1:784763228380:web:c1eded7f393611dc1a2419",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

if (window.location.hostname.includes("local")) {
  // connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  // connectStorageEmulator(storage, "127.0.0.1", 9199);
}
