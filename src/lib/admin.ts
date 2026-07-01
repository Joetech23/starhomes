import "server-only";
import { createClient } from "./supabase/server";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

/** Returns the current user if they are an admin, otherwise null. */
export async function getAdmin(): Promise<AdminUser | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;
  return { id: user.id, email: profile.email ?? user.email ?? "", role: profile.role };
}
