import { useEffect, useMemo, useState } from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const sampleQuestions = [
  {
    id: "q1",
    topic: "algebra",
    text: "What is the value of x in the equation 2x + 4 = 10?",
    options: ["2", "3", "4", "6"],
    correct: 1, // 3
  },
  {
    id: "q2",
    topic: "geometry",
    text: "What is the area of a rectangle with width 5 and height 3?",
    options: ["8", "10", "15", "30"],
    correct: 2, // 15
  },
  {
    id: "q3",
    topic: "arithmetic",
    text: "What is 12 / 3?",
    options: ["2", "3", "4", "6"],
    correct: 2, // 4
  },
];

export default function DiagnosticQuiz({ studentId, onSubmitted }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const score = useMemo(() => {
    const total = sampleQuestions.length;
    const correct = sampleQuestions.filter((q, idx) => {
      const a = answers[q.id];
      return typeof a === "number" && a === q.correct;
    }).length;
    return Math.round((correct / total) * 100);
  }, [answers]);

  const topic = "diagnostic";

  const handleSubmit = async () => {
    if (!studentId) return;
    setSubmitting(true);
    const start = performance.now();

    // simulate time spent as time since mounting first answer
    const timeSpent = Math.max(5, Math.round((performance.now() - start) / 1000));

    const payload = {
      student_id: studentId,
      topic,
      score,
      time_spent_seconds: timeSpent,
      details: { answers },
    };
    try {
      const res = await fetch(`${BASE_URL}/api/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data);
      onSubmitted?.(data);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-white">Diagnostic Quiz</h2>
        <span className="text-sm text-white/70">Estimated time: 3 min</span>
      </div>
      <div className="space-y-5">
        {sampleQuestions.map((q, qi) => (
          <div key={q.id} className="bg-white/5 rounded-xl p-4">
            <p className="text-white font-medium mb-3">{qi + 1}. {q.text}</p>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`text-left px-3 py-2 rounded-lg border transition ${answers[q.id] === idx ? "bg-indigo-600 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-white/90 hover:bg-white/10"}`}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-white/80">Current Score: <span className="font-semibold text-white">{score}%</span></div>
        <button
          disabled={submitting || !studentId}
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
      {result && (
        <div className="mt-4 text-sm text-white/90">
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-100 rounded-lg p-3">
            {result.message} Next difficulty: <span className="font-semibold">{result.next_difficulty}</span>
          </div>
        </div>
      )}
    </div>
  );
}
