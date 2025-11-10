import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

interface ApiUser {
  id_usuario: number;
  matricula: string;
  nome: string;
  cargo: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

async function refreshAccessToken(token: JWT) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    const refreshedTokens = await res.json();

    if (!res.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, 
    };
  } catch (error) {
    console.error("Erro ao atualizar o token de acesso:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError", 
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        matricula: { label: "Matrícula", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              matricula: credentials?.matricula,
              senha: credentials?.senha,
            }),
          });

          if (!res.ok) {
            const responseBody = await res.text();
            console.error("Falha na autenticação:", res.status, responseBody);
            return null;
          }

          const user: ApiUser = await res.json();
          if (user && user.id_usuario) {
            return { ...user, id: String(user.id_usuario) };
          }
          console.error("API de autenticação não retornou um id_usuario válido.");
          return null;
        } catch (error) {
          console.error("Erro ao conectar API de auth:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/", 
  },
  callbacks: {
    async jwt({ token, user }) {
     
      if (user) {
        console.log("Objeto User no callback JWT:", user);
        token.accessToken = user.access_token;
        token.refreshToken = user.refresh_token;
        token.accessTokenExpires = Date.now() + user.expires_in * 1000;
        token.id = user.id;
        token.name = user.nome;
        token.matricula = user.matricula;
        token.cargo = user.cargo;
        return token;
      }

      
      if (Date.now() < (token.accessTokenExpires as number)) {
       
        return token;
      }

      
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      session.user.name = token.name;
      session.user.matricula = token.matricula as string;
      session.user.cargo = token.cargo as string;
      session.error = token.error as "RefreshAccessTokenError" | undefined; // Propaga o erro para o cliente
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


