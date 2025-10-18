import React, { useState, useEffect } from "react";
import MessageForm from "./MessageForm";
import MessageList from "./MessageList";

const STORAGE_KEY = "bbs_messages"; // 保存キー名

export default function MessageBoard() {
  // const [messages, setMessages] = useState([]);
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });


  // ✅ 初回読み込み時に localStorage からデータ取得
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, []);

  // ✅ messagesが変化したら localStorage に保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleAddMessage = (newMessage) => {
    const id = Date.now();
    const createdAt = new Date().toLocaleString();
    setMessages([{ id, text: newMessage, createdAt }, ...messages]);
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
