import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../../lib/supabase";
import type { Auction, Car } from "../../../lib/types";
import { DashboardShell } from "../../../components/layout/DashboardShell";

export const Route = createFileRoute("/admin/auctions/")({
  component: AdminAuctionsPage,
});

function AdminAuctionsPage() {
  const supabase = createClient();

  const { data: auctions = [] } = useQuery({
    queryKey: ["admin-auctions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auctions")
        .select("*, car:cars(title, year, condition)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as (Auction & { car: Car })[];
    },
  });

  const handleUpdateStatus = async (id: string, status: string) => {
    await supabase
      .from("auctions")
      .update({ status })
      .eq("id", id);
    window.location.reload();
  };

  const activeAuctions = auctions.filter((a) => a.status === "active").length;
  const endedAuctions = auctions.filter((a) => a.status === "ended").length;
  const totalBids = auctions.reduce((sum, a) => sum + (a.bid_count || 0), 0);

  return (
    <DashboardShell>
      <section className="rounded-2xl border border-syarah-border bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-syarah-text">إدارة المزادات</h2>
        <p className="mt-2 text-sm text-syarah-muted">المزادات النشطة والمكتملة</p>

        <div className="mt-6 grid gap-4 grid-cols-3">
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-syarah-text">{activeAuctions}</p>
            <p className="text-xs text-syarah-muted mt-1">نشط</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-syarah-text">{endedAuctions}</p>
            <p className="text-xs text-syarah-muted mt-1">انتهى</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4 text-center">
            <p className="text-2xl font-bold text-syarah-text">{totalBids}</p>
            <p className="text-xs text-syarah-muted mt-1">إجمالي المزايدات</p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-syarah-border">
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">المزاد</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">السيارة</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">السعر الابتدائي</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">السعر الحالي</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">المزايدات</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الحالة</th>
                <th className="text-right py-3 px-4 font-medium text-syarah-muted">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((auction) => (
                <tr key={auction.id} className="border-b border-syarah-border hover:bg-syarah-section/50">
                  <td className="py-3 px-4 text-syarah-text font-medium">{auction.title}</td>
                  <td className="py-3 px-4 text-syarah-muted">
                    {auction.car?.title} ({auction.car?.year})
                  </td>
                  <td className="py-3 px-4 text-syarah-text">{auction.start_price.toLocaleString("ar-SA")} ر.س</td>
                  <td className="py-3 px-4 text-syarah-text font-medium">
                    {(auction.current_price ?? auction.start_price).toLocaleString("ar-SA")} ر.س
                  </td>
                  <td className="py-3 px-4 text-syarah-text">{auction.bid_count}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      auction.status === "active" ? "bg-green-100 text-green-700" :
                      auction.status === "ended" ? "bg-blue-100 text-blue-700" :
                      auction.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {auction.status === "active" && "نشط"}
                      {auction.status === "ended" && "انتهى"}
                      {auction.status === "cancelled" && "ملغي"}
                      {auction.status === "draft" && "مسودة"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {auction.status === "active" && (
                        <button
                          onClick={() => handleUpdateStatus(auction.id, "ended")}
                          className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 text-xs hover:bg-blue-200"
                        >
                          إنهاء
                        </button>
                      )}
                      {auction.status !== "cancelled" && (
                        <button
                          onClick={() => handleUpdateStatus(auction.id, "cancelled")}
                          className="px-3 py-1 rounded-lg bg-red-100 text-red-600 text-xs hover:bg-red-200"
                        >
                          إلغاء
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
