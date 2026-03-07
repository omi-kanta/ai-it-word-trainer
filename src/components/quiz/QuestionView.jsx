import { useState } from "react";
import { Button } from "../ui/Button";

export function QuestionView({ question, total, index, onNext, onRetry, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = submitted && selected === question.answer;
  const isLast = index === total - 1;

  const handleSubmit = () => {
    setSubmitted(true);
    if (onAnswer) onAnswer(selected === question.answer);
  };

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
      <p className="text-sm text-gray-500">{index + 1} / {total} 問目</p>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <p className="text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
          {question.question}
        </p>

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

        {!submitted && (
          <Button onClick={handleSubmit} disabled={!selected}>
            回答する
          </Button>
        )}

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
