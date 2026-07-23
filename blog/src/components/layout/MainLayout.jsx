import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { PulseStrip } from "@/components/layout/PulseStrip";
import { Footer } from "@/components/layout/Footer";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <PulseStrip />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
