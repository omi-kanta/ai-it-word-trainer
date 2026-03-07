import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { generateQuiz } from "../lib/ai/quizGenerator";
import { parseQuizText } from "../lib/ai/quizParser";
import { saveQuizSession } from "../lib/activityRepository";
import { useAuth } from "../context/AuthContext";
import { useReviewList } from "../hooks/useReviewList";
import { Heading } from "../components/ui/Heading";
import { HeadingDetail } from "../components/ui/HeadingDetail";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { QuestionView } from "../components/quiz/QuestionView";

export default function Quiz() {
  const { user } = useAuth();
  const userId = user?.uid ?? null;
  const navigate = useNavigate();

  const [inputWord, setInputWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const { reviewList, addWord, recordResult } = useReviewList();

  const handleGenerate = async () => {
    const word = inputWord.trim();
    if (!word) {
      setError("単語を入力してください。");
      return;
    }
    setLoading(true);
    setError("");
    setQuestions([]);
    setCurrentIdx(0);

    const result = await generateQuiz(word);

    if (result.startsWith("エラー")) {
      setError(result);
    } else {
      const parsed = parseQuizText(result);
      if (parsed.length === 0) {
        setError("問題の解析に失敗しました。もう一度お試しください。");
      } else {
        setQuestions(parsed);

        // 復習リストへ追加（word で重複チェック、3問まとめて1件）
        addWord({
          word,
          items: parsed.map((q) => ({
            meaning: q.choices[q.answer] ?? q.answer,
            explanation: q.explanation,
          })),
        });

        try {
          await saveQuizSession({ userId, topic: word });
        } catch (e) {
          console.error("クイズ記録に失敗しました:", e);
        }
      }
    }
    setLoading(false);
  };

  const handleRetry = () => {
    setQuestions([]);
    setCurrentIdx(0);
    setError("");
  };

  const handleAnswer = (isCorrect) => {
    recordResult(inputWord.trim(), isCorrect);
  };

  // ---- 問題表示中 ----
  if (questions.length > 0) {
    return (
      <div className="p-4 md:p-6 max-w-xl mx-auto space-y-4">
        <div>
          <Heading>クイズ</Heading>
          <HeadingDetail>「{inputWord}」に関する問題</HeadingDetail>
        </div>
        <QuestionView
          key={currentIdx}
          question={questions[currentIdx]}
          total={questions.length}
          index={currentIdx}
          onNext={() => setCurrentIdx((i) => i + 1)}
          onRetry={handleRetry}
          onAnswer={handleAnswer}
        />
      </div>
    );
  }

  // ---- 入力フォーム ----
  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Heading>クイズ</Heading>
          <HeadingDetail>単語を入力してクイズに挑戦しましょう</HeadingDetail>
        </div>
        <button
          onClick={() => navigate("/review")}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shrink-0 mt-1"
        >
          <BookOpen size={14} />
          復習する{reviewList.length > 0 && `（${reviewList.length}件）`}
        </button>
      </div>

      {/* 使い方説明 */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          調べたい単語を入力して「問題を出す」ボタンを押してください。
          その単語に関するクイズ問題が出題されます。
        </p>
      </div>

      {/* 単語入力フォーム */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">単語を入力</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputWord}
            onChange={(e) => { setInputWord(e.target.value); setError(""); }}
            placeholder="例：API、クラウド、Git ..."
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-400 hover:to-purple-400 disabled:opacity-40 transition-colors shrink-0"
          >
            {loading ? "生成中..." : "問題を出す"}
          </button>
        </div>
      </div>

      <ErrorMessage message={error} />
    </div>
  );
}
