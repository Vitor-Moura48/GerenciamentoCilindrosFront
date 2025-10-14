import Button from "@/components/Button";
import Panel from "@/components/Panel";
import StaticField from "@/components/StaticField";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

const roleMap: Record<string, string> = {
  t: "Técnico",
  g: "Gerente",
  e: "Encarregado",
};

const getRoleName = (roleKey: string | null | undefined): string => {
  console.log(roleKey);
  if (!roleKey) {
    return "Cargo não identificado";
  }

  return roleMap[roleKey.toLowerCase()];
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const userName = user?.name || "Nome não encontrado";
  const userRole = getRoleName(user?.cargo);

  return (
    <div className="min-h-screen flex">
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-xl">
          <Panel className="mb-6">
            <StaticField label="Nome Completo" value={userName} />
            <StaticField label="Cargo" value={userRole} />

            <Button
              className="bg-[#0F2B40] text-white dark:bg-[#686868] dark:text-[#0F2B40] py-3 px-4 rounded-sm flex mx-auto cursor-pointer active:bg-[#0C1E30]"
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