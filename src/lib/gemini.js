export async function generateExplanation(word) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `gemini-2.0-flash:generateContent?key=${apiKey}`;

  console.log("FETCH URL:", url);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `以下のIT用語を初心者でも理解できるように日本語で説明してください：${word}`,
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini HTTP error:", response.status);
    console.error("Gemini error body:", data.error);
    return `エラー: ${data.error?.message ?? "原因不明のエラーです"}`;
  }

  console.log("Gemini Response:", data);

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "説明を生成できませんでした。"
  );
}
