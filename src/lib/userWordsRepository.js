import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function saveUserWord({ userId, word, explanation }) {
  if (!userId || !word || !explanation) {
    throw new Error("userId / word / explanation は必須です");
  }

  await addDoc(collection(db, "userWords"), {
    userId,
    word,
    explanation,
    createdAt: serverTimestamp(),
  });
}
