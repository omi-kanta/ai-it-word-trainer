export function WordModal({ item, onClose, onArchive }) {
  if (!item) return null;
  const hasHistory = item.correctCount > 0 || item.incorrectCount > 0;
  const total = item.correctCount + item.incorrectCount;
  const accuracy = total > 0 ? Math.round((item.correctCount / total) * 100) : 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-2xl font-bold text-gray-900">{item.word}</h2>
          <button
            onClick={onClose}
            className="shrink-0 text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* 3問分の正解・解説 */}
        <div className="space-y-4">
          {item.items.map((qi, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-1.5">
              <p className="text-xs font-bold text-indigo-500">Q{i + 1}の正解</p>
              <p className="text-sm font-medium text-gray-800">{qi.meaning}</p>
              {qi.explanation && (
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {qi.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* 正誤履歴 */}
        {hasHistory && (
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2">クイズ正誤履歴</p>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{item.correctCount}</p>
                <p className="text-xs text-gray-500 mt-0.5">正解</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">{item.incorrectCount}</p>
                <p className="text-xs text-gray-500 mt-0.5">不正解</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{accuracy}%</p>
                <p className="text-xs text-gray-500 mt-0.5">正答率</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={onArchive}
            className={
              item.archived
                ? "w-full py-2.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
                : "w-full py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            }
          >
            {item.archived ? "アーカイブを解除する" : "アーカイブする"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
