import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../lib/supabase";
import type { Dealer, Car, CarMake, CarModel } from "../../lib/types";
import { AppHeader } from "../../components/layout/AppHeader";
import { AppFooter } from "../../components/layout/AppFooter";

export const Route = createFileRoute("/dealers/$dealerId")({
  component: DealerDetailPage,
});

function DealerDetailPage() {
  const { dealerId } = Route.useParams();
  const supabase = createClient();

  const { data: dealer, isLoading: dealerLoading } = useQuery({
    queryKey: ["dealer", dealerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dealers")
        .select("*")
        .eq("slug", dealerId)
        .single();
      if (error) throw error;
      return data as Dealer;
    },
  });

  const { data: cars = [] } = useQuery({
    queryKey: ["dealer-cars", dealer?.id],
    queryFn: async () => {
      if (!dealer) return [];
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("dealer_id", dealer.id)
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Car[];
    },
    enabled: !!dealer,
  });

  const { data: makes = [] } = useQuery({
    queryKey: ["car_makes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_makes").select("*").order("sort_order");
      if (error) throw error;
      return data as CarMake[];
    },
  });

  const { data: models = [] } = useQuery({
    queryKey: ["car_models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_models").select("*");
      if (error) throw error;
      return data as CarModel[];
    },
  });

  if (dealerLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-syarah-bg">
        <AppHeader />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-white rounded-2xl border border-syarah-border" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-white rounded-2xl border border-syarah-border" />
              ))}
            </div>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="min-h-screen flex flex-col bg-syarah-bg">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-syarah-text">الوكيل غير موجود</h1>
            <Link to="/dealers" className="mt-4 inline-block text-syarah-blue hover:underline">
              العودة لقائمة الوكلاء
            </Link>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-syarah-bg">
      <AppHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="rounded-2xl border border-syarah-border bg-white overflow-hidden mb-8">
          <div className="h-48 bg-syarah-section relative">
            {dealer.cover_url ? (
              <img src={dealer.cover_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-syarah-muted">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {dealer.logo_url && (
                <img src={dealer.logo_url} alt="" className="w-16 h-16 rounded-xl border border-syarah-border object-contain bg-white" />
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-syarah-text">{dealer.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  {dealer.city && <span className="text-syarah-muted">{dealer.city}</span>}
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-syarah-text">{dealer.rating.toFixed(1)}</span>
                    <span className="text-syarah-muted text-sm">({dealer.review_count})</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {dealer.phone && (
                  <a
                    href={`tel:${dealer.phone}`}
                    className="px-4 py-2 rounded-xl bg-syarah-blue text-white text-sm font-medium hover:bg-syarah-blue/90 transition-colors"
                  >
                    اتصال
                  </a>
                )}
              </div>
            </div>
            {dealer.description && (
              <p className="mt-4 text-syarah-muted leading-relaxed">{dealer.description}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-syarah-text">
            سيارات الوكيل ({cars.length})
          </h2>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-syarah-border bg-white">
            <p className="text-syarah-muted text-lg">لا توجد سيارات منشورة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => {
              const make = makes.find((m) => m.id === car.make_id);
              const model = models.find((m) => m.id === car.model_id);
              return (
                <Link
                  key={car.id}
                  to="/cars/$carId"
                  params={{ carId: car.id }}
                  className="group rounded-2xl border border-syarah-border bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:border-syarah-blue"
                >
                  <div className="aspect-[4/3] bg-syarah-section relative">
                    <div className="w-full h-full flex items-center justify-center text-syarah-muted">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 text-xs font-medium text-syarah-text">
                      {car.condition === "new" ? "جديدة" : "مستعملة"}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-syarah-text group-hover:text-syarah-blue transition-colors line-clamp-1">
                      {car.title}
                    </h3>
                    <p className="text-sm text-syarah-muted mt-1">
                      {make?.name_ar} {model?.name_ar} {car.year}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-syarah-blue">
                        {car.price_cash.toLocaleString("ar-SA")} ر.س
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
