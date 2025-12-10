import { useState } from "react";
import { generateQuiz } from "../lib/ai/quizGenerator";

const QUIZ_TOPICS = [
  "プログラミング言語の基礎（変数・条件分岐・ループなど）",
  "Webの基礎知識（HTTP / ブラウザ / URLなど）",
  "Git / GitHubの基礎",
  "データベースとSQLの基礎",
  "フロントエンドの基礎（HTML / CSS / JavaScript）",
];

export default function Quiz() {
  const [topic, setTopic] = useState(QUIZ_TOPICS[0]); 
  const [quizText, setQuizText] = useState("");       
  const [loading, setLoading] = useState(false);      
  const [error, setError] = useState("");             

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setError("");
    setQuizText("");

    const result = await generateQuiz(topic);

    if (result.startsWith("エラー")) {
      setError(result);
    } else {
      setQuizText(result);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-2">Quiz（トピック別クイズ）</h1>
      <p className="text-sm text-gray-600 mb-4">
        トピックを選んで「クイズを生成」を押すと、その分野の問題が3問生成されます。
      </p>

      <div>
        <label className="block text-sm font-medium mb-1">
          クイズのトピック
        </label>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          {QUIZ_TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGenerateQuiz}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-60"
      >
        {loading ? "クイズ生成中..." : "このトピックでクイズを生成する"}
      </button>

      {error && (
        <div className="mt-3 text-sm text-red-600 whitespace-pre-line">
          {error}
        </div>
      )}

      {quizText && (
        <div className="mt-4 bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2 text-sm">生成されたクイズ：</h2>
          <pre className="text-xs whitespace-pre-wrap">{quizText}</pre>
        </div>
      )}
    </div>
  );
}
