
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBf3qaW6kJC4kMTFXUuddQMSb4uJwijksU",
  authDomain: "aakash-shoes.firebaseapp.com",
  projectId: "aakash-shoes",
  storageBucket: "aakash-shoes.firebasestorage.app",
  messagingSenderId: "714611072082",
  appId: "1:714611072082:web:538946754a3f62e8d6538b",
  measurementId: "G-R376QVX015",
  databaseURL: "https://aakash-shoes-default-rtdb.firebaseio.com",
};

// Initialize Firebase
export const fireBaseApp = initializeApp(firebaseConfig);
// Export Storage and Database
export const storage = getStorage(fireBaseApp);
export const db = getDatabase(fireBaseApp);
export const auth = getAuth(fireBaseApp);
