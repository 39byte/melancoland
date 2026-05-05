"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import type { EmotionAnalysis } from "@/engine/types";

interface HistoryEntry {
  id: string;
  content: string;
  createdAt: string;
  isPrivate: boolean;
  analysis: EmotionAnalysis;
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/diary")
      .then((res) => res.json())
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8">불러오는 중...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">내 일기 기록</h2>

      {entries.length === 0 ? (
        <p className="text-center py-8" style={{ color: "var(--text-secondary)" }}>
          아직 작성한 일기가 없어요.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-lg border cursor-pointer transition-colors hover:bg-[var(--bg-secondary)]"
              style={{ borderColor: "var(--bg-secondary)" }}
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {entry.analysis.plantRecommendation.species}
                  </span>
                  {entry.isPrivate && <span className="text-xs">🔒</span>}
                </div>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {formatDate(entry.createdAt)}
                </span>
              </div>

              {expanded === entry.id && (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--bg-secondary)" }}>
                  <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
                  <p className="text-xs mt-2 italic" style={{ color: "var(--text-secondary)" }}>
                    {entry.analysis.gardenMessage}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
