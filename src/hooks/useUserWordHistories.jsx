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
 * @returns {histories: Array, loading: boolean, error: any}
 */
export function useUserWordHistories(userId) {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    if (!userId) {
      setHistories([]); 
      setLoading(false);
      setError(null);
      return;
    }

    const q = query(
      collection(db, "userWords"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

const unsubscribe = onSnapshot(q, (snapshot) => {
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  setHistories(data);
  setLoading(false);
  setError(null);
});

    return () => unsubscribe();
  }, [userId]);

  return { histories, loading, error  };
}
