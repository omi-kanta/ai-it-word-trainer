import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { useUserWordHistories } from "../hooks/useUserWordHistories";

export default function Home() {

  const handleLogout = () => {
    signOut(auth);
  };

  const { user } = useAuth() ?? { user: auth.currentUser };
  const userId = user?.uid ?? null;
  const { histories, loading, error } = useUserWordHistories(userId);
  const sortedHistories = histories.sort((a, b) => b.createdAt - a.createdAt);
  const latestThree = sortedHistories.slice(0, 3);
  const [result, setResult] = useState(null);
  const handleHistoriesClick = (item) => {
    setResult(item);
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">ホーム</h1>
        <p className="text-gray-600 text-sm">
          AIを使ってIT用語をインプットしながら、クイズでアウトプットする学習アプリです。
        </p>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">最近検索したワード</h2>
        <p className="text-gray-600 text-sm">ここに最近検索したワードの履歴が表示されます。</p>

        {loading && <p className="text-gray-500 text-sm">読み込み中...</p>}
        {error && <p className="text-red-500 text-sm">履歴の取得に失敗しました。</p>}
        {!loading && histories.length === 0 && !error && (
          <p className="text-gray-500 text-sm">まだ履歴がありません。</p>
        )}

        <ul className="list-disc list-inside">
          {latestThree.map((item) => (
            <li key={item.id} className="text-gray-600 text-sm">
              <button
                type ="button"
                onClick={() => handleHistoriesClick(item)}
                className="hover:underline"
              >
                {item.word}
              </button> 
            </li>
          ))}
        </ul>
        { result && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <button type="button" onClick={() => setResult(null)} className="text-blue-500 hover:underline">
              閉じる
            </button>
            <h3 className="font-semibold mb-2">選択したワードの説明：</h3>
            <p className="text-sm whitespace-pre-wrap">{result.explanation}</p>
          </div>
        )}
      </div>
      <Button
        onClick={handleLogout}
      >
        ログアウト
      </Button>
    </div>
  );
}
