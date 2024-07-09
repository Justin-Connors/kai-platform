import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);
