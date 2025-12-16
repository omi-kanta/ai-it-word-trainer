import { callGemini } from "./geminiClient";  

export async function generateExplanation(word) {
  const prompt = `次のIT用語について初心者向けにわかりやすく説明してください。

  [用語]
  ${word}

  [条件]
  - 日本語で説明すること
  - 具体例を交えて説明すること
  - 箇条書きでポイントを整理する
  - はい、承知いたしました、などの不要な前置きはしない
  - 読みやすい文章にしてください
  `.trim();

  return await callGemini(prompt);  
}