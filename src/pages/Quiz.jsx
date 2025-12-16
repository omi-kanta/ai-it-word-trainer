import { useState } from "react";
import { generateQuiz } from "../lib/ai/quizGenerator";
import { Button } from "../components/ui/Button";

const QUIZ_TOPICS = [
  "プログラミング言語の基礎（変数・条件分岐・ループなど）",
  "Webの基礎知識（HTTP / ブラウザ / URLなど）",
  "インフラストラクチャの基礎（サーバー / クラウド / ネットワークなど）",
  "データベースとSQLの基礎",
  "フロントエンドの基礎（HTML / CSS / JavaScript）",
  "Reactの基礎",
  "Next.jsの基礎",
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

  // ---- ここから表示用の分解ロジック ----
  let questionOnlyText = quizText;
  let answerText = "";
  const qaPairs = [];

  if (quizText) {
    // 複数問の Q&A を正規表現で抽出
    const pairRegex =
      /([\s\S]*?)正解:([\s\S]*?)(?=(?:\n\s*\d+\.)|\n\s*問\d+|\n\s*Q\d+|$)/g;
    let m;
    while ((m = pairRegex.exec(quizText)) !== null) {
      const question = m[1].trim();
      const answer = ("正解:" + m[2]).trim();
      qaPairs.push({ question, answer });
    }

    // 複数問としてパースできなかったときのフォールバック
    if (qaPairs.length === 0 && quizText.includes("正解:")) {
      const parts = quizText.split("正解:");
      questionOnlyText = parts[0].trim();
      answerText = ("正解:" + parts.slice(1).join("正解:")).trim();
    }
  }

  return (
    <div className="p-10 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Quiz（トピック別クイズ）</h1>
      <p className="text-sm text-gray-600 mb-4">
        トピックを選んで「クイズを生成」を押すと、その分野の問題が3問生成されます。
      </p>

      <div className="mb-10">
        <label className="block text-sm font-medium mb-3">
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

      <Button
        onClick={handleGenerateQuiz}
        disabled={loading}
        >
        {loading ? "クイズ生成中..." : "クイズを生成する"}
      </Button>

      {error && (
        <div className="mt-3 text-sm text-red-600 whitespace-pre-line">
          {error}
        </div>
      )}

      {quizText && (
        <div className="mt-4 bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2 text-sm">生成されたクイズ：</h2>

          {qaPairs.length > 0 ? (
            <div className="space-y-4">
              {qaPairs.map((pair, idx) => (
                <div key={idx} className="border rounded p-3">
                  <div className="text-xs whitespace-pre-wrap">
                    {pair.question}
                  </div>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-indigo-600 hover:underline">
                      答えと解説を見る
                    </summary>
                    <pre className="mt-2 text-xs whitespace-pre-wrap">
                      {pair.answer}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <pre className="text-xs whitespace-pre-wrap">
                {questionOnlyText}
              </pre>
              {answerText && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-indigo-600 hover:underline">
                    答えと解説を見る
                  </summary>
                  <pre className="mt-2 text-xs whitespace-pre-wrap">
                    {answerText}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
