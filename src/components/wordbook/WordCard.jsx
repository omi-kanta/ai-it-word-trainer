import { Star, Archive } from "lucide-react";

export function WordCard({ word, onSelect, onToggleStar, onToggleArchive }) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(word)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-gray-900">{word.word}</span>
            {word.starred && (
              <Star size={13} className="text-yellow-400 shrink-0" fill="currentColor" />
            )}
            {word.archived && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                学習済み
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mb-1.5">
            {(word.labels ?? []).map((label) => (
              <span
                key={label}
                className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500 line-clamp-1">{word.explanation}</p>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <button
            className={`p-1.5 rounded-lg transition-colors ${
              word.starred
                ? "text-yellow-400 bg-yellow-50"
                : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-50"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(word);
            }}
          >
            <Star size={15} fill={word.starred ? "currentColor" : "none"} />
          </button>
          <button
            className={`p-1.5 rounded-lg transition-colors ${
              word.archived
                ? "text-blue-400 bg-blue-50"
                : "text-gray-300 hover:text-blue-400 hover:bg-blue-50"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleArchive(word);
            }}
          >
            <Archive size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
