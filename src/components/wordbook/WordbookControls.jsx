import { Star, Archive } from "lucide-react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function WordbookControls({
  sort,
  onSortChange,
  filterLabel,
  onFilterLabelChange,
  allLabels,
  showStarredOnly,
  onToggleStarredOnly,
  showArchived,
  onToggleShowArchived,
  availableLetters,
  activeAlpha,
  onAlphaChange,
}) {
  return (
    <div className="space-y-2">
      {/* Sort / Filter */}
      <div className="flex flex-wrap gap-2">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="date">登録日順</option>
          <option value="alpha">アルファベット順</option>
          <option value="starred">苦手優先</option>
        </select>

        <select
          value={filterLabel}
          onChange={(e) => onFilterLabelChange(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">すべてのラベル</option>
          {allLabels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <button
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
            showStarredOnly
              ? "bg-yellow-50 border-yellow-300 text-yellow-700"
              : "bg-white border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700"
          }`}
          onClick={onToggleStarredOnly}
        >
          <Star size={13} fill={showStarredOnly ? "currentColor" : "none"} />
          苦手のみ
        </button>

        <button
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
            showArchived
              ? "bg-blue-50 border-blue-300 text-blue-700"
              : "bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
          }`}
          onClick={onToggleShowArchived}
        >
          <Archive size={13} />
          学習済み表示
        </button>
      </div>

      {/* Alphabet Index */}
      <div className="flex flex-wrap gap-1">
        {ALPHABET.map((letter) => {
          const available = availableLetters.has(letter);
          const active = activeAlpha === letter;
          return (
            <button
              key={letter}
              disabled={!available}
              onClick={() => onAlphaChange(active ? null : letter)}
              className={`w-7 h-7 text-xs font-medium rounded transition-colors ${
                active
                  ? "bg-indigo-600 text-white"
                  : available
                  ? "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                  : "text-gray-300 cursor-default"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
