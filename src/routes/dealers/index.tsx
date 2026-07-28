import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createClient } from "../../lib/supabase";
import type { Dealer } from "../../lib/types";
import { SiteHeader } from "../../components/cardetail/SiteHeader";
import { SiteFooter } from "../../components/cardetail/SiteFooter";

export const Route = createFileRoute("/dealers/")({
  component: DealersPage,
});

function DealersPage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const supabase = createClient();

  const { data: dealers = [], isLoading } = useQuery({
    queryKey: ["dealers", search, city],
    queryFn: async () => {
      let query = supabase
        .from("dealers")
        .select("*")
        .eq("is_active", true)
        .eq("is_approved", true)
        .order("rating", { ascending: false });

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }
      if (city) {
        query = query.eq("city", city);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Dealer[];
    },
  });

  const cities = [...new Set(dealers.map((d) => d.city).filter(Boolean))];

  return (
    <div className="min-h-screen flex flex-col bg-syarah-bg">
      <SiteHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-syarah-text">الوكلاء المعتمدون</h1>
          <p className="mt-2 text-syarah-muted">
            تصفح قائمة الوكلاء المعتمدين في منطقتك
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="بحث بالاسم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-syarah-border bg-white text-syarah-text placeholder:text-syarah-muted focus:outline-none focus:ring-2 focus:ring-syarah-blue"
          />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-syarah-border bg-white text-syarah-text focus:outline-none focus:ring-2 focus:ring-syarah-blue"
          >
            <option value="">جميع المدن</option>
            {cities.map((c) => (
              <option key={c} value={c!}>{c}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white border border-syarah-border animate-pulse" />
            ))}
          </div>
        ) : dealers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-syarah-muted text-lg">لا يوجد وكلاء حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealers.map((dealer) => (
              <Link
                key={dealer.id}
                to="/dealers/$dealerId"
                params={{ dealerId: dealer.slug }}
                className="group rounded-2xl border border-syarah-border bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:border-syarah-blue"
              >
                <div className="h-32 bg-syarah-section relative">
                  {dealer.cover_url ? (
                    <img src={dealer.cover_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-syarah-muted">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                  {dealer.logo_url && (
                    <img
                      src={dealer.logo_url}
                      alt={dealer.name}
                      className="absolute -bottom-6 right-4 w-12 h-12 rounded-xl border-2 border-white bg-white shadow-sm object-contain"
                    />
                  )}
                </div>
                <div className="p-4 pt-8">
                  <h3 className="font-bold text-syarah-text group-hover:text-syarah-blue transition-colors">
                    {dealer.name}
                  </h3>
                  {dealer.city && (
                    <p className="text-sm text-syarah-muted mt-1">{dealer.city}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-syarah-text">{dealer.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-syarah-muted text-sm">({dealer.review_count} تقييم)</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
