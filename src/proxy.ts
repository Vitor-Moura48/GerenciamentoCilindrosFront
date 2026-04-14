import { NextRequest } from "next/server";

// Middleware desabilitado - todas as rotas liberadas
export default function proxy(req: NextRequest) {
  return undefined;
}