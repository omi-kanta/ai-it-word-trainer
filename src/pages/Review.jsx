import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useReviewList } from "../hooks/useReviewList";
import { Flashcard } from "../components/review/Flashcard";
import { WordModal } from "../components/review/WordModal";

export default function Review() {
  const navigate = useNavigate();
  const { reviewList, archiveWord } = useReviewList();

  const [showArchived, setShowArchived] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [modalItem, setModalItem] = useState(null);

  const activeList = reviewList.filter((r) => (showArchived ? r.archived : !r.archived));
  const archivedCount = reviewList.filter((r) => r.archived).length;
  const activeCount = reviewList.filter((r) => !r.archived).length;

  const total = activeList.length;
  const safeIdx = Math.min(currentIdx, Math.max(0, total - 1));
  const current = activeList[safeIdx] ?? null;

  const goNext = () => setCurrentIdx((i) => Math.min(i + 1, total - 1));
  const goPrev = () => setCurrentIdx((i) => Math.max(i - 1, 0));

  const handleTabChange = (archived) => {
    setShowArchived(archived);
    setCurrentIdx(0);
    setModalItem(null);
  };

  const handleArchive = () => {
    if (!modalItem) return;
    archiveWord(modalItem.word);
    setModalItem(null);
    setCurrentIdx(0);
  };

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto space-y-5">
      {/* ヘッダー */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-2xl font-bold text-gray-800">復習モード</h2>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            全{activeList.length}単語
          </span>
        </div>
        <button
          onClick={() => navigate("/quiz")}
          className="shrink-0 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          クイズに戻る
        </button>
      </div>

      {/* タブ */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => handleTabChange(false)}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
            !showArchived
              ? "bg-white shadow text-gray-800"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          復習中（{activeCount}）
        </button>
        <button
          onClick={() => handleTabChange(true)}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
            showArchived
              ? "bg-white shadow text-gray-800"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          アーカイブ済み（{archivedCount}）
        </button>
      </div>

      {/* コンテンツ */}
      {total === 0 ? (
        <div className="text-center py-16 space-y-4">
          <BookOpen size={48} className="mx-auto text-gray-300" />
          {showArchived ? (
            <p className="text-gray-400 text-sm">アーカイブした単語はありません。</p>
          ) : (
            <>
              <p className="text-gray-400 text-sm leading-relaxed">
                まだ出題された単語がありません。<br />
                クイズで問題を解いてみましょう！
              </p>
              <button
                onClick={() => navigate("/quiz")}
                className="px-5 py-2.5 text-sm font-medium text-white rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-400 hover:to-purple-400 transition-colors"
              >
                クイズを始める
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          {/* カード番号 */}
          <p className="text-center text-sm text-gray-500 font-medium">
            {safeIdx + 1} / {total}
          </p>

          {/* フラッシュカード（key で index 変化時にフリップ状態をリセット） */}
          <Flashcard
            key={safeIdx}
            item={current}
            onShowDetail={() => setModalItem(current)}
          />

          {/* 前後ナビゲーション */}
          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              disabled={safeIdx === 0}
              className="flex-1 py-3 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← 前へ
            </button>
            <button
              onClick={goNext}
              disabled={safeIdx === total - 1}
              className="flex-1 py-3 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              次へ →
            </button>
          </div>
        </>
      )}

      {/* 詳細モーダル */}
      <WordModal
        item={modalItem}
        onClose={() => setModalItem(null)}
        onArchive={handleArchive}
      />
    </div>
  );
}
