// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../context/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth状態の購読を1回だけに統一
  useEffect(() => {
    console.log("[AuthContext] useEffect mount - subscribing");

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("[AuthContext] Firebase Auth 状態変更:", firebaseUser);
      setUser(firebaseUser || null);
      setLoading(false);
    });

    return () => {
      console.log("[AuthContext] unsubscribing");
      unsubscribe();
    };
  }, []);

  // Googleログイン
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("[AuthContext] Googleログイン失敗:", err);
    }
  };

  // ログアウト
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("[AuthContext] ログアウト失敗:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOut: signOutUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
