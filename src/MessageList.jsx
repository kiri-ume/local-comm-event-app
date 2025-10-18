import React from "react";

export default function MessageList({ messages, onDelete }) {
  if (messages.length === 0) {
    return <p>まだ投稿はありません。</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {messages.map((msg) => (
        <li
          key={msg.id}
          style={{
            borderBottom: "1px solid #ccc",
            padding: "0.5rem 0",
          }}
        >
          <p style={{ margin: 0 }}>{msg.text}</p>
          <small style={{ color: "#555" }}>{msg.createdAt}</small>
          <button
            onClick={() => onDelete(msg.id)}
            style={{ marginLeft: "1rem" }}
          >
            削除
          </button>
        </li>
      ))}
    </ul>
  );
}
