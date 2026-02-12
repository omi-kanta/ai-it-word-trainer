import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  // 入力フォームの state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 通信状態とエラーメッセージ管理
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Firebase Auth のエラーコードを日本語メッセージへ変換
  const toJaMessage = (err) => {
    const code = err?.code ?? "";

    if (code === "auth/email-already-in-use")
      return "このメールアドレスは既に登録されています。";

    if (code === "auth/invalid-email")
      return "メールアドレスの形式が正しくありません。";

    if (code === "auth/weak-password")
      return "パスワードが弱すぎます（6文字以上など）。";

    if (code === "auth/operation-not-allowed")
      return "メール/パスワード認証が無効です（Firebase設定を確認）。";

    return "新規登録に失敗しました。入力内容を確認して再度お試しください。";
  };

  // 新規登録処理
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // 簡易バリデーション
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }

    try {
      setLoading(true);

      // Firebase Authentication によるアカウント作成
      await createUserWithEmailAndPassword(auth, email, password);

      // 登録成功後はホーム画面へ遷移
      navigate("/home");
    } catch (err) {
      console.error(err);

      // エラーコードを日本語に変換して表示
      setError(toJaMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight">
        新規登録
      </h1>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        メールアドレスとパスワードでアカウントを作成します。
      </p>

      {/* エラーメッセージ表示 */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      {/* メールアドレス入力 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
          className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      {/* パスワード入力 */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          パスワード
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="6文字以上（推奨）"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
          className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      {/* 登録ボタン */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {loading ? "登録中..." : "登録"}
      </button>
    </form>
  );
}
