import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA5pYZWVyY_n-5sBEaVrO_-LggIsYHkL-E",
  authDomain: "lankaride-auth.firebaseapp.com",
  projectId: "lankaride-auth",
  storageBucket: "lankaride-auth.firebasestorage.app",
  messagingSenderId: "64714434665",
  appId: "1:64714434665:web:05fb94038719a6a4915af8",
  measurementId: "G-WNF3FR4KLN",

};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
