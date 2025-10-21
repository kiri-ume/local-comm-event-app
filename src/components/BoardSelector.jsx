// src/components/BoardSelector.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../context/firebase";

export default function BoardSelector({ onSelect }) {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        console.log("[BoardSelector] Fetching boards...");
        const snapshot = await getDocs(collection(db, "boards"));
        const boardsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("[BoardSelector] boards fetched:", boardsData);
        setBoards(boardsData);
      } catch (error) {
        console.error("[BoardSelector] Firestore error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (boards.length === 0) {
    return <p>板がありません</p>;
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      {boards.map((board) => (
        <button
          key={board.id}
          onClick={() => onSelect(board.id)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {board.name || board.id}
        </button>
      ))}
    </div>
  );
}
