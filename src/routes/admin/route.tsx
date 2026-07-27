import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { createClient } from "../../lib/supabase";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/admin-login" });
    }
  },
  component: () => <Outlet />,
});
