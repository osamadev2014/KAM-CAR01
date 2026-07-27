import { createFileRoute, redirect } from "@tanstack/react-router";
import { createClient } from "../lib/supabase";

export const Route = createFileRoute("/admin-login")({
  beforeLoad: async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: "/admin" });
    }
  },
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = Route.useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("خطأ في تسجيل الدخول: " + error.message);
      return;
    }

    navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-syarah-section px-4" dir="rtl">
      <div className="w-full max-w-[400px] rounded-[8px] border border-syarah-border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-[22px] font-bold text-syarah-text">
          تسجيل الدخول — لوحة التحكم
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-[13px] text-syarah-muted">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-[6px] border border-syarah-border px-4 py-3 text-[14px] text-syarah-text outline-none transition-colors focus:border-syarah-blue"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-[13px] text-syarah-muted">
              كلمة المرور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-[6px] border border-syarah-border px-4 py-3 text-[14px] text-syarah-text outline-none transition-colors focus:border-syarah-blue"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-[6px] bg-syarah-green py-3.5 text-[16px] font-bold text-white transition-colors hover:bg-[#009345]"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}
