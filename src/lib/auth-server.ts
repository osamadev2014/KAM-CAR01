import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const OTP_CODE = "1234";

function deriveCredentials(phone: string) {
  return {
    email: `${phone}@kamcar.com`,
    password: `kamcar-${phone}`,
  };
}

export const verifyOtpServerFn = createServerFn({ method: "POST" })
  .validator((data: { phone: string; code: string }) => ({
    phone: data.phone,
    code: data.code,
  }))
  .handler(async ({ data }) => {
    if (data.code !== OTP_CODE) {
      throw new Error("Invalid OTP code");
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { email, password } = deriveCredentials(data.phone);

    const { data: users } = await admin.auth.admin.listUsers({
      filter: `email eq "${email}"`,
    });

    if (users.users.length === 0) {
      const { error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { phone: data.phone },
      });
      if (createError) throw new Error(createError.message);
    }

    const anonClient = createClient(supabaseUrl, anonKey);
    const { data: session, error: signInError } =
      await anonClient.auth.signInWithPassword({ email, password });
    if (signInError) throw new Error(signInError.message);

    return {
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
      user: {
        id: session.user.id,
        email: session.user.email,
      },
    };
  });
