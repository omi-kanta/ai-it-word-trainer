import { useState } from "react";
import { generateQuiz } from "../lib/ai/quizGenerator";
import { saveQuizSession } from "../lib/activityRepository";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Heading } from "../components/ui/Heading";
import { HeadingDetail } from "../components/ui/HeadingDetail";
import { ErrorMessage } from "../components/ui/ErrorMessage";

// AI テキストを問題オブジェクトの配列に変換する
function parseQuizText(text) {
  const questions = [];
  // Q1: / Q2: / Q3: を区切りとして各ブロックを抽出
  const blockRegex = /Q\d+:\s*\n([\s\S]*?)(?=Q\d+:|$)/g;
  let m;
  while ((m = blockRegex.exec(text)) !== null) {
    const block = m[1];

    const questionMatch = block.match(/^([\s\S]*?)選択肢:/);
    const question = questionMatch ? questionMatch[1].trim() : "";

    const choicesMatch = block.match(/選択肢:([\s\S]*?)正解:/);
    const choicesText = choicesMatch ? choicesMatch[1].trim() : "";
    const choices = {};
    for (const line of choicesText.split("\n")) {
      const cm = line.match(/^([A-D])\.\s*(.*)/);
      if (cm) choices[cm[1]] = cm[2].trim();
    }

    const answerMatch = block.match(/正解:\s*\n?\s*([A-D])/);
    const answer = answerMatch ? answerMatch[1] : "";

    const explMatch = block.match(/解説:\s*\n?([\s\S]*?)$/);
    const explanation = explMatch ? explMatch[1].trim() : "";

    if (question && answer) {
      questions.push({ question, choices, answer, explanation });
    }
  }
  return questions;
}

// ---- 問題表示・回答コンポーネント ----
function QuestionView({ question, total, index, onNext, onRetry }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = submitted && selected === question.answer;
  const isLast = index === total - 1;

  const choiceClass = (letter) => {
    const base = "w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ";
    if (!submitted) {
      return base + (selected === letter
        ? "border-indigo-400 bg-indigo-50 text-indigo-700"
        : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50");
    }
    if (letter === question.answer) return base + "border-green-400 bg-green-50 text-green-700";
    if (letter === selected)        return base + "border-red-300 bg-red-50 text-red-700";
    return base + "border-gray-200 bg-white text-gray-400";
  };

  return (
    <div className="space-y-4">
      {/* 進捗 */}
      <p className="text-sm text-gray-500">{index + 1} / {total} 問目</p>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        {/* 問題文 */}
        <p className="text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
          {question.question}
        </p>

        {/* 選択肢 */}
        <div className="space-y-2">
          {["A", "B", "C", "D"].map((letter) => {
            const choice = question.choices[letter];
            if (!choice) return null;
            return (
              <button
                key={letter}
                className={choiceClass(letter)}
                onClick={() => !submitted && setSelected(letter)}
                disabled={submitted}
              >
                <span className="font-semibold mr-2">{letter}.</span>
                {choice}
              </button>
            );
          })}
        </div>

        {/* 回答ボタン */}
        {!submitted && (
          <Button onClick={() => setSubmitted(true)} disabled={!selected}>
            回答する
          </Button>
        )}

        {/* 判定・解説 */}
        {submitted && (
          <div className="space-y-3 pt-1 border-t border-gray-100">
            {isCorrect ? (
              <p className="text-green-600 font-semibold">✅ 正解！</p>
            ) : (
              <p className="text-red-500 font-semibold">
                ❌ 不正解（正解は {question.answer} です）
              </p>
            )}

            {question.explanation && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed">
                <p className="text-xs font-semibold text-gray-400 mb-1">解説</p>
                <p className="whitespace-pre-wrap">{question.explanation}</p>
              </div>
            )}

            <div className="flex gap-2 flex-wrap pt-1">
              {!isLast && (
                <Button onClick={onNext}>次の問題へ</Button>
              )}
              <button
                onClick={onRetry}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                もう一度試す
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- メインページ ----
export default function Quiz() {
  const { user } = useAuth();
  const userId = user?.uid ?? null;

  const [inputWord, setInputWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

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
        />
      </div>
    );
  }

  // ---- 入力フォーム ----
  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto space-y-4">
      <div>
        <Heading>クイズ</Heading>
        <HeadingDetail>単語を入力してクイズに挑戦しましょう</HeadingDetail>
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
            onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
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
