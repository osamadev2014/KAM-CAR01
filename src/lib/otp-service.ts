import { createClient } from "./supabase";
import { formatPhoneForAuth } from "./phone-utils";

const OTP_LENGTH = 4;

export async function sendOtp(
  phone: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone: formatPhoneForAuth(phone),
  });
  if (error) return { success: false, error: error.message };
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
  if (code.length !== OTP_LENGTH) {
    return { success: false, error: "رمز التحقق يجب أن يكون 4 أرقام" };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    phone: formatPhoneForAuth(phone),
    token: code,
    type: "sms",
  });
  if (error) return { success: false, error: "رمز التحقق غير صحيح" };
  return { success: true, data: { user: data.user } };
}

export async function resendOtp(
  phone: string,
): Promise<{ success: boolean; error?: string }> {
  return sendOtp(phone);
}
