import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <span className="text-gray-900 font-medium text-sm">
              IT学習アプリ
            </span>
          </div>

          <nav className="flex items-center gap-2 text-xs sm:text-sm">
            <Link
              to="/home"
              className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 text-gray-700 hover:text-blue-600"
            >
              <Home size={16} className="shrink-0" />
              <span>ホーム</span>
            </Link>

            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 text-gray-700 hover:text-blue-600"
            >
              <Search size={16} className="shrink-0" />
              <span>検索</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
