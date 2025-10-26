import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function ProgressDashboard({ studentId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/progress/${studentId}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [studentId]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur">
      <h2 className="text-lg font-semibold text-white mb-3">Progress Overview</h2>
      {!data && (
        <p className="text-white/70 text-sm">{loading ? "Loading..." : "No data yet. Take a quiz to see your progress."}</p>
      )}
      {data && (
        <div className="space-y-3 text-white/90">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Attempts" value={data.attempts} />
            <Stat label="Average Score" value={`${data.average_score}%`} />
            <Stat label="Time Spent" value={`${data.time_spent_seconds}s`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/80 mt-2 mb-1">By Topic</h3>
            <div className="grid md:grid-cols-3 gap-2">
              {Object.entries(data.by_topic || {}).map(([topic, vals]) => (
                <div key={topic} className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="text-sm font-medium text-white">{topic}</div>
                  <div className="text-xs text-white/70">{vals.count} attempts • Avg {Math.round(vals.avg)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
      <div className="text-xs text-white/70">{label}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
