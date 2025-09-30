import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

interface ApiUser {
  id_usuario: number;
  matricula: string;
  nome: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        matricula: { label: "Matrícula", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:8000/auth/login", {
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

          const responseBody = await res.text();
          const user: ApiUser = JSON.parse(responseBody);
          return { ...user, id: String(user.id_usuario) };
        } catch (error) {
          console.error("Erro ao conectar API de auth:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/", // ajuste conforme sua rota
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.access_token;
        token.name = user.nome;
        token.matricula = user.matricula;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      session.user.name = token.name;
      session.user.matricula = token.matricula as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
