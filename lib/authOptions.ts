import prisma from "@/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
	// use prisma adapter when using oauth providers
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "jwt",
		maxAge: 60 * 60 * 24 * 30,
	  },
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: {
					type: "email",
				}, password: {
					type: "password"
				}
			}, async authorize(credentials) {
				if (!credentials) {
					return null;
				}
				if (!credentials.email || !credentials.password) {
					return null;
				}
				try {
					const user = await prisma.user.findFirst({
						where: {
							email: credentials.email
						}
					});
					if (!user) {
						return null;
					}
					const isValidPassword = await bcrypt.compare(credentials.password, user.password);
					if (!isValidPassword) {
						return null;
					}
					return {
						id: user.id,
						email: user.email,
						role: user.role
					}
				} catch (error: any) {
					throw new Error(error);
				}
			}
		})
	],
	callbacks: {
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id;
				session.user.email = token.email;
				session.user.role = token.role;
			}
			return session;
		},
		async jwt({ token, user }) {
			const dbUser = await prisma.user.findFirst({
				where: {
					email: token.email!,
				},
			});
			if (!dbUser) {
				token.id = user!.id;
				return token;
			}
			return {
				id: dbUser.id,
				email: dbUser.email,
				role: dbUser.role,
			};
		},
		async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
	}, pages: {
		signIn: "/login",
	}
};

export const getAuthSession = () => getServerSession(authOptions)