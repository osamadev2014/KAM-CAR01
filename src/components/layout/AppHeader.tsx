import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { createClient } from "../../lib/supabase";
import type { Profile } from "../../lib/types";
import { AppSideMenu } from "./AppSideMenu";

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        setProfile(data as Profile | null);
      }
      setAuthChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        setProfile(data as Profile | null);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setProfile(null);
    setMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-syarah-border/60 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-4">
          <Link to="/" className="flex items-center shrink-0">
            <span className="text-[20px] font-extrabold text-syarah-blue tracking-tight">
              KAM<span className="text-syarah-green">CAR</span>
            </span>
          </Link>

          <button
            type="button"
            aria-label="القائمة"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-syarah-section"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <AppSideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        profile={profile}
        authChecked={authChecked}
        onLogout={handleLogout}
      />
    </>
  );
}
