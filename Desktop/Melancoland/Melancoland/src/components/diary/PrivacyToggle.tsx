"use client";

interface Props {
  isPrivate: boolean;
  onChange: (value: boolean) => void;
}

export default function PrivacyToggle({ isPrivate, onChange }: Props) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange(false)}
        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        style={{
          backgroundColor: !isPrivate ? "var(--accent)" : "transparent",
          color: !isPrivate ? "white" : "var(--text-secondary)",
          border: !isPrivate ? "none" : "1px solid var(--bg-secondary)",
        }}
      >
        🔓 공개
      </button>
      <button
        onClick={() => onChange(true)}
        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        style={{
          backgroundColor: isPrivate ? "var(--text-secondary)" : "transparent",
          color: isPrivate ? "white" : "var(--text-secondary)",
          border: isPrivate ? "none" : "1px solid var(--bg-secondary)",
        }}
      >
        🔒 비공개
      </button>
    </div>
  );
}
