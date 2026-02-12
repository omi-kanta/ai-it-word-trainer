import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";

export default function AuthPage() {
  const navigate = useNavigate();

  // login: ログイン画面 / signup: 新規登録画面 を切り替える
  const [mode, setMode] = useState("login");

  // 入力フォーム state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ログイン状態保持（UI用。永続化する場合は setPersistence が必要）
  const [remember, setRemember] = useState(true);

  // 通信中フラグとエラーメッセージ
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ログイン / 新規登録 共通処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 入力チェック
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }

    try {
      setLoading(true);

      // mode に応じて認証処理を分岐
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      // 認証成功後、ホーム画面へ遷移
      navigate("/home");
    } catch (err) {
      console.error(err);

      // 簡易的なエラーメッセージ分岐
      if (mode === "login") {
        setError("メールアドレスかパスワードが違います");
      } else {
        setError(
          "新規登録に失敗しました（メール形式/パスワード条件/重複などを確認）"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <div className="w-full">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "login" ? "ログイン" : "新規登録"}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {mode === "login"
            ? "メールアドレスとパスワードを入力してください。"
            : "メールアドレスとパスワードでアカウントを作成します。"}
        </p>

        {/* ログイン / 新規登録 切り替えタブ */}
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(""); // 画面切替時にエラーをクリア
            }}
            className={[
              "rounded-lg px-3 py-2 text-sm font-semibold transition",
              mode === "login"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100",
            ].join(" ")}
          >
            ログイン
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(""); // 画面切替時にエラーをクリア
            }}
            className={[
              "rounded-lg px-3 py-2 text-sm font-semibold transition",
              mode === "signup"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100",
            ].join(" ")}
          >
            新規登録
          </button>
        </div>

        <AuthForm
          mode={mode}
          email={email}
          onEmailChange={setEmail}
          password={password}
          onPasswordChange={setPassword}
          remember={remember}
          onRememberChange={setRemember}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
          onSwitchMode={
            mode === "login"
              ? () => setMode("signup")
              : () => setMode("login")
          }
        />
      </div>
    </div>
  );
}
