// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyA9FpexvYJFSWDjsloMudlH3Z5RBRSKwGA",
  authDomain: "local-comm-event-board.firebaseapp.com",
  projectId: "local-comm-event-board",
  storageBucket: "local-comm-event-board.firebasestorage.app",
  messagingSenderId: "612372149427",
  appId: "1:612372149427:web:d6a34b20dae993a1276cc6",
  measurementId: "G-S41PX0ZZ5K"
};


// ✅ initializeApp はこの位置で定義（authより前！）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ app 定義の後で getAuth / getFirestore を呼ぶ
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// ✅ デバッグ出力（初期化確認）
console.log("[Firebase] Initialized app:", app.name);

export default app;
