import axios from "axios";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials) {
                try {
                    const { email, password } = credentials as any;
                    const loginApi = process.env.LOGIN_API as string;
                    const response = await axios.post(loginApi, { email, password });
                    const result = response.data;
                    if (result?.data?.access_token) {
                        const accessToken = result.data.access_token;
                        const payload = accessToken.split('.')[1];
                        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
                        return {
                            id: decoded.id.toString(),
                            role: decoded.role,
                            username: decoded.username,
                            accessToken: accessToken
                        }
                    }
                    return null;
                } catch (error: unknown) {
                    if (axios.isAxiosError(error)) {
                        console.error("Login Error:", error.response?.data?.message || error.message);
                        throw new Error(error.response?.data?.message || error.message);
                    } else {
                        console.error("Login Error:", error);
                    }
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (user && account) {
                if (account.provider === 'credentials') {
                    token.role = user.role;
                    token.accessToken = user.accessToken;
                } else if (account.provider === 'google') {
                    try {
                        const googleLoginApi = process.env.LOGIN_WITH_GOOGLE_API as string;
                        const response = await axios.post(googleLoginApi, {
                            email: token.email,
                            name: token.name,
                            googleId: profile?.sub,
                            image: token.picture
                        });
                        const accessToken = response.data?.data?.access_token;
                        const payload = accessToken.split('.')[1];
                        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
                        token.role = decoded.role;
                        token.accessToken = accessToken;
                    } catch (error: unknown) {
                        if (axios.isAxiosError(error)) {
                            console.error("Google Login Error:", error.response?.data?.message || error.message);
                            throw new Error(error.response?.data?.message || error.message);
                        } else {
                            console.error("Google Login Error:", error);
                        }
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role;
                session.user.accessToken = token.accessToken;
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt',
    }
    , secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };