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
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            <strong>{msg.name || "匿名"}</strong>: {msg.text}
          </p>
          <small style={{ color: "#555" }}>
            {msg.createdAt
              ? msg.createdAt.toDate
                ? msg.createdAt.toDate().toLocaleString("ja-JP")
                : msg.createdAt.toLocaleString?.("ja-JP") || msg.createdAt
              : "日時不明"}
          </small>
          <button
            onClick={() => onDelete(msg.id, msg.uid)}
            style={{ marginLeft: "1rem" }}
          >
            削除
          </button>
        </li>
      ))}
    </ul>
  );
}
