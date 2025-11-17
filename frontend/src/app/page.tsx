import { Dashboard } from "@/components/dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f172a,_#05060a)] text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-10">
        <Dashboard />
      </div>
    </div>
  );
}
