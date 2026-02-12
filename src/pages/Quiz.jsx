import { useState } from "react";
import { generateQuiz } from "../lib/ai/quizGenerator";
import { Button } from "../components/ui/Button";
import { Heading } from "../components/ui/Heading";
import { HeadingDetail } from "../components/ui/HeadingDetail";
import { ErrorMessage } from "../components/ui/ErrorMessage";

// クイズ生成用の固定トピック一覧
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
  // 現在選択中のトピック
  const [topic, setTopic] = useState(QUIZ_TOPICS[0]);

  // AIから返ってきた生テキスト
  const [quizText, setQuizText] = useState("");

  // 通信状態とエラーメッセージ管理
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // クイズ生成処理（Gemini呼び出し）
  const handleGenerateQuiz = async () => {
    setLoading(true);
    setError("");
    setQuizText("");

    const result = await generateQuiz(topic);

    // generateQuiz がエラー文を文字列で返す設計のため判定
    if (result.startsWith("エラー")) {
      setError(result);
    } else {
      setQuizText(result);
    }

    setLoading(false);
  };

  // ---- 表示用に AIテキストを Q&A に分解するロジック ----
  let questionOnlyText = quizText;
  let answerText = "";
  const qaPairs = [];

  if (quizText) {
    // 「正解:」を基準に複数問のQ&Aを抽出
    // 次の問題番号（1. / 問1 / Q1 など）までを1セットとして扱う
    const pairRegex =
      /([\s\S]*?)正解:([\s\S]*?)(?=(?:\n\s*\d+\.)|\n\s*問\d+|\n\s*Q\d+|$)/g;

    let m;
    while ((m = pairRegex.exec(quizText)) !== null) {
      const question = m[1].trim();
      const answer = ("正解:" + m[2]).trim();
      qaPairs.push({ question, answer });
    }

    // 正規表現で複数問として分解できなかった場合のフォールバック処理
    if (qaPairs.length === 0 && quizText.includes("正解:")) {
      const parts = quizText.split("正解:");
      questionOnlyText = parts[0].trim();
      answerText = ("正解:" + parts.slice(1).join("正解:")).trim();
    }
  }

  return (
    <div className="p-10 max-w-xl mx-auto space-y-4">
      <Heading>クイズ</Heading>
      <HeadingDetail>
        クイズを選んで「クイズを生成」を押すと、問題が3問生成されます。
      </HeadingDetail>

      <div className="mb-10">
        <label className="block text-sm font-medium mb-3">
          クイズのトピック
        </label>

        {/* トピック選択 */}
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

      {/* クイズ生成ボタン */}
      <Button
        onClick={handleGenerateQuiz}
        disabled={loading}
      >
        {loading ? "クイズ生成中..." : "クイズを生成する"}
      </Button>

      {/* エラーメッセージ表示 */}
      <ErrorMessage message={error} className="mt-3" />

      {/* クイズ表示エリア */}
      {quizText && (
        <div className="mt-4 bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2 text-sm">生成されたクイズ：</h2>

          {/* 複数問としてパースできた場合 */}
          {qaPairs.length > 0 ? (
            <div className="space-y-4">
              {qaPairs.map((pair, idx) => (
                <div key={idx} className="border rounded p-3">
                  <div className="text-xs whitespace-pre-wrap">
                    {pair.question}
                  </div>

                  {/* 答えは折りたたみ表示 */}
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
            // 単問フォールバック表示
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
