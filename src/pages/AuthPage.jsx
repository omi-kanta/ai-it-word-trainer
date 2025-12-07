import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); 

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="bg-white p-8 rounded-xl w-full max-w-sm shadow">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded ${
              mode === "login" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            ログイン
          </button>

          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded ${
              mode === "signup" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            新規登録
          </button>
        </div>
        {mode === "login" ? <Login /> : <SignUp />}
      </div>
    </div>
  );
}
