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
import { doc, deleteDoc } from "firebase/firestore";


export default function MessageBoard({ boardId }) {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  // for debug
  useEffect(() => {
    console.log("[MessageBoard] mounted for boardId:", boardId);
    return () => console.log("[MessageBoard] unmounted for boardId:", boardId);
  }, [boardId]);

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

  const handleDeleteMessage = async (id, uid) => {
    if (uid !== user?.uid) {
      alert("自分の投稿のみ削除できます");
      return;
    }
    await deleteDoc(doc(db, "boards", boardId, "messages", id));
  };

  return (
    <div className="p-4">
      {/* <h2 className="text-lg font-bold mb-2">板：{boardId}</h2> */}
      {/* <MessageList messages={messages} /> */}
      <MessageList
        messages={messages}
        onDelete={handleDeleteMessage}
        currentUser={user} // ← user を渡す
      />
      {/* <MessageForm onAddMessage={handleAddMessage} /> */}
      <MessageForm onSend={handleAddMessage} />
    </div>
  );
}
