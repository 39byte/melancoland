import dynamic from "next/dynamic";

const GardenCanvas = dynamic(() => import("@/components/garden/GardenCanvas"), { ssr: false });

export default function GardenPage() {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">공유 정원</h2>
      <div className="relative">
        <GardenCanvas />
      </div>
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        방향키/WASD로 이동 · 식물을 클릭하면 일기를 읽을 수 있어요
      </p>
    </div>
  );
}
