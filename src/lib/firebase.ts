// lib/firebase.ts ✅ Already correct
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAI8stgPus8Q8J-w7drj-JddmaKo6Z0hRs',
  authDomain: 'herbolife-store.firebaseapp.com',
  projectId: 'herbolife-store',
  storageBucket: 'herbolife-store.firebasestorage.app',
  messagingSenderId: '922872122127',
  appId: '1:922872122127:web:001b4377661261b9cc4c7a',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
