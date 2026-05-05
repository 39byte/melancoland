"use client";

import { useEffect, useState } from "react";
import type { DiaryEntry } from "@/engine/types";
import { formatDate } from "@/lib/utils";

export default function DiaryFeed() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/diary")
      .then((res) => res.json())
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-sm py-4">불러오는 중...</p>;
  if (entries.length === 0) return <p className="text-center text-sm py-4">아직 공개된 일기가 없어요.</p>;

  return (
    <div className="space-y-3 w-full max-w-lg">
      {entries.map((entry) => (
        <div key={entry.id} className="p-3 rounded-lg border" style={{ borderColor: "var(--bg-secondary)" }}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">{entry.analysis.plantRecommendation.species}</span>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{formatDate(entry.createdAt)}</span>
          </div>
          <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
            {entry.content.slice(0, 50)}...
          </p>
        </div>
      ))}
    </div>
  );
}
