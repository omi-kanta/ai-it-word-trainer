import { useState } from "react";

export function Flashcard({ item, onShowDetail }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      style={{ perspective: "1200px", cursor: "pointer" }}
      className="w-full select-none"
      onClick={() => setIsFlipped((f) => !f)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "340px",
          transformStyle: "preserve-3d",
          transition: "transform 0.5s ease",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* 表面：単語 */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            position: "absolute",
            inset: 0,
          }}
          className="bg-white rounded-2xl border border-gray-100 shadow-md flex flex-col items-center justify-center p-8"
        >
          <p className="text-4xl font-bold text-gray-900 text-center break-all">
            {item.word}
          </p>
          <p className="text-xs text-gray-400 mt-5">タップ / クリックで裏返す</p>
        </div>

        {/* 裏面：3問の正解一覧 */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
            inset: 0,
          }}
          className="bg-blue-50 rounded-2xl border border-blue-100 shadow-md flex flex-col p-5 overflow-hidden"
        >
          <div className="flex-1 space-y-2 overflow-y-auto">
            {item.items.map((qi, i) => (
              <div key={i} className="bg-white/70 rounded-xl px-3 py-2 space-y-0.5">
                <p className="text-xs font-bold text-indigo-400">Q{i + 1}</p>
                <p className="text-sm font-medium text-gray-800 leading-snug">
                  {qi.meaning}
                </p>
                {qi.explanation && (
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {qi.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowDetail();
            }}
            className="shrink-0 self-start mt-3 text-xs text-indigo-600 underline underline-offset-2 hover:text-indigo-800 transition-colors"
          >
            詳細を見る
          </button>
        </div>
      </div>
    </div>
  );
}
