import { useState } from "react";

const STORAGE_KEY = "it_trainer_review_list";

function saveToStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
}

/**
 * 旧フォーマット { word, meaning, explanation, ... } を
 * 新フォーマット { word, items: [{meaning, explanation}], ... } に変換する
 */
function normalize(item) {
  if (item.items) return item;
  return {
    word: item.word,
    items: [{ meaning: item.meaning ?? "", explanation: item.explanation ?? "" }],
    correctCount: item.correctCount ?? 0,
    incorrectCount: item.incorrectCount ?? 0,
    archived: item.archived ?? false,
  };
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);

    // 同じ word のエントリを 1件にマージ（旧データ対応）
    const map = new Map();
    for (const entry of data) {
      const item = normalize(entry);
      if (map.has(item.word)) {
        const existing = map.get(item.word);
        existing.items = [...existing.items, ...item.items];
        existing.correctCount += item.correctCount;
        existing.incorrectCount += item.incorrectCount;
      } else {
        map.set(item.word, { ...item });
      }
    }

    const merged = [...map.values()];
    // マージ済みデータを localStorage に書き戻す（一度だけ走る移行処理）
    saveToStorage(merged);
    return merged;
  } catch {
    return [];
  }
}

/**
 * 復習リストを管理するカスタムフック。
 * localStorage に永続化し、React state として保持する。
 *
 * 各アイテム: { word, items: [{meaning, explanation}], correctCount, incorrectCount, archived }
 */
export function useReviewList() {
  const [reviewList, setReviewList] = useState(loadFromStorage);

  /**
   * 1単語分のデータを追加する（word で重複チェック、同じ単語は追加しない）
   * @param {{ word: string, items: { meaning: string, explanation: string }[] }} entry
   */
  const addWord = ({ word, items }) => {
    setReviewList((prev) => {
      if (prev.some((r) => r.word === word)) return prev;
      const updated = [
        ...prev,
        { word, items, correctCount: 0, incorrectCount: 0, archived: false },
      ];
      saveToStorage(updated);
      return updated;
    });
  };

  /** クイズ正誤結果を記録する（word のみでマッチング） */
  const recordResult = (word, isCorrect) => {
    setReviewList((prev) => {
      const updated = prev.map((r) => {
        if (r.word === word) {
          return {
            ...r,
            correctCount: r.correctCount + (isCorrect ? 1 : 0),
            incorrectCount: r.incorrectCount + (isCorrect ? 0 : 1),
          };
        }
        return r;
      });
      saveToStorage(updated);
      return updated;
    });
  };

  /** アーカイブ状態をトグルする */
  const archiveWord = (word) => {
    setReviewList((prev) => {
      const updated = prev.map((r) =>
        r.word === word ? { ...r, archived: !r.archived } : r
      );
      saveToStorage(updated);
      return updated;
    });
  };

  return { reviewList, addWord, recordResult, archiveWord };
}
