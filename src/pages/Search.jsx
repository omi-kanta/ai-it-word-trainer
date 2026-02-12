import { useState } from "react";
import { auth } from "../lib/firebase";
import { generateExplanation } from "../lib/ai/wordExplanation";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Heading } from "../components/ui/Heading";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { useUserWordHistories } from "../hooks/useUserWordHistories";
import { saveUserWord } from "../lib/userWordsRepository";

export default function Search() {
  // 入力ワードと生成結果の状態管理
  const [word, setWord] = useState("");
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  // 現在ログイン中のユーザーID取得（未ログイン時は null）
  const { user } = useAuth?.() ?? { user: auth.currentUser };
  const userId = user?.uid ?? null;

  // Firestore から検索履歴を取得
  const {
    histories = [],
    loading: historiesLoading,
    error,
  } = useUserWordHistories(userId);

  // AIで説明生成 → 成功したら Firestore に保存
  const handleGenerate = async () => {
    if (!word || !userId) return;

    setLoading(true);
    setResult("");
    setShowResult(false);

    const explanation = await generateExplanation(word);

    setResult(explanation);
    setShowResult(true);
    setLoading(false);

    // エラー文が返ってきた場合は保存しない
    if (!explanation || explanation.startsWith("エラー")) return;

    try {
      await saveUserWord({ userId, word, explanation });
    } catch (e) {
      console.error("保存に失敗しました:", e);
    }
  };

  // 履歴クリック時に過去の説明を再表示
  const handleHistoryClick = (item) => {
    setWord(item.word);
    setResult(item.explanation);
    setShowResult(true);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Heading>ワード検索</Heading>

      {/* 検索入力エリア */}
      <div className="flex">
        <input
          type="text"
          placeholder="調べたいIT用語を入力"
          className="border p-2 rounded text-center w-80 mr-4"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />

        <Button onClick={handleGenerate} disabled={loading || !userId}>
          {loading ? "生成中..." : "生成する"}
        </Button>
      </div>

      {/* 生成結果表示 */}
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

      {/* 検索履歴一覧 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-3">これまで調べた単語</h2>

        {historiesLoading && (
          <p className="text-gray-500 text-sm">読み込み中...</p>
        )}

        {/* Firestore取得エラー表示 */}
        <ErrorMessage
          message={error ? "履歴の取得に失敗しました。" : ""}
          className="mt-3"
        />

        {!historiesLoading && histories.length === 0 && !error && (
          <p className="text-gray-500 text-sm">
            まだ履歴がありません。
          </p>
        )}

        <ul className="space-y-3 max-h-100 overflow-y-auto">
          {histories.map((item) => (
            <li
              key={item.id}
              className="border rounded p-3 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                {/* ワードクリックで説明を再表示 */}
                <button
                  type="button"
                  onClick={() => handleHistoryClick(item)}
                  className="font-semibold text-left text-blue-600 hover:underline"
                >
                  {item.word}
                </button>

                {/* Firestore Timestamp を日時表示に変換 */}
                {item.createdAt?.toDate && (
                  <span className="text-xs text-gray-500">
                    {item.createdAt
                      .toDate()
                      .toLocaleString()}
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
