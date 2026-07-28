import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../../lib/supabase";
import type { AdCampaign, Advertiser } from "../../../lib/types";
import { DashboardShell } from "../../../components/layout/DashboardShell";

export const Route = createFileRoute("/admin/ads/")({
  component: AdminAdsPage,
});

function AdminAdsPage() {
  const supabase = createClient();

  const { data: campaigns = [] } = useQuery({
    queryKey: ["admin-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_campaigns")
        .select("*, advertiser:advertisers(*), placement:ad_placements(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as (AdCampaign & { advertiser: Advertiser })[];
    },
  });

  const totalSpent = campaigns.reduce((sum, c) => sum + (c.spent || 0), 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + (c.impressions_count || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks_count || 0), 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  return (
    <DashboardShell>
      <section className="rounded-2xl border border-syarah-border bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-syarah-text">إدارة الإعلانات</h2>
        <p className="mt-2 text-sm text-syarah-muted">إدارة الحملات الإعلانية وال쉻ات والإعلانات الممولة</p>

        <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4">
            <p className="text-xs text-syarah-muted">الحملات النشطة</p>
            <p className="text-2xl font-bold text-syarah-text mt-1">{activeCampaigns}</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4">
            <p className="text-xs text-syarah-muted">إجمالي الإنفاق</p>
            <p className="text-2xl font-bold text-syarah-text mt-1">{totalSpent.toLocaleString("ar-SA")} ر.س</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4">
            <p className="text-xs text-syarah-muted">المشاهدات</p>
            <p className="text-2xl font-bold text-syarah-text mt-1">{totalImpressions.toLocaleString("ar-SA")}</p>
          </div>
          <div className="rounded-xl border border-syarah-border bg-syarah-section p-4">
            <p className="text-xs text-syarah-muted">النقرات</p>
            <p className="text-2xl font-bold text-syarah-text mt-1">{totalClicks.toLocaleString("ar-SA")}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-syarah-text mb-4">جميع الحملات</h3>
          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-syarah-muted">لا توجد حملات إعلانية بعد</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-syarah-border">
                    <th className="text-right py-3 px-4 font-medium text-syarah-muted">الحملة</th>
                    <th className="text-right py-3 px-4 font-medium text-syarah-muted">الvertiser</th>
                    <th className="text-right py-3 px-4 font-medium text-syarah-muted">النوع</th>
                    <th className="text-right py-3 px-4 font-medium text-syarah-muted">الميزانية</th>
                    <th className="text-right py-3 px-4 font-medium text-syarah-muted">المنفق</th>
                    <th className="text-right py-3 px-4 font-medium text-syarah-muted">المشاهدات</th>
                    <th className="text-right py-3 px-4 font-medium text-syarah-muted">النقرات</th>
                    <th className="text-right py-3 px-4 font-medium text-syarah-muted">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-syarah-border hover:bg-syarah-section/50">
                      <td className="py-3 px-4 text-syarah-text font-medium">{campaign.name}</td>
                      <td className="py-3 px-4 text-syarah-muted">{campaign.advertiser?.name}</td>
                      <td className="py-3 px-4 text-syarah-muted">
                        {campaign.type === "banner" && "بانر"}
                        {campaign.type === "featured_listing" && "إعلان مميز"}
                        {campaign.type === "sponsored" && "ممول"}
                      </td>
                      <td className="py-3 px-4 text-syarah-text">{campaign.budget.toLocaleString("ar-SA")} ر.س</td>
                      <td className="py-3 px-4 text-syarah-text">{campaign.spent.toLocaleString("ar-SA")} ر.س</td>
                      <td className="py-3 px-4 text-syarah-text">{campaign.impressions_count.toLocaleString("ar-SA")}</td>
                      <td className="py-3 px-4 text-syarah-text">{campaign.clicks_count.toLocaleString("ar-SA")}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === "active" ? "bg-green-100 text-green-700" :
                          campaign.status === "paused" ? "bg-yellow-100 text-yellow-700" :
                          campaign.status === "completed" ? "bg-blue-100 text-blue-700" :
                          campaign.status === "draft" ? "bg-gray-100 text-gray-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {campaign.status === "active" && "نشط"}
                          {campaign.status === "paused" && "متوقف"}
                          {campaign.status === "completed" && "مكتمل"}
                          {campaign.status === "draft" && "مسودة"}
                          {campaign.status === "cancelled" && "ملغي"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
