import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // ログイン前はレイアウトを当てない（必要なら）
  // if (!isLoggedIn) return <Outlet />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {isLoggedIn && <Header />}

      {/* ここが余白を埋める：flex-1 */}
      <div className="flex flex-1 min-h-0">    
        {isLoggedIn && <Sidebar />}

        {/* mainもスクロール領域になるように min-h-0 */}
        <main className="flex-1 p-4 min-h-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <footer className="py-4 text-center text-xs text-gray-600">
        &copy; {new Date().getFullYear()} AI IT学習アプリ. All rights reserved.
      </footer>
    </div>
  );
}
