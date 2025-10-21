import React from "react";

export default function MessageList({ messages, onDelete, currentUser }) {
  if (messages.length === 0) {
    return <p className="text-center text-gray-500 mt-6">まだ投稿はありません。</p>;
  }

  return (
    <ul className="space-y-3 mt-4">
      {messages.map((msg) => {
        const isOwn = msg.uid === currentUser?.uid;
        return (
          <li
            key={msg.id}
            className={`card ${isOwn ? "message-self" : "message-other"}`}
          >
            <div className="flex justify-between items-start">
              <div>
                {/* <p className="whitespace-pre-wrap break-words">{msg.text}</p> */}
                <p className="whitespace-pre-wrap break-words">{linkify(msg.text)}</p>
                <div className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">{msg.name}</span> ・{" "}
                  {msg.createdAt
                    ? (msg.createdAt.toDate
                        ? msg.createdAt.toDate().toLocaleString("ja-JP")
                        : msg.createdAt)
                    : "日時不明"}
                </div>
              </div>
              {isOwn && (
                <button
                  className="delete-btn"
                  onClick={() => onDelete(msg.id, msg.uid)}
                >
                  削除
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, idx) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}
