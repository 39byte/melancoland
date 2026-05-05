import Navigation from "@/components/ui/Navigation";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-3 backdrop-blur-md" style={{ backgroundColor: "rgba(245,240,232,0.9)" }}>
      <Navigation />
    </header>
  );
}
