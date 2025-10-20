import React from "react";

// URL検出＆リンク化用関数
const linkify = (text) => {
  if (!text) return "";
  // URL正規表現（http/https対応）
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  // HTMLエスケープ（XSS対策）
  const escapeHTML = (str) =>
    str.replace(/[&<>"']/g, (match) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[match])
    );

  // URLを<a>タグに置換
  const escaped = escapeHTML(text);
  return escaped.replace(
    urlPattern,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
};

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
          {/* 投稿者名と日時 */}
          <small style={{ color: "#555" }}>
            {msg.name || "匿名"}（
            {msg.createdAt
              ? msg.createdAt.toDate?.().toLocaleString("ja-JP") ||
                msg.createdAt.toLocaleString?.("ja-JP") ||
                msg.createdAt
              : "日時不明"}
            ）
          </small>

          {/* 投稿本文（URL自動リンク＆改行維持） */}
          <p
            style={{
              margin: "0.5rem 0",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: linkify(msg.text) }}
          />

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
