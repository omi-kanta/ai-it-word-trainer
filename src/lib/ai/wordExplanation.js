import { callGemini } from "./geminiClient";  

export async function generateExplanation(word) {
  const prompt = `次のIT用語について初心者向けにわかりやすく説明してください。

  [用語]
  ${word}

  [条件]
  - 日本語で説明すること
  - 具体例を交えて説明すること
  - 箇条書きでポイントを整理する
  `.trim();

  return await callGemini(prompt);  
}