import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { createClient } from "../../lib/supabase";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw redirect({ to: "/login" });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  component: () => <Outlet />,
});
