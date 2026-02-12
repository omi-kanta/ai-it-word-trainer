import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex min-h-dvh max-w-md items-center px-6 py-12">
        <div className="w-full">
          {mode === "login" ? (
            <Login switchToSignUp={() => setMode("signup")} />
          ) : (
            <SignUp switchToLogin={() => setMode("login")} />
          )}
        </div>
      </div>
    </div>
  );
}
