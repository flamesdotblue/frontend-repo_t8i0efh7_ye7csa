import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import DiagnosticQuiz from "./components/DiagnosticQuiz";
import ProgressDashboard from "./components/ProgressDashboard";
import RecommendationsPanel from "./components/RecommendationsPanel";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function App() {
  const [studentId, setStudentId] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const sid = localStorage.getItem("student_id");
    const sname = localStorage.getItem("student_name");
    if (sid) {
      setStudentId(sid);
    }
    if (sname) setStudentName(sname);
  }, []);

  const createStudent = async (name) => {
    setCreating(true);
    try {
      const res = await fetch(`${BASE_URL}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.student_id) {
        setStudentId(data.student_id);
        setStudentName(name);
        localStorage.setItem("student_id", data.student_id);
        localStorage.setItem("student_name", name);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-black">
      <Header studentName={studentName} />

      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            {!studentId ? (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Create your learning profile</h2>
                <p className="text-white/70 text-sm mb-4">We'll personalize content, pace, and recommendations to you.</p>
                <NameCapture onCreate={createStudent} creating={creating} />
              </div>
            ) : (
              <DiagnosticQuiz studentId={studentId} />
            )}
          </div>
          <RecommendationsPanel studentId={studentId} />
        </section>
        <aside className="lg:col-span-1">
          <ProgressDashboard studentId={studentId} />
        </aside>
      </main>

      <footer className="text-center text-white/50 text-xs py-6">Built with FastAPI + React • Adaptive learning demo</footer>
    </div>
  );
}

function NameCapture({ onCreate, creating }) {
  const [name, setName] = useState("");
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={() => name && onCreate(name)}
        disabled={!name || creating}
        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {creating ? "Creating..." : "Start Learning"}
      </button>
    </div>
  );
}
