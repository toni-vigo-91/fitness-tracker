export default function Header() {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 py-4 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            💪 Fitness
          </h1>
          <p className="text-xs text-slate-400">Tu evolución</p>
        </div>
      </div>
    </header>
  );
}