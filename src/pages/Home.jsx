import { useState, useMemo } from "react";
import { auth } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { Heading } from "../components/ui/Heading";
import { HeadingDetail } from "../components/ui/HeadingDetail";
import { HistoryListItem } from "../components/ui/HistoryListItem";
import { useUserWordHistories } from "../hooks/useUserWordHistories";

export default function Home() {
  // 現在ログイン中のユーザーIDを取得（未ログイン時は null）
  const { user } = useAuth() ?? { user: auth.currentUser };
  const userId = user?.uid ?? null;

  // Firestore からユーザーの検索履歴を取得
  const { histories = [], loading, error } = useUserWordHistories(userId);

  // 履歴を「新しい順」に並び替えて最新5件だけ表示
  // ※元の配列を破壊しないようにコピーしてから sort する
  const latestFive = useMemo(() => {
    return [...histories]
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() ?? 0;
        const bTime = b.createdAt?.toMillis?.() ?? 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [histories]);

  // 選択した履歴の詳細表示用 state
  const [result, setResult] = useState(null);

  const handleHistoriesClick = (item) => {
    setResult(item);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-8">

      {/* アプリの説明エリア */}
      <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-2 text-blue-800">
          このアプリについて
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          このアプリは、IT用語をAIがわかりやすく解説してくれる学習サポートツールです。
          検索したワードは自動で保存され、いつでも振り返ることができます。
          繰り返し学習することで理解を深めましょう。
        </p>
      </div>

      {/* 最近検索したワード一覧 */}
      <div>
        <Heading>最近検索したワード</Heading>
        <HeadingDetail>
          最近検索したワードの履歴が表示されます。
        </HeadingDetail>

        {loading && (
          <p className="text-gray-500 text-sm mt-3">読み込み中...</p>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-3">
            履歴の取得に失敗しました。
          </p>
        )}

        {!loading && histories.length === 0 && !error && (
          <p className="text-gray-500 text-sm mt-3">
            まだ履歴がありません。
          </p>
        )}

        <ul className="flex items-center justify-center gap-4 mt-6">
          {latestFive.map((item, index) => (
            <HistoryListItem
              key={item.id}
              item={item}
              pos={index + 1}
              onClick={() => handleHistoriesClick(item)}
              liClassName="text-gray-600 text-sm"
              buttonClassName="hover:underline"
            />
          ))}
        </ul>
      </div>

      {/* 選択したワードの説明を表示 */}
      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <button
            type="button"
            onClick={() => setResult(null)}
            className="text-blue-500 hover:underline mb-2"
          >
            閉じる
          </button>
          <h3 className="font-semibold mb-2">
            選択したワードの説明：
          </h3>
          <p className="text-sm whitespace-pre-wrap">
            {result.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
