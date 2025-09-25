import LeftPanel from "@/components/LeftPanel";
import FormLogin from "@/hooks/FormLogin";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <LeftPanel />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-6">BEM-VINDO A OXITECH!</h1>
          <p className="text-sm text-center mb-8">LOGIN PARA CONTINUAR</p>
          <FormLogin />
        </div>
      </main>
    </div>
  );
}
