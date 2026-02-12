import { ErrorMessage } from "./ui/ErrorMessage";

export function AuthForm({
  mode,
  email,
  password,
  remember,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onSubmit,
  onForgotPassword,
  onSwitchMode,
}) {
  return (
    <>
      {/* エラーメッセージ表示 */}
      <ErrorMessage message={error} className="mt-6" />

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        {/* メールアドレス */}
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
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={loading}
            required
            className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>

        {/* パスワード */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            placeholder="********"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            disabled={loading}
            required
            className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>

        {/* ログイン状態保持 & パスワード再設定 */}
        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => onRememberChange(e.target.checked)}
              disabled={loading}
            />
            ログイン状態を保持
          </label>

          {mode === "login" && (
            <button
              type="button"
              onClick={onForgotPassword}
              disabled={loading}
              className="text-sm font-medium underline"
            >
              パスワードを忘れた
            </button>
          )}
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading
            ? mode === "login"
              ? "ログイン中..."
              : "登録中..."
            : mode === "login"
            ? "ログイン"
            : "新規登録"}
        </button>

        {/* モード切り替えリンク */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {mode === "login" ? (
            <>
              アカウントをお持ちでないですか？{" "}
              <button
                type="button"
                onClick={() => onSwitchMode("signup")}
                disabled={loading}
                className="font-semibold underline"
              >
                新規登録
              </button>
            </>
          ) : (
            <>
              すでにアカウントをお持ちですか？{" "}
              <button
                type="button"
                onClick={() => onSwitchMode("login")}
                disabled={loading}
                className="font-semibold underline"
              >
                ログイン
              </button>
            </>
          )}
        </p>
      </form>
    </>
  );
}
