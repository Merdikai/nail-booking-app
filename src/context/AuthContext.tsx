// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  role: "super_admin" | "admin" | "user";
  company_id: string | null;
  company_name?: string;
  company_logo?: string;
  company_hero_title?: string;
  company_hero_subtitle?: string;
  company_about?: string;
  company_mission?: string;
  company_vision?: string;
  company_phone?: string;
  company_address?: string;
  company_email?: string;
  company_website?: string;
  company_instagram?: string;
  company_facebook?: string;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, companies(*)")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile({
          id: data.id,
          full_name: data.full_name,
          phone_number: data.phone_number,
          email: data.email,
          role: data.role,
          company_id: data.company_id,
          company_name: data.companies?.name,
          company_logo: data.companies?.logo_url,
          company_hero_title: data.companies?.hero_title,
          company_hero_subtitle: data.companies?.hero_subtitle,
          company_about: data.companies?.about_text,
          company_mission: data.companies?.mission_text,
          company_vision: data.companies?.vision_text,
          company_phone: data.companies?.phone,
          company_address: data.companies?.address,
          company_email: data.companies?.email,
          company_website: data.companies?.website,
          company_instagram: data.companies?.instagram,
          company_facebook: data.companies?.facebook,
        });
      }
    } catch (err) {
      console.error("Error in fetchProfile:", err);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}