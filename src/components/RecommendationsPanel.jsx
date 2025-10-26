import { useEffect, useState } from "react";
import { BookOpen, Video, Puzzle } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const iconFor = (type) => {
  switch (type) {
    case "video":
      return <Video className="h-4 w-4" />;
    case "exercise":
      return <Puzzle className="h-4 w-4" />;
    default:
      return <BookOpen className="h-4 w-4" />;
  }
};

export default function RecommendationsPanel({ studentId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!studentId) return;
    const fetchRecs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/recommendations/${studentId}`);
        const json = await res.json();
        setItems(json.items || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRecs();
  }, [studentId]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur">
      <h2 className="text-lg font-semibold text-white mb-3">Recommended Next Steps</h2>
      {(!items || items.length === 0) && (
        <p className="text-white/70 text-sm">No recommendations yet. Complete a quiz to get personalized suggestions.</p>
      )}
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 text-white rounded-md p-2">
                {iconFor(item.type)}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{item.title}</div>
                <div className="text-xs text-white/70">{item.difficulty ? `Difficulty: ${item.difficulty}` : null}</div>
              </div>
            </div>
            {item.url && (
              <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-300 hover:text-indigo-200 underline">Open</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
