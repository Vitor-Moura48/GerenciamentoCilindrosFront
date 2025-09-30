import Button from "@/components/Button";
import Panel from "@/components/Panel";
import ImageProfile from "@/hooks/ImageProfile";
import StaticField from "@/components/StaticField";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex">
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-xl">

          <Panel className="mb-6">
            <ImageProfile size={100} editable={true}></ImageProfile>
            
            <StaticField label="Nome Completo" value="Gabriel Silva" />
            <StaticField label="Cargo" value="Administrador" />

            <Button
              className="bg-[#0F2B40] text-white py-3 px-4 rounded-sm flex mx-auto cursor-pointer active:bg-[#0C1E30]"
              type="submit"
            >
              Recuperar Matrícula
            </Button>
          </Panel>

        </div>
      </main>
    </div>
  );
}