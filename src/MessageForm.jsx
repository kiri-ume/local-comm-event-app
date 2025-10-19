import React, { useState } from "react";

const STORAGE_KEY_NAME = "bbs_username";

export default function MessageForm({ onAdd }) {
  const [name, setName] = useState(localStorage.getItem(STORAGE_KEY_NAME) || "");
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    localStorage.setItem(STORAGE_KEY_NAME, name);
    onAdd({ name, text });
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <div style={{ marginBottom: "0.5rem" }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="お名前を入力"
          style={{ width: "20%", marginRight: "0.5rem" }}
        />
      </div>
      <div style={{ marginBottom: "0.5rem" }}>
        {/* ✅ テキストエリアで複数行対応 */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="投稿内容を入力（改行も可）"
          rows={3}
          style={{ width: "70%", marginRight: "0.5rem", resize: "vertical" }}
        />
      </div>
      <button type="submit">投稿</button>
    </form>
  );
}
