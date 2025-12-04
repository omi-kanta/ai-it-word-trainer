import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { generateExplanation } from "../lib/gemini";

export default function Home() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    signOut(auth);
  };

  const handleGenerate = async () => {
    if (!word) return;

    setLoading(true);
    setResult("");

    const explanation = await generateExplanation(word);

    setResult(explanation);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Home</h1>

      <input
        type="text"
        placeholder="調べたいIT用語を入力"
        className="border p-2 w-full mb-4 rounded"
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "生成中..." : "AIで説明を生成する"}
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">生成結果：</h2>
          <p className="whitespace-pre-line">{result}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-8 bg-red-500 text-white px-4 py-2 rounded w-full"
      >
        ログアウト
      </button>
    </div>
  );
}
