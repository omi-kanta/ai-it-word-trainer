import { db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function updateWordMeta(docId, updates) {
  if (!docId) throw new Error("docId は必須です");
  await updateDoc(doc(db, "userWords", docId), updates);
}
