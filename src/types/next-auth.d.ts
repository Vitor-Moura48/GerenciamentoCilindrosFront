import "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    id_usuario: number;
    matricula: string;
    nome: string;
    cargo: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  }

  interface Session {
    accessToken?: string;
    error?: "RefreshAccessTokenError"; 
    user: {
      id?: string;
      matricula?: string;
      cargo?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    id?: string;
    name?: string;
    matricula?: string;
    cargo?: string;
  }
}