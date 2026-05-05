interface Props {
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({ variant = "primary", children, onClick, disabled, className = "" }: Props) {
  const base = "px-4 py-2 rounded-lg font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed";
  const styles: Record<string, string> = {
    primary: "text-white",
    secondary: "text-white",
    ghost: "border",
  };
  const bgColors: Record<string, string> = {
    primary: "var(--accent)",
    secondary: "var(--accent-warm)",
    ghost: "transparent",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
      style={{ backgroundColor: bgColors[variant], borderColor: "var(--bg-secondary)" }}
    >
      {children}
    </button>
  );
}
