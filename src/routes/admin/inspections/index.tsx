import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../../lib/supabase";
import type { InspectionAppointment } from "../../../lib/types";
import { DashboardShell } from "../../../components/layout/DashboardShell";

export const Route = createFileRoute("/admin/inspections/")({
  component: AdminInspectionsPage,
});

function AdminInspectionsPage() {
  const supabase = createClient();

  const { data: appointments = [] } = useQuery({
    queryKey: ["admin-inspections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inspection_appointments")
        .select("*, center:inspection_centers(name), service:inspection_services(name)")
        .order("appointment_date", { ascending: false });
      if (error) throw error;
      return data as (InspectionAppointment & { center: { name: string }; service: { name: string } })[];
    },
  });

  const handleUpdateStatus = async (id: string, status: string) => {
    await supabase
      .from("inspection_appointments")
      .update({ status })
      .eq("id", id);
    window.location.reload();
  };

  const pending = appointments.filter((a) => a.status === "pending").length;
  const confirmed = appointments.filter((a) => a.status === "confirmed").length;
  const completed = appointments.filter((a) => a.status === "completed").length;

  return (
    <DashboardShell>
      <section className="rounded-2xl border border-syarah-border bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-syarah-text">إدارة الفحوصات</h2>
        <p className="mt-2 text-sm text-syarah-muted">مواعيد الفحص وتقارير الحالة</p>

        <div className="mt-6 grid gap-4 grid-cols-3">
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pending}</p>
            <p className="text-xs text-syarah-muted mt-1">قيد الانتظار</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{confirmed}</p>
            <p className="text-xs text-syarah-muted mt-1">مؤكد</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{completed}</p>
            <p className="text-xs text-syarah-muted mt-1">مكتمل</p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-syarah-border">
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">المركز</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الخدمة</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">التاريخ</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">السعر</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الحالة</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-b border-syarah-border hover:bg-syarah-section/50">
                  <td className="py-3 px-4 text-syarah-text font-medium">{apt.center?.name}</td>
                  <td className="py-3 px-4 text-syarah-muted">{apt.service?.name}</td>
                  <td className="py-3 px-4 text-syarah-text">
                    {new Date(apt.appointment_date).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="py-3 px-4 text-syarah-text">{apt.price.toLocaleString("ar-SA")} ر.س</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      apt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      apt.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                      apt.status === "completed" ? "bg-green-100 text-green-700" :
                      apt.status === "cancelled" ? "bg-red-100 text-red-700" :
                      apt.status === "in_progress" ? "bg-purple-100 text-purple-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {apt.status === "pending" && "قيد الانتظار"}
                      {apt.status === "confirmed" && "مؤكد"}
                      {apt.status === "in_progress" && "قيد التنفيذ"}
                      {apt.status === "completed" && "مكتمل"}
                      {apt.status === "cancelled" && "ملغي"}
                      {apt.status === "no_show" && "لم يحضر"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {apt.status === "pending" && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, "confirmed")}
                          className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 text-xs hover:bg-blue-200"
                        >
                          تأكيد
                        </button>
                      )}
                      {apt.status === "confirmed" && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, "in_progress")}
                          className="px-3 py-1 rounded-lg bg-purple-100 text-purple-600 text-xs hover:bg-purple-200"
                        >
                          بدء الفحص
                        </button>
                      )}
                      {apt.status === "in_progress" && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, "completed")}
                          className="px-3 py-1 rounded-lg bg-green-100 text-green-600 text-xs hover:bg-green-200"
                        >
                          إتمام
                        </button>
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
