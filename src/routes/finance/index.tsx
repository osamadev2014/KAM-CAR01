import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../lib/supabase";
import type { FinancePartner } from "../../lib/types";
import { SiteHeader } from "../../components/cardetail/SiteHeader";
import { SiteFooter } from "../../components/cardetail/SiteFooter";

export const Route = createFileRoute("/finance/")({
  component: FinancePage,
});

function FinancePage() {
  const supabase = createClient();

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ["finance-partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("finance_partners")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data as FinancePartner[];
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-syarah-bg">
      <SiteHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-syarah-text">التمويل والتأمين</h1>
          <p className="mt-2 text-syarah-muted">احصل على أفضل عروض التمويل من شركائنا</p>
        </div>

        <div className="rounded-2xl border border-syarah-border bg-white p-6 mb-8">
          <h2 className="text-lg font-bold text-syarah-text mb-4">حاسبة التمويل</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-syarah-muted">سعر السيارة (ر.س)</label>
              <input
                type="number"
                placeholder="100000"
                className="w-full mt-1 px-4 py-2.5 rounded-xl border border-syarah-border bg-white text-syarah-text focus:outline-none focus:ring-2 focus:ring-syarah-blue"
              />
            </div>
            <div>
              <label className="text-sm text-syarah-muted">الدفعة المقدمة (ر.س)</label>
              <input
                type="number"
                placeholder="20000"
                className="w-full mt-1 px-4 py-2.5 rounded-xl border border-syarah-border bg-white text-syarah-text focus:outline-none focus:ring-2 focus:ring-syarah-blue"
              />
            </div>
            <div>
              <label className="text-sm text-syarah-muted">المدة (سنوات)</label>
              <select className="w-full mt-1 px-4 py-2.5 rounded-xl border border-syarah-border bg-white text-syarah-text focus:outline-none focus:ring-2 focus:ring-syarah-blue">
                <option value="1">سنة واحدة</option>
                <option value="2">سنتان</option>
                <option value="3">3 سنوات</option>
                <option value="5">5 سنوات</option>
                <option value="7">7 سنوات</option>
              </select>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-syarah-text mb-4">شركاء التمويل</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-white border border-syarah-border animate-pulse" />
            ))}
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-syarah-border bg-white">
            <p className="text-syarah-muted text-lg">لا توجد شركات تمويل متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="rounded-2xl border border-syarah-border bg-white p-6 hover:shadow-md transition-all duration-200 hover:border-syarah-blue"
              >
                <div className="flex items-center gap-4">
                  {partner.logo_url ? (
                    <img src={partner.logo_url} alt="" className="w-12 h-12 rounded-xl object-contain" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-syarah-section flex items-center justify-center text-syarah-muted">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-syarah-text">{partner.name}</h3>
                    <p className="text-xs text-syarah-muted mt-1">
                      {partner.revenue_model === "per_lead" && "رسوم لكل عميل"}
                      {partner.revenue_model === "percentage" && `عمولة ${partner.revenue_percentage}%`}
                      {partner.revenue_model === "per_approved" && "رسوم لكل تمويل معتمد"}
                    </p>
                  </div>
                </div>
                {partner.description && (
                  <p className="mt-4 text-sm text-syarah-muted line-clamp-2">{partner.description}</p>
                )}
                <div className="mt-4 flex gap-2">
                  {partner.website_url && (
                    <a
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 rounded-xl bg-syarah-blue text-white text-sm font-medium hover:bg-syarah-blue/90 transition-colors"
                    >
                      الموقع
                    </a>
                  )}
                  {partner.phone && (
                    <a
                      href={`tel:${partner.phone}`}
                      className="px-4 py-2 rounded-xl border border-syarah-border text-syarah-text text-sm font-medium hover:border-syarah-blue transition-colors"
                    >
                      اتصال
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
