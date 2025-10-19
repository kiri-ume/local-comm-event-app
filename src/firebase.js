import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9FpexvYJFSWDjsloMudlH3Z5RBRSKwGA",
  authDomain: "local-comm-event-board.firebaseapp.com",
  projectId: "local-comm-event-board",
  storageBucket: "local-comm-event-board.firebasestorage.app",
  messagingSenderId: "612372149427",
  appId: "1:612372149427:web:d6a34b20dae993a1276cc6",
  measurementId: "G-S41PX0ZZ5K"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Googleログイン用
export const provider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
