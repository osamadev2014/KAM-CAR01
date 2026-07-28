import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../../lib/supabase";
import type { Profile } from "../../../lib/types";
import { DashboardShell } from "../../../components/layout/DashboardShell";

export const Route = createFileRoute("/admin/users/")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const supabase = createClient();

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  const handleUpdateRole = async (id: string, role: string) => {
    await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id);
    window.location.reload();
  };

  const customers = users.filter((u) => u.role === "customer").length;
  const dealers = users.filter((u) => u.role === "dealer").length;
  const admins = users.filter((u) => u.role === "admin").length;

  return (
    <DashboardShell>
      <section className="rounded-2xl border border-syarah-border bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-syarah-text">إدارة المستخدمين</h2>
        <p className="mt-2 text-sm text-syarah-muted">جميع المستخدمين المسجلين والأدوار</p>

        <div className="mt-6 grid gap-4 grid-cols-4">
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-syarah-text">{users.length}</p>
            <p className="text-xs text-syarah-muted mt-1">إجمالي المستخدمين</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-syarah-text">{customers}</p>
            <p className="text-xs text-syarah-muted mt-1">عميل</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{dealers}</p>
            <p className="text-xs text-syarah-muted mt-1">وكيل</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{admins}</p>
            <p className="text-xs text-syarah-muted mt-1">مدير</p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-syarah-border">
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">المستخدم</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الجوال</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الدور</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">تاريخ التسجيل</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-syarah-border hover:bg-syarah-section/50">
                  <td className="py-3 px-4">
                    <p className="text-syarah-text font-medium">{user.full_name || "بدون اسم"}</p>
                    <p className="text-xs text-syarah-muted">{user.id.slice(0, 8)}...</p>
                  </td>
                  <td className="py-3 px-4 text-syarah-text">{user.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin" ? "bg-green-100 text-green-700" :
                      user.role === "dealer" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {user.role === "admin" && "مدير"}
                      {user.role === "dealer" && "وكيل"}
                      {user.role === "customer" && "عميل"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-syarah-muted">
                    {new Date(user.created_at).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="px-2 py-1 rounded-lg border border-syarah-border text-xs bg-white text-syarah-text"
                    >
                      <option value="customer">عميل</option>
                      <option value="dealer">وكيل</option>
                      <option value="admin">مدير</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}
