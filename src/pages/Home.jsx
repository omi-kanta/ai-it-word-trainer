import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Home() {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Home</h1>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        ログアウト
      </button>
    </div>
  );
}
