import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

/**
 * @param {string | null} userId
 * @returns {{ sessions: Array, loading: boolean, error: any }}
 */
export function useQuizSessions(userId) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    let firstSnapshot = true;

    const q = query(
      collection(db, "quizSessions"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (firstSnapshot) {
          setLoading(true);
          setError(null);
          firstSnapshot = false;
        }

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSessions(data);
        setLoading(false);
      },
      (e) => {
        console.error("Firestore error (quizSessions):", e);
        setError(e);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { sessions, loading, error };
}
