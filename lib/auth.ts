import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Fetch users from JSONPlaceholder
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const users = await res.json();
        
        // Find user with matching username (using email as username for demo)
        const user = users.find((user: any) => 
          user.email.toLowerCase() === credentials?.username?.toLowerCase()
        );
        
        // For demo purposes, any password works
        if (user) {
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: `https://avatars.dicebear.com/api/avataaars/${user.username}.svg`,
          };
        }
        
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
}; 