import { useState } from "react";
import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { createClient } from "../lib/supabase";
import { sendOtp } from "../lib/otp-service";
import { normalizeSaudiPhone } from "../lib/phone-utils";

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: "/" });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = Route.useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const normalized = normalizeSaudiPhone(phone);
    if (!normalized) {
      setError("يرجى إدخال رقم جوال سعودي صحيح");
      return;
    }
    if (name.trim().length < 2) {
      setError("يرجى إدخال الاسم");
      return;
    }

    setIsLoading(true);
    const result = await sendOtp(normalized);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || "حدث خطأ أثناء إرسال رمز التحقق");
      return;
    }

    sessionStorage.setItem("reg_name", name.trim());
    navigate({ to: "/verify", search: { phone: normalized } });
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
          <h1 className="text-[22px] font-bold text-syarah-text">إنشاء حساب جديد</h1>
          <p className="mt-1 text-[13px] text-syarah-muted">
            أدخل بياناتك وسنرسل لك رمز تحقق
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-[13px] text-syarah-muted">
              الاسم الكامل
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[6px] border border-syarah-border px-4 py-3 text-[14px] text-syarah-text outline-none transition-colors focus:border-syarah-blue"
              placeholder="محمد أحمد"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-[13px] text-syarah-muted">
              رقم الجوال
            </label>
            <div className="flex">
              <span className="inline-flex items-center rounded-r-[6px] border border-l-0 border-syarah-border bg-syarah-section px-3 text-[14px] text-syarah-muted">
                +966
              </span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 9))}
                maxLength={9}
                className="w-full rounded-l-[6px] border border-syarah-border px-4 py-3 text-[14px] text-syarah-text outline-none transition-colors focus:border-syarah-blue"
                placeholder="5XXXXXXXX"
                dir="ltr"
              />
            </div>
          </div>

          {error && (
            <p className="text-[13px] text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || name.trim().length < 2 || phone.length < 9}
            className="mt-2 w-full rounded-[6px] bg-syarah-green py-3.5 text-[16px] font-bold text-white transition-colors hover:bg-[#009345] disabled:opacity-50"
          >
            {isLoading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-syarah-muted">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="font-semibold text-syarah-blue hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
