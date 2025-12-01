// app/(dashboard)/layout.tsx
import "../globals.css";
import Header from "@/components/header";
import BackendStatusBanner from "@/components/BackendStatusBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <BackendStatusBanner />
      <main className="flex-1">{children}</main>
    </div>
  );
}
