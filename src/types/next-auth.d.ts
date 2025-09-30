import "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    id_usuario: number;
    matricula: string;
    nome: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      matricula?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    id?: string;
    name?: string;
    matricula?: string;
  }
}
