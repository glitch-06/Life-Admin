import { demoUser } from "@/lib/mock-data";
import type { User } from "@/lib/types";

const delay = (ms = 350) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface Credentials {
  email: string;
  password: string;
}

export interface SignupPayload extends Credentials {
  name: string;
}

/** Mock auth. Replace with Supabase Auth (signInWithPassword / signUp / OAuth). */
export const authService = {
  async getCurrentUser(): Promise<User> {
    await delay(120);
    return demoUser;
  },
  async login(credentials: Credentials): Promise<User> {
    await delay();
    return { ...demoUser, email: credentials.email };
  },
  async signup(payload: SignupPayload): Promise<User> {
    await delay();
    return { ...demoUser, name: payload.name, email: payload.email };
  },
  async requestPasswordReset(email: string): Promise<{ sent: boolean; email: string }> {
    await delay();
    return { sent: true, email };
  },
  async logout(): Promise<void> {
    await delay(120);
  },
};
