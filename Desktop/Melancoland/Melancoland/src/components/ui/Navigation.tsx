"use client";

import Link from "next/link";
import { usePresenceStore } from "@/stores/presenceStore";

export default function Navigation() {
  const { count } = usePresenceStore();

  return (
    <nav className="flex items-center gap-6">
      <Link href="/" className="text-lg font-bold" style={{ color: "var(--accent)" }}>
        🌱 Melancoland
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/" className="hover:opacity-70">정원</Link>
        <Link href="/write" className="hover:opacity-70">일기쓰기</Link>
        <Link href="/history" className="hover:opacity-70">기록</Link>
      </div>
      {count > 0 && (
        <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
          👤 {count}명 접속 중
        </span>
      )}
    </nav>
  );
}
