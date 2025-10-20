import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import MessageList from "./MessageList";

export default function App() {
  const { user, login, logout } = useAuth();

  const [boards] = useState([
    { id: "general", name: "雑談" },
    { id: "tech", name: "技術" },
    { id: "help", name: "質問" },
  ]);
  const [currentBoard, setCurrentBoard] = useState("general");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // 現在の板のメッセージをリアルタイム購読
  useEffect(() => {
    const q = query(
      collection(db, "boards", currentBoard, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [currentBoard]);

  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (!user) return alert("ログインしてください");
    if (!text.trim()) return;

    await addDoc(collection(db, "boards", currentBoard, "messages"), {
      uid: user.uid,
      name: user.displayName || "匿名",
      text,
      createdAt: serverTimestamp(),
    });
    setText("");
  };

  const handleDelete = async (id, uid) => {
    if (uid !== user?.uid) return alert("自分の投稿のみ削除できます");
    await deleteDoc(doc(db, "boards", currentBoard, "messages", id));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>🔥 マルチ掲示板システム</h2>

      {/* ログイン状態 */}
      <div style={{ marginBottom: "1rem" }}>
        {user ? (
          <>
            <p>
              ログイン中: <strong>{user.displayName || user.email}</strong>
            </p>
            <button onClick={logout}>ログアウト</button>
          </>
        ) : (
          <button onClick={login}>Googleでログイン</button>
        )}
      </div>

      {/* 板切り替え */}
      <div style={{ marginBottom: "1rem" }}>
        {boards.map((b) => (
          <button
            key={b.id}
            onClick={() => setCurrentBoard(b.id)}
            style={{
              marginRight: "0.5rem",
              backgroundColor: currentBoard === b.id ? "#4CAF50" : "#ddd",
              color: currentBoard === b.id ? "white" : "black",
            }}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* 投稿フォーム */}
      <form onSubmit={handleAddMessage}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder={`${boards.find((b) => b.id === currentBoard)?.name}板に投稿`}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <button type="submit" disabled={!user}>
          投稿
        </button>
      </form>

      {/* メッセージ一覧 */}
      <MessageList messages={messages} onDelete={handleDelete} />
    </div>
  );
}
