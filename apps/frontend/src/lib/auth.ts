import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_SECRET || process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            image: data.user.image,
            accessToken: data.accessToken,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken || account.access_token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image || profile?.picture,
          }
        };
      }

      // Google OAuth
      if (account?.provider === 'google' && profile) {
        try {
          const response = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: profile.name,
              email: profile.email,
              image: profile.picture,
              providerId: profile.sub,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            return {
              ...token,
              accessToken: data.accessToken,
              user: {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                image: data.user.image,
              }
            };
          } else {
            console.error('Google auth API error:', response.status, response.statusText);
            // En cas d'erreur API, on retourne quand même les données Google
            return {
              ...token,
              user: {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
              }
            };
          }
        } catch (error) {
          console.error('Google auth error:', error);
          // En cas d'erreur de connexion, on retourne quand même les données Google
          return {
            ...token,
            user: {
              id: profile.sub,
              name: profile.name,
              email: profile.email,
              image: profile.picture,
            }
          };
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      return {
        ...session,
        accessToken: token.accessToken,
        user: {
          ...session.user,
          id: token.user?.id,
          image: token.user?.image || session.user?.image,
        },
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error: (code, metadata) => {
      console.error('NextAuth Error:', code, metadata);
    },
    warn: (code) => {
      console.warn('NextAuth Warning:', code);
    },
    debug: (code, metadata) => {
      console.log('NextAuth Debug:', code, metadata);
    },
  },
};
