// src/components/BoardSelector.jsx
import React, { useEffect, useState } from "react";
import { db } from "../context/firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

const CATEGORIES = ["一般", "技術", "イベント", "その他・ヘルプ"]; // 必要に応じて追加可能

export default function BoardSelector({ onSelect }) {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardCategory, setNewBoardCategory] = useState(CATEGORIES[0]);

  // boards コレクションを監視
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "boards"), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBoards(fetched);
    });
    return () => unsubscribe();
  }, []);

  // 板作成処理
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName) return;

    try {
      await addDoc(collection(db, "boards"), {
        name: newBoardName,
        category: newBoardCategory,
        createdAt: serverTimestamp(),
      });
      setNewBoardName("");
      setNewBoardCategory(CATEGORIES[0]);
    } catch (err) {
      console.error("板作成エラー:", err);
    }
  };

  return (
    <div className="p-4">
      {/* 新しい板作成フォーム */}
      <form onSubmit={handleCreateBoard} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="新しい板の名前"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <select
          value={newBoardCategory}
          onChange={(e) => setNewBoardCategory(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          作成
        </button>
      </form>

      {/* カテゴリごとの板一覧 */}
      {CATEGORIES.map((cat) => {
        const boardsInCat = boards.filter((b) => b.category === cat);
        if (boardsInCat.length === 0) return null;

        return (
          <div key={cat} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{cat}</h3>
            <ul className="space-y-2">
              {boardsInCat.map((b) => (
                <li key={b.id}>
                  <button
                    // onClick={() => onSelect(b.id)}
                    // className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => onSelect({ id: b.id, name: b.name })}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {b.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {/* 板が1つもない場合 */}
      {boards.length === 0 && (
        <p className="text-gray-500 text-center mt-4">板がありません</p>
      )}
    </div>
  );
}
