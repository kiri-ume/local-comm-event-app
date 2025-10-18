import React, { useState } from "react";

export default function MessageForm({ onAdd }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="投稿内容を入力"
        style={{ width: "70%", marginRight: "0.5rem" }}
      />
      <button type="submit">投稿</button>
    </form>
  );
}
