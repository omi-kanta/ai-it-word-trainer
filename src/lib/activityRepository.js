import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function saveQuizSession({ userId, topic }) {
  if (!userId) throw new Error("userId は必須です");
  await addDoc(collection(db, "quizSessions"), {
    userId,
    topic,
    createdAt: serverTimestamp(),
  });
}
