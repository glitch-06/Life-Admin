import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/types";

export interface Credentials {
  email: string;
  password: string;
}

export interface SignupPayload extends Credentials {
  name: string;
}

function mapSupabaseUser(user: {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
}): User {
  return {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    avatar: user.user_metadata?.avatar_url || null,
    plan: "free",
    createdAt: user.created_at,
  };
}

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Failed to get current user:", error);
      return null;
    }

    if (!user) {
      return null;
    }

    return mapSupabaseUser(user);
  },

  async login(credentials: Credentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Login failed. Please try again.");
    }

    return mapSupabaseUser(data.user);
  },

  async signup(payload: SignupPayload): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Account creation failed. Please try again.");
    }

    return mapSupabaseUser(data.user);
  },

  async requestPasswordReset(
    email: string
  ): Promise<{ sent: boolean; email: string }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw new Error(error.message);
    }

    return {
      sent: true,
      email,
    };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  },
};