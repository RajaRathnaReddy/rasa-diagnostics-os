import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase Project: Rasa Diagnstic OS (Project ID: rasa-diagnstic-os)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyALTw057l1KxwQu0lNnErt9DpwV6dbjHQI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'rasa-diagnstic-os.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'rasa-diagnstic-os',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'rasa-diagnstic-os.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '977266563144',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:977266563144:web:7945d3db620fdea783a07d',
};

// Check if Firebase credentials are provided and valid
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== '' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== ''
);

// Initialize Firebase safely (avoid multiple initializations)
export const app = isFirebaseConfigured
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export const FIREBASE_PROJECT_NAME = 'Rasa Diagnstic OS';
export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;
