import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore db instance
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup };
