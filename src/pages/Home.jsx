import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Home() {

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">ホーム</h1>
        <p className="text-gray-600 text-sm">
          AIを使ってIT用語をインプットしながら、クイズでアウトプットする学習アプリです。
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full text-sm hover:bg-red-600"
      >
        ログアウト
      </button>
    </div>
  );
}
