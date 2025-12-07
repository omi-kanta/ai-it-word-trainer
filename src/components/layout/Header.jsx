export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <span className="text-gray-900 font-medium text-sm">
              IT学習アプリ
            </span>
          </div>
          {/* <nav className="hidden md:flex items-center gap-3"></nav> */}
          {/* <nav className="flex md:hidden items-center gap-1"></nav> */}
        </div>
      </div>
    </header>
  );
}
