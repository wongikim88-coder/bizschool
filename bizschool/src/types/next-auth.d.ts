import type { DefaultSession } from "next-auth";
import type { SocialProvider, UserRole } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      provider?: SocialProvider;
      role?: UserRole;
      hasPurchasedConsultation?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: SocialProvider;
    role?: UserRole;
    hasPurchasedConsultation?: boolean;
  }
}
