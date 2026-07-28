import { useState, useEffect, useRef } from "react";
import { createFileRoute, redirect, Link, useSearch } from "@tanstack/react-router";
import { createClient } from "../lib/supabase";
import { verifyOtp, resendOtp } from "../lib/otp-service";

export const Route = createFileRoute("/verify")({
  validateSearch: (search: Record<string, unknown>): { phone: string } => ({
    phone: (search.phone as string) || "",
  }),
  beforeLoad: async ({ search }) => {
    if (!search.phone) {
      throw redirect({ to: "/login" });
    }
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: "/" });
    }
  },
  component: VerifyPage,
});

function VerifyPage() {
  const { phone } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (code.length !== 4) {
      setError("رمز التحقق يجب أن يكون 4 أرقام");
      return;
    }

    setIsLoading(true);
    const result = await verifyOtp(phone, code);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || "رمز التحقق غير صحيح");
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("حدث خطأ في تسجيل الدخول");
      return;
    }

    const regName = sessionStorage.getItem("reg_name");
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle();

    if (!existingProfile) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        phone,
        full_name: regName || null,
        role: "customer",
      });
      if (insertError) {
        console.error("Profile insert error:", insertError);
      }
    } else if (regName) {
      await supabase
        .from("profiles")
        .update({ full_name: regName })
        .eq("id", user.id);
    }

    sessionStorage.removeItem("reg_name");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/" });
    }
  }

  async function handleResend() {
    setError("");
    setCode("");
    setCooldown(30);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    await resendOtp(phone);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-syarah-section px-4" dir="rtl">
      <div className="w-full max-w-[400px] rounded-[8px] border border-syarah-border bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Link to="/" className="mb-4 inline-block">
            <span className="text-[20px] font-extrabold text-syarah-blue">
              KAM<span className="text-syarah-green">CAR</span>
            </span>
          </Link>
          <h1 className="text-[22px] font-bold text-syarah-text">تحقق من رقم الجوال</h1>
          <p className="mt-1 text-[13px] text-syarah-muted">
            أدخل رمز التحقق المكون من 4 أرقام المرسل إلى جوالك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="otp" className="mb-1 block text-[13px] text-syarah-muted">
              رمز التحقق
            </label>
            <input
              ref={inputRef}
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="1234"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))
              }
              maxLength={4}
              className="w-full rounded-[6px] border border-syarah-border px-4 py-3 text-center text-[22px] tracking-[0.5em] text-syarah-text outline-none transition-colors focus:border-syarah-blue"
              autoComplete="one-time-code"
              dir="ltr"
            />
          </div>

          {error && (
            <p className="text-[13px] text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || code.length !== 4}
            className="mt-2 w-full rounded-[6px] bg-syarah-green py-3.5 text-[16px] font-bold text-white transition-colors hover:bg-[#009345] disabled:opacity-50"
          >
            {isLoading ? "جاري التحقق..." : "تحقق"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-[13px] text-syarah-blue hover:underline disabled:text-syarah-muted disabled:no-underline"
          >
            {cooldown > 0 ? `إعادة الإرسال (${cooldown}s)` : "إعادة إرسال الرمز"}
          </button>
        </div>

        <p className="mt-6 text-center text-[13px] text-syarah-muted">
          <Link to="/login" className="font-semibold text-syarah-blue hover:underline">
            العودة لتسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
