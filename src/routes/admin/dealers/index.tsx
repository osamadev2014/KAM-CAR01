import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../../lib/supabase";
import type { Dealer } from "../../../lib/types";
import { DashboardShell } from "../../../components/layout/DashboardShell";

export const Route = createFileRoute("/admin/dealers/")({
  component: AdminDealersPage,
});

function AdminDealersPage() {
  const supabase = createClient();

  const { data: dealers = [] } = useQuery({
    queryKey: ["admin-dealers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dealers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Dealer[];
    },
  });

  const handleApprove = async (id: string, approve: boolean) => {
    await supabase
      .from("dealers")
      .update({ is_approved: approve })
      .eq("id", id);
    window.location.reload();
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await supabase
      .from("dealers")
      .update({ is_active: !isActive })
      .eq("id", id);
    window.location.reload();
  };

  return (
    <DashboardShell>
      <section className="rounded-2xl border border-syarah-border bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-syarah-text">إدارة الوكلاء</h2>
        <p className="mt-2 text-sm text-syarah-muted">الوكلاء المسجلين وحالات الاعتماد</p>

        <div className="mt-6 grid gap-4 grid-cols-3">
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-syarah-text">{dealers.length}</p>
            <p className="text-xs text-syarah-muted mt-1">إجمالي الوكلاء</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{dealers.filter((d) => d.is_approved).length}</p>
            <p className="text-xs text-syarah-muted mt-1">معتمد</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{dealers.filter((d) => !d.is_approved).length}</p>
            <p className="text-xs text-syarah-muted mt-1">في انتظار الاعتماد</p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-syarah-border">
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الوكيل</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">المدينة</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">التقييم</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الحالة</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map((dealer) => (
                <tr key={dealer.id} className="border-b border-syarah-border hover:bg-syarah-section/50">
                  <td className="py-3 px-4">
                    <p className="text-syarah-text font-medium">{dealer.name}</p>
                    <p className="text-xs text-syarah-muted">{dealer.email || dealer.phone}</p>
                  </td>
                  <td className="py-3 px-4 text-syarah-muted">{dealer.city || "-"}</td>
                  <td className="py-3 px-4 text-syarah-text">{dealer.rating.toFixed(1)} ({dealer.review_count})</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dealer.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {dealer.is_approved ? "معتمد" : "قيد المراجعة"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {!dealer.is_approved && (
                        <button
                          onClick={() => handleApprove(dealer.id, true)}
                          className="px-3 py-1 rounded-lg bg-green-500 text-white text-xs hover:bg-green-600"
                        >
                          اعتماد
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleActive(dealer.id, dealer.is_active)}
                        className={`px-3 py-1 rounded-lg text-xs ${
                          dealer.is_active ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                      >
                        {dealer.is_active ? "تعطيل" : "تفعيل"}
                      </button>
                    </div>
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
