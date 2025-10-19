import React, { useEffect, useState } from "react";
import { auth, signInWithGoogle, logout, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  serverTimestamp, orderBy, query
} from "firebase/firestore";

import MessageForm from "./MessageForm";
import MessageList from "./MessageList";

export default function MessageBoard() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // 認証状態監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Firestore購読
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({
        id: doc.id, ...doc.data()
      })));
    });
    return () => unsubscribe();
  }, []);

  const handleAddMessage = async ({ text }) => {
    if (!user) return alert("ログインしてください");

    await addDoc(collection(db, "messages"), {
      uid: user.uid,
      name: user.displayName || "匿名",
      text,
      createdAt: serverTimestamp(),
    });
  };

  const handleDelete = async (id, uid) => {
    if (uid !== user?.uid) {
      alert("自分の投稿のみ削除できます");
      return;
    }
    await deleteDoc(doc(db, "messages", id));
  };

  return (
    <div>
      <h2>🧭 Firebase認証付き 掲示板</h2>

      {user ? (
        <div>
          <p>ログイン中: {user.displayName}</p>
          <button onClick={logout}>ログアウト</button>
          <MessageForm onAdd={handleAddMessage} />
          <MessageList
            messages={messages}
            onDelete={(id, uid) => handleDelete(id, uid)}
          />
        </div>
      ) : (
        <div>
          <p>ログインして投稿を開始しましょう</p>
          <button onClick={signInWithGoogle}>Googleでログイン</button>
        </div>
      )}
    </div>
  );
}
