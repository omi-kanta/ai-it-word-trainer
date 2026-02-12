export function ErrorMessage({ message, className = "" }) {
  // メッセージが無い場合は何も描画しない
  if (!message) return null;

  return (
    <div
      className={`rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700
                  dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200
                  ${className}`}
    >
      {message}
    </div>
  );
}
