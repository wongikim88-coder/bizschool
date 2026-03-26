import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import type { SocialProvider, UserRole } from "@/types";

// Mock user data
const MOCK_USERS = [
  {
    id: "test",
    password: "test",
    name: "테스트 사용자",
    email: "test@bizschool.com",
    image: undefined,
    role: "user" as UserRole,
  },
  {
    id: "expert",
    password: "expert",
    name: "김전문가",
    email: "expert@bizschool.com",
    image: undefined,
    role: "expert" as UserRole,
  },
];

const Naver = {
  id: "naver",
  name: "Naver",
  type: "oauth" as const,
  authorization: {
    url: "https://nid.naver.com/oauth2.0/authorize",
    params: { response_type: "code" },
  },
  token: "https://nid.naver.com/oauth2.0/token",
  userinfo: "https://openapi.naver.com/v1/nid/me",
  profile(profile: any) {
    return {
      id: profile.response.id,
      name: profile.response.name || profile.response.nickname,
      email: profile.response.email,
      image: profile.response.profile_image,
    };
  },
  clientId: process.env.NAVER_CLIENT_ID!,
  clientSecret: process.env.NAVER_CLIENT_SECRET!,
};

const Kakao = {
  id: "kakao",
  name: "Kakao",
  type: "oauth" as const,
  authorization: {
    url: "https://kauth.kakao.com/oauth/authorize",
    params: { response_type: "code" },
  },
  token: "https://kauth.kakao.com/oauth/token",
  userinfo: "https://kapi.kakao.com/v2/user/me",
  profile(profile: any) {
    return {
      id: String(profile.id),
      name: profile.kakao_account?.profile?.nickname,
      email: profile.kakao_account?.email,
      image: profile.kakao_account?.profile?.thumbnail_image_url,
    };
  },
  clientId: process.env.KAKAO_CLIENT_ID!,
  clientSecret: process.env.KAKAO_CLIENT_SECRET!,
};

const config: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        username: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        const user = MOCK_USERS.find(
          (u) =>
            u.id === credentials?.username && u.password === credentials?.password
        );
        if (!user) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
    Naver,
    Kakao,
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.provider = account.provider as SocialProvider;
      }
      if (user && "role" in user) {
        token.role = (user as any).role as UserRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.provider) {
        session.user.provider = token.provider as SocialProvider;
      }
      if (token.role) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
