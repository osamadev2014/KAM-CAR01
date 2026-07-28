import { createClient } from "./supabase";

const DEV_OTP = "1234";
const OTP_LENGTH = 4;

function getAuthCredentials(phone: string) {
  return {
    email: `${phone}@kamcar.auth`,
    password: `kamcar-${phone}`,
  };
}

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
  if (code.length !== OTP_LENGTH) {
    return { success: false, error: "رمز التحقق يجب أن يكون 4 أرقام" };
  }

  if (code !== DEV_OTP) {
    return { success: false, error: "رمز التحقق غير صحيح" };
  }

  const supabase = createClient();
  const { email, password } = getAuthCredentials(phone);

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { phone } },
    });

    if (signUpError) {
      return { success: false, error: signUpError.message };
    }

    return { success: true, data: { user: signUpData.user } };
  }

  return { success: true, data: { user: data.user } };
}

export async function resendOtp(
  phone: string,
): Promise<{ success: boolean; error?: string }> {
  return sendOtp(phone);
}
