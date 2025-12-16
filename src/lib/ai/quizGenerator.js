import { callGemini } from "./geminiClient";  

export async function generateQuiz(topic) {
  const prompt = `
あなたはIT学習アプリの講師です。
次のトピックについて、日本語の4択クイズを3問作成してください。

【トピック】
${topic}

【条件】
- 初心者〜初級エンジニア向け
- 各問ごとに「質問・選択肢A〜D・正解・解説」を出す
- 用語の名前だけでなく、概念を理解しているか問う内容にする
- 初めからQ1から始める
- 最後の問題は少し難しめにする
- はい、承知いたしました、などの不要な前置きはしない

【出力フォーマット（必ずこの形で）】

Q1:
[質問文]

選択肢:
A. ...
B. ...
C. ...
D. ...

正解:
[正解の選択肢の記号（A/B/C/D）]

解説:
[解説]

Q2:
[質問文]
...

Q3:
[質問文]
...
  `.trim();

  return await callGemini(prompt);
}
