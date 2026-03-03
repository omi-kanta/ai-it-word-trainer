import { useState } from "react";
import { Star, Archive, X, Plus, Tag } from "lucide-react";
import { updateWordMeta } from "../../lib/wordMetaRepository";

export function WordDetail({ word, onClose, onToggleStar, onToggleArchive }) {
  const [newLabel, setNewLabel] = useState("");

  const handleAddLabel = async () => {
    const trimmed = newLabel.trim();
    if (!trimmed || (word.labels ?? []).includes(trimmed)) return;
    await updateWordMeta(word.id, {
      labels: [...(word.labels ?? []), trimmed],
    }).catch(console.error);
    setNewLabel("");
  };

  const handleRemoveLabel = async (label) => {
    await updateWordMeta(word.id, {
      labels: (word.labels ?? []).filter((l) => l !== label),
    }).catch(console.error);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">{word.word}</h2>
              {word.archived && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  学習済み
                </span>
              )}
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 shrink-0"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          {/* Explanation */}
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {word.explanation}
          </p>

          {/* Labels */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Tag size={13} className="text-gray-400" />
              <p className="text-xs font-semibold text-gray-500">ラベル</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(word.labels ?? []).length === 0 && (
                <span className="text-xs text-gray-400">ラベルなし</span>
              )}
              {(word.labels ?? []).map((label) => (
                <span
                  key={label}
                  className="flex items-center gap-1 text-sm bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full"
                >
                  {label}
                  <button
                    onClick={() => handleRemoveLabel(label)}
                    className="text-indigo-300 hover:text-indigo-600"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="新しいラベルを追加..."
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddLabel()}
              />
              <button
                onClick={handleAddLabel}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1 border-t border-gray-100">
            <button
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                word.starred
                  ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                  : "bg-gray-50 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600"
              }`}
              onClick={() => onToggleStar(word)}
            >
              <Star size={14} fill={word.starred ? "currentColor" : "none"} />
              {word.starred ? "苦手解除" : "苦手マーク"}
            </button>
            <button
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                word.archived
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
              onClick={() => onToggleArchive(word)}
            >
              <Archive size={14} />
              {word.archived ? "アーカイブ解除" : "学習済みにする"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
