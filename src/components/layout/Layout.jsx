import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";

export default function Layout() {
  const { user } = useAuth();

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* 🔹 ログイン済みのときだけヘッダーを出す */}
      {isLoggedIn && <Header />}

      {/* メインコンテンツ領域 */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {!isLoggedIn && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">AI</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">
                IT学習アプリへようこそ
              </h1>
              <p className="text-gray-600">アカウントにログインしてください</p>
            </div>
          )}
          <Outlet />
        </div>
      </div>
      {/* フッター */}
      {/* <footer className="py-4 text-center text-xs text-gray-600">
        &copy; {new Date().getFullYear()} AI IT単語トレーナー. All rights reserved.
      </footer> */}
    </div>
  );
}
