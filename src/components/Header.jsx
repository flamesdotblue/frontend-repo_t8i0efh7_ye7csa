import { GraduationCap, Brain, Sparkles } from "lucide-react";

export default function Header({ studentName }) {
  return (
    <header className="w-full border-b border-white/10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg"><GraduationCap className="h-6 w-6" /></div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Personalized Edu</h1>
            <p className="text-xs text-white/80 flex items-center gap-1"><Sparkles className="h-4 w-4" /> AI-driven learning</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          <span className="text-sm">Welcome{studentName ? `, ${studentName}` : "!"}</span>
        </div>
      </div>
    </header>
  );
}
