// AI テキストを問題オブジェクトの配列に変換する
export function parseQuizText(text) {
  const questions = [];
  const blockRegex = /Q\d+:\s*\n([\s\S]*?)(?=Q\d+:|$)/g;
  let m;
  while ((m = blockRegex.exec(text)) !== null) {
    const block = m[1];

    const questionMatch = block.match(/^([\s\S]*?)選択肢:/);
    const question = questionMatch ? questionMatch[1].trim() : "";

    const choicesMatch = block.match(/選択肢:([\s\S]*?)正解:/);
    const choicesText = choicesMatch ? choicesMatch[1].trim() : "";
    const choices = {};
    for (const line of choicesText.split("\n")) {
      const cm = line.match(/^([A-D])\.\s*(.*)/);
      if (cm) choices[cm[1]] = cm[2].trim();
    }

    const answerMatch = block.match(/正解:\s*\n?\s*([A-D])/);
    const answer = answerMatch ? answerMatch[1] : "";

    const explMatch = block.match(/解説:\s*\n?([\s\S]*?)$/);
    const explanation = explMatch ? explMatch[1].trim() : "";

    if (question && answer) {
      questions.push({ question, choices, answer, explanation });
    }
  }
  return questions;
}
