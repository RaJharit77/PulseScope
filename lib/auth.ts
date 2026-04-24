import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: {
        async createUser(data) {
            return prisma.user.create({ data });
        },
        async getUser(id) {
            return prisma.user.findUnique({ where: { id } });
        },
        async getUserByEmail(email) {
            return prisma.user.findUnique({ where: { email } });
        },
        async getUserByAccount({ providerAccountId, provider }) {
            const account = await prisma.account.findUnique({
                where: { provider_providerAccountId: { provider, providerAccountId } },
                include: { user: true },
            });
            return account?.user ?? null;
        },
        async updateUser({ id, ...data }) {
            return prisma.user.update({ where: { id }, data });
        },
        async deleteUser(id) {
            await prisma.user.delete({ where: { id } });
        },
        async linkAccount(data) {
            await prisma.account.create({ data });
        },
        async unlinkAccount({ providerAccountId, provider }) {
            await prisma.account.delete({
                where: { provider_providerAccountId: { provider, providerAccountId } },
            });
        },
        async createSession(data) {
            return prisma.session.create({ data });
        },
        async getSessionAndUser(sessionToken) {
            const result = await prisma.session.findUnique({
                where: { sessionToken },
                include: { user: true },
            });
            if (!result) return null;
            const { user, ...session } = result;
            return { session, user };
        },
        async updateSession({ sessionToken, ...data }) {
            return prisma.session.update({ where: { sessionToken }, data });
        },
        async deleteSession(sessionToken) {
            await prisma.session.delete({ where: { sessionToken } });
        },
        async createVerificationToken(data) {
            return prisma.verificationToken.create({ data });
        },
        async useVerificationToken({ identifier, token }) {
            return prisma.verificationToken.delete({
                where: { identifier_token: { identifier, token } },
            });
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const email = credentials?.email as string;
                const password = credentials?.password as string;
                if (!email || !password) return null;
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user || !user.password) return null;
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) return null;
                return { id: user.id, email: user.email, name: user.name };
            },
        }),
    ],
    session: { strategy: "jwt" },
    pages: {
        signIn: "/auth/signin",
        newUser: "/auth/signup",
        error: "/auth/error",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },
        async session({ session, token }) {
            if (session.user) session.user.id = token.id as string;
            return session;
        },
    },
});