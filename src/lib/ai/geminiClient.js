const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const baseUrl =
  `https://generativelanguage.googleapis.com/v1beta/models/` +
  `gemini-2.0-flash:generateContent?key=${apiKey}`;

export async function callGemini(prompt) {
  if (!apiKey) {
    return "エラー：Gemini APIキーが設定されていません。";
  }
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("Gemini HTTP error:", response.status);
    console.error("Gemini error body:", data?.error);
    return `エラー: ${data?.error?.message ?? "原因不明のエラーです"}`;
  }

  if (!data) {
    console.error("Gemini response JSON parse error");
    return "エラー: レスポンスの解析に失敗しました。";
  }

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "説明を生成できませんでした。"
  );
}
