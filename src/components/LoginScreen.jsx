// LoginScreen.jsx
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl mb-6 font-bold">ログインしてください</h1>
      <button
        onClick={signInWithGoogle}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Googleでログイン
      </button>
    </div>
  );
}
