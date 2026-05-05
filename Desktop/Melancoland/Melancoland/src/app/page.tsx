"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const GardenCanvas = dynamic(() => import("@/components/garden/GardenCanvas"), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          🌱 Melancoland
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          모두의 감정이 자라는 공유 정원
        </p>
      </div>

      <div className="relative">
        <GardenCanvas />
      </div>

      <div className="flex gap-4">
        <Link
          href="/write"
          className="px-5 py-2.5 rounded-lg text-white font-medium"
          style={{ backgroundColor: "var(--accent)" }}
        >
          🌱 일기 쓰기
        </Link>
        <Link
          href="/history"
          className="px-5 py-2.5 rounded-lg border font-medium"
          style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
        >
          내 기록
        </Link>
      </div>

      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        방향키/WASD로 이동 · 식물을 클릭하면 일기를 읽을 수 있어요
      </p>
    </div>
  );
}
