import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import {
  Brain,
  BookOpen,
  BarChart3,
  Settings,
  Gamepad2,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // SP用ドロワー開閉

  const linkBase =
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition";
  const linkActive =
    "bg-blue-50 text-blue-700 font-semibold";
  const linkInactive =
    "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (e) {
      console.error("ログアウトに失敗しました:", e);
    }
  };

  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* SP用ハンバーガーメニュー */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* SP用オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeDrawer}
        />
      )}

  <aside
    className={`
      fixed md:fixed
      top-16             /* ← ヘッダー分下げる */
      left-0
      z-40
      h-[calc(100vh-4rem)] /* ← ヘッダー分引く */
      w-64
      bg-white border-r border-gray-200
      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0
    `}
  >

      <div className="flex h-full flex-col p-4">
        
          {/* SP用 閉じるボタン */}
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={closeDrawer}>
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 mb-3">
              メニュー
            </p>

            <NavLink
              to="/review"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <Brain size={18} />
              復習
            </NavLink>

            <NavLink
              to="/words"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <BookOpen size={18} />
              単語帳
            </NavLink>

            <NavLink
              to="/quiz"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <Gamepad2 size={18} />
              クイズ
            </NavLink>

            <NavLink
              to="/stats"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <BarChart3 size={18} />
              学習統計
            </NavLink>

            <NavLink
              to="/settings"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <Settings size={18} />
              設定
            </NavLink>
          </nav>

          {/* 下部固定ログアウト */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={18} />
              ログアウト
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
