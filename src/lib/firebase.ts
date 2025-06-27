import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAI8stgPus8Q8J-w7drj-JddmaKo6Z0hRs",
  authDomain: "herbolife-store.firebaseapp.com",
  projectId: "herbolife-store",
  storageBucket: "herbolife-store.firebasestorage.app",
  messagingSenderId: "922872122127",
  appId: "1:922872122127:web:001b4377661261b9cc4c7a"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 📦 Export Firestore DB
export const db = getFirestore(app);
