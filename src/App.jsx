import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import LoginScreen from "./components/LoginScreen";
import BoardSelector from "./components/BoardSelector";
import MessageBoard from "./components/MessageBoard";

export default function App() {
  const { user, signOut } = useAuth();
  const [selectedBoard, setSelectedBoard] = useState(null);

  console.log("App user:", user);
  console.log("Selected board:", selectedBoard);

  // ログインしていない場合はログイン画面へ
  if (!user) {
    return <LoginScreen />;
  }

  // ログインしているが板を選択していない場合は板一覧を表示
  if (!selectedBoard) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">掲示板を選択してください</h1>
        <BoardSelector onSelect={setSelectedBoard} />
        <button
          onClick={signOut}
          className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          ログアウト
        </button>
      </div>
    );
  }

  // 板が選択されている場合はメッセージボードを表示
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">板: {selectedBoard}</h1>
        <div>
          <button
            onClick={() => setSelectedBoard(null)}
            className="mr-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            板一覧に戻る
          </button>
          <button
            onClick={signOut}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            ログアウト
          </button>
        </div>
      </div>

      {/* 選択された板のメッセージ一覧を表示 */}
      <MessageBoard boardId={selectedBoard} />
    </div>
  );
}
