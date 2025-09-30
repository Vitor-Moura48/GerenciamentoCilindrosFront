import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-5 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
