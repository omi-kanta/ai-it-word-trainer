import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useUserWordHistories } from "../hooks/useUserWordHistories";
import { updateWordMeta } from "../lib/wordMetaRepository";
import { Heading } from "../components/ui/Heading";
import { HeadingDetail } from "../components/ui/HeadingDetail";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { WordCard } from "../components/wordbook/WordCard";
import { WordDetail } from "../components/wordbook/WordDetail";
import { WordbookControls } from "../components/wordbook/WordbookControls";

export default function Wordbook() {
  const { user } = useAuth();
  const userId = user?.uid ?? null;
  const { histories, loading, error } = useUserWordHistories(userId);

  const [sort, setSort] = useState("date");
  const [filterLabel, setFilterLabel] = useState("");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [activeAlpha, setActiveAlpha] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);

  // onSnapshot でhistoriesが更新されたらselectedWordを同期
  useEffect(() => {
    if (!selectedWord) return;
    const updated = histories.find((h) => h.id === selectedWord.id);
    if (updated) setSelectedWord(updated);
  }, [histories]); // eslint-disable-line react-hooks/exhaustive-deps

  const allLabels = useMemo(() => {
    const set = new Set();
    for (const h of histories) {
      for (const l of h.labels ?? []) set.add(l);
    }
    return [...set].sort();
  }, [histories]);

  const availableLetters = useMemo(() => {
    const set = new Set();
    for (const h of histories) {
      if (h.archived && !showArchived) continue;
      const letter = h.word?.charAt(0).toUpperCase();
      if (letter && /[A-Z]/.test(letter)) set.add(letter);
    }
    return set;
  }, [histories, showArchived]);

  const displayWords = useMemo(() => {
    let list = [...histories];
    if (!showArchived) list = list.filter((h) => !h.archived);
    if (showStarredOnly) list = list.filter((h) => h.starred);
    if (filterLabel) list = list.filter((h) => (h.labels ?? []).includes(filterLabel));
    if (activeAlpha)
      list = list.filter((h) => h.word?.charAt(0).toUpperCase() === activeAlpha);

    if (sort === "alpha") {
      list.sort((a, b) => a.word.localeCompare(b.word));
    } else if (sort === "starred") {
      list.sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));
    }
    return list;
  }, [histories, sort, filterLabel, showStarredOnly, showArchived, activeAlpha]);

  const handleToggleStar = async (word) => {
    await updateWordMeta(word.id, { starred: !word.starred }).catch(console.error);
  };

  const handleToggleArchive = async (word) => {
    await updateWordMeta(word.id, { archived: !word.archived }).catch(console.error);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
      <div>
        <Heading>単語帳</Heading>
        <HeadingDetail>登録済みのIT用語を管理できます</HeadingDetail>
      </div>

      <WordbookControls
        sort={sort}
        onSortChange={setSort}
        filterLabel={filterLabel}
        onFilterLabelChange={setFilterLabel}
        allLabels={allLabels}
        showStarredOnly={showStarredOnly}
        onToggleStarredOnly={() => setShowStarredOnly((v) => !v)}
        showArchived={showArchived}
        onToggleShowArchived={() => setShowArchived((v) => !v)}
        availableLetters={availableLetters}
        activeAlpha={activeAlpha}
        onAlphaChange={setActiveAlpha}
      />

      <ErrorMessage message={error ? "単語帳の取得に失敗しました。" : ""} />

      {loading && (
        <p className="text-gray-500 text-sm text-center py-8">読み込み中...</p>
      )}

      {!loading && displayWords.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-8">
          {histories.length === 0
            ? "まだ単語が登録されていません。検索ページから単語を追加しましょう。"
            : "条件に一致する単語がありません。"}
        </p>
      )}

      <div className="space-y-2">
        {displayWords.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            onSelect={setSelectedWord}
            onToggleStar={handleToggleStar}
            onToggleArchive={handleToggleArchive}
          />
        ))}
      </div>

      {selectedWord && (
        <WordDetail
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          onToggleStar={handleToggleStar}
          onToggleArchive={handleToggleArchive}
        />
      )}
    </div>
  );
}
