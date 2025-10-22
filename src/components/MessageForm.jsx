import React, { useState } from "react";

export default function MessageForm({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    // onSend({ text });
    onSend(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="card mt-6">
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        rows="3"
        placeholder="メッセージを入力（改行OK）"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition"
      >
        投稿する
      </button>
    </form>
  );
}
