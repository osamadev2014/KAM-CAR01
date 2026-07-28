import { verifyOtpServerFn } from "./auth-server";
import { createClient } from "./supabase";

export async function sendOtp(
  phone: string,
): Promise<{ success: boolean; error?: string }> {
  sessionStorage.setItem("otp_phone", phone);
  return { success: true };
}

export async function verifyOtp(
  phone: string,
  code: string,
): Promise<{
  success: boolean;
  error?: string;
  data?: { user: { id: string; phone?: string } | null };
}> {
  if (code.length !== 4) {
    return { success: false, error: "رمز التحقق يجب أن يكون 4 أرقام" };
  }

  try {
    const result = await verifyOtpServerFn({ data: { phone, code } });

    const supabase = createClient();
    await supabase.auth.setSession({
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    });

    return { success: true, data: { user: result.user } };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "رمز التحقق غير صحيح";
    return { success: false, error: message };
  }
}

export async function resendOtp(
  phone: string,
): Promise<{ success: boolean; error?: string }> {
  return sendOtp(phone);
}
