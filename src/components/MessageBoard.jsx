import React, { useEffect, useState, useMemo } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../context/firebase";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import { useAuth } from "../context/AuthContext";

export default function MessageBoard({ boardId }) {
  const [messages, setMessages] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { user } = useAuth();

  // for debug
  useEffect(() => {
    console.log("[MessageBoard] mounted for boardId:", boardId);
    return () => console.log("[MessageBoard] unmounted for boardId:", boardId);
  }, [boardId]);

  // Firestoreからメッセージ一覧を取得
  useEffect(() => {
    if (!boardId) return;
    const q = query(
      collection(db, "boards", boardId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [boardId]);

  // 新規投稿
  const handleAddMessage = async (text) => {
    if (!text.trim()) return;
    await addDoc(collection(db, "boards", boardId, "messages"), {
      text,
      name: user?.displayName || "匿名",
      uid: user?.uid || null,
      createdAt: serverTimestamp(),
    });
  };

  // 投稿削除
  const handleDeleteMessage = async (id) => {
    await deleteDoc(doc(db, "boards", boardId, "messages", id));
  };

  // フィルタ処理（useMemoでパフォーマンス最適化）
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const text = msg.text?.toLowerCase() || "";
      const name = msg.name?.toLowerCase() || "";
      const keyword = searchKeyword.trim().toLowerCase();

      // キーワード一致判定（テキスト or 投稿者名）
      const matchesKeyword =
        !keyword || text.includes(keyword) || name.includes(keyword);

      // 日付範囲フィルタ
      let matchesDate = true;
      if (msg.createdAt) {
        const msgDate = msg.createdAt.toDate();
        if (startDate) {
          matchesDate = matchesDate && msgDate >= new Date(startDate);
        }
        if (endDate) {
          // 終了日は「その日の23:59:59」まで含める
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && msgDate <= end;
        }
      }

      return matchesKeyword && matchesDate;
    });
  }, [messages, searchKeyword, startDate, endDate]);

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-3">メッセージ一覧</h2>

      {/* 検索フォーム */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="キーワード（本文または名前）"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border rounded"
          />
        </div>
      </div>

      {/* メッセージリスト */}
      <MessageList
        messages={filteredMessages}
        onDelete={handleDeleteMessage}
        currentUser={user}
      />

      {/* 投稿フォーム */}
      <div className="mt-4">
        <MessageForm onSend={handleAddMessage} />
      </div>
    </div>
  );
}