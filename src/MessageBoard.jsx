import React, { useState, useEffect } from "react";
import MessageForm from "./MessageForm.jsx";
import MessageList from "./MessageList.jsx";

const STORAGE_KEY_MESSAGES = "bbs_messages";

export default function MessageBoard() {
  // ✅ 初期化時に localStorage から即読み込む
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MESSAGES);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to parse messages:", err);
      return [];
    }
  });

  // ✅ messages が変化したら保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  }, [messages]);

  const handleAddMessage = ({ name, text }) => {
    const id = Date.now();
    const createdAt = new Date().toLocaleString();
    setMessages([{ id, name, text, createdAt }, ...messages]);
  };

  const handleDelete = (id) => {
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  return (
    <div>
      <MessageForm onAdd={handleAddMessage} />
      <MessageList messages={messages} onDelete={handleDelete} />
    </div>
  );
}
