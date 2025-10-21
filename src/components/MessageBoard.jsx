// MessageBoard.jsx
import React, { useEffect, useState } from "react";
import { db } from "../context/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import { useAuth } from "../context/AuthContext";

export default function MessageBoard({ boardId }) {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!boardId) return;
    const q = query(
      collection(db, "boards", boardId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [boardId]);

  const handleAddMessage = async ({ text }) => {
    if (!user) return alert("ログインしてください");
    await addDoc(collection(db, "boards", boardId, "messages"), {
      uid: user.uid,
      name: user.displayName || "匿名",
      text,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">板：{boardId}</h2>
      <MessageList messages={messages} />
      <MessageForm onAddMessage={handleAddMessage} />
    </div>
  );
}
