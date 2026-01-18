import { useState } from "react";
import { auth } from "../lib/firebase";
import { generateExplanation } from "../lib/ai/wordExplanation";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { useUserWordHistories } from "../hooks/useUserWordHistories";
import { saveUserWord } from "../lib/userWordsRepository";

export default function Search() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth?.() ?? { user: auth.currentUser };
  const userId = user?.uid ?? null;

  const { 
    histories = [], 
    loading: historiesLoading,
    error 
  } = useUserWordHistories(userId);

  const handleGenerate = async () => {
    if (!word || !userId) return;

    setLoading(true);
    setResult("");
    setShowResult(false);

    const explanation = await generateExplanation(word);

    setResult(explanation);
    setShowResult(true);
    setLoading(false);

    if (!explanation || explanation.startsWith("エラー")) return;

    try {
      await saveUserWord({ userId, word, explanation });
    } catch (e) {
      console.error("保存に失敗しました:", e);
    }
  };

  const handleHistoryClick = (item) => {
    setWord(item.word);
    setResult(item.explanation);
    setShowResult(true);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ワード検索</h1>

      <input
        type="text"
        placeholder="調べたいIT用語を入力"
        className="border p-2 w-full mb-4 rounded"
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />

      <Button onClick={handleGenerate} disabled={loading || !userId}>
        {loading ? "生成中..." : "AIで説明を生成する"}
      </Button>

      {/* 生成結果 */}
      {showResult && result && (
        <div className="mt-6 bg-gray-100 p-4 rounded relative">
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-bold">生成結果：</h2>
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setShowResult(false)}
            >
              × 閉じる
            </button>
          </div>
          <p className="whitespace-pre-line">{result}</p>
        </div>
      )}

      {/* 履歴一覧 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-3">これまで調べた単語</h2>

        {historiesLoading && (
          <p className="text-gray-500 text-sm">読み込み中...</p>
        )}

        {error && (
          <p className="text-red-500 text-sm">
            履歴の取得に失敗しました。
          </p>
        )}

        {!historiesLoading && histories.length === 0 && !error && (
          <p className="text-gray-500 text-sm">まだ履歴がありません。</p>
        )}

        <ul className="space-y-3 max-h-100 overflow-y-auto">
          {histories.map((item) => (
            <li
              key={item.id}
              className="border rounded p-3 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <button
                  type="button"
                  onClick={() => handleHistoryClick(item)}
                  className="font-semibold text-left text-blue-600 hover:underline"
                >
                  {item.word}
                </button>
                {item.createdAt?.toDate && (
                  <span className="text-xs text-gray-500">
                    {item.createdAt.toDate().toLocaleString()}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
