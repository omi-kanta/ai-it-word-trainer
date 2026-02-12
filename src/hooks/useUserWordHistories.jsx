import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

/**
 * @param {string | null} userId
 * @returns {{ histories: Array, loading: boolean, error: any }}
 */
export function useUserWordHistories(userId) {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    let firstSnapshot = true; 

    const q = query(
      collection(db, "userWords"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
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

        setHistories(data);
        setLoading(false);
      },
      (e) => {
        console.error("🔥 Firestore error:", e);
        setError(e);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return {
    histories,
    loading,
    error,
  };
}
