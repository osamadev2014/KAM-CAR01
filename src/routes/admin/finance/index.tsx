import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../../lib/supabase";
import type { FinanceRequest } from "../../../lib/types";
import { DashboardShell } from "../../../components/layout/DashboardShell";

export const Route = createFileRoute("/admin/finance/")({
  component: AdminFinancePage,
});

function AdminFinancePage() {
  const supabase = createClient();

  const { data: requests = [] } = useQuery({
    queryKey: ["admin-finance-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("finance_requests")
        .select("*, partner:finance_partners(name), car:cars(title, year)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as (FinanceRequest & { partner: { name: string }; car: { title: string; year: number } })[];
    },
  });

  const handleUpdateStatus = async (id: string, status: string) => {
    await supabase
      .from("finance_requests")
      .update({ status })
      .eq("id", id);
    window.location.reload();
  };

  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;
  const totalAmount = requests.reduce((sum, r) => sum + (r.requested_amount || 0), 0);

  return (
    <DashboardShell>
      <section className="rounded-2xl border border-syarah-border bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-syarah-text">إدارة التمويل</h2>
        <p className="mt-2 text-sm text-syarah-muted">طلبات التمويل وشركات التمويل</p>

        <div className="mt-6 grid gap-4 grid-cols-4">
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pending}</p>
            <p className="text-xs text-syarah-muted mt-1">قيد المراجعة</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{approved}</p>
            <p className="text-xs text-syarah-muted mt-1">معتمد</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{rejected}</p>
            <p className="text-xs text-syarah-muted mt-1">مرفوض</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-syarah-text">{totalAmount.toLocaleString("ar-SA")}</p>
            <p className="text-xs text-syarah-muted mt-1">إجمالي المبالغ (ر.س)</p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-syarah-border">
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الشريك</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">السيارة</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">سعر السيارة</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">المبلغ المطلوب</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الحالة</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">التاريخ</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-syarah-border hover:bg-syarah-section/50">
                  <td className="py-3 px-4 text-syarah-text font-medium">{req.partner?.name}</td>
                  <td className="py-3 px-4 text-syarah-muted">
                    {req.car?.title} ({req.car?.year})
                  </td>
                  <td className="py-3 px-4 text-syarah-text">{req.vehicle_price.toLocaleString("ar-SA")} ر.س</td>
                  <td className="py-3 px-4 text-syarah-text font-medium">{req.requested_amount.toLocaleString("ar-SA")} ر.س</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      req.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      req.status === "under_review" ? "bg-blue-100 text-blue-700" :
                      req.status === "approved" ? "bg-green-100 text-green-700" :
                      req.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {req.status === "pending" && "قيد الانتظار"}
                      {req.status === "under_review" && "قيد المراجعة"}
                      {req.status === "approved" && "معتمد"}
                      {req.status === "rejected" && "مرفوض"}
                      {req.status === "expired" && "منتهي"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-syarah-muted">
                    {new Date(req.created_at).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {req.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(req.id, "under_review")}
                            className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 text-xs hover:bg-blue-200"
                          >
                            مراجعة
                          </button>
                        </>
                      )}
                      {req.status === "under_review" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(req.id, "approved")}
                            className="px-3 py-1 rounded-lg bg-green-100 text-green-600 text-xs hover:bg-green-200"
                          >
                            اعتماد
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req.id, "rejected")}
                            className="px-3 py-1 rounded-lg bg-red-100 text-red-600 text-xs hover:bg-red-200"
                          >
                            رفض
                          </button>
                        </>
                      )}
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
