import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { createClient } from "../../lib/supabase";
import type { Car, CarImage, CarMake } from "../../lib/types";
import { CarCard } from "../../components/listing/CarCard";
import { CarCardSkeleton } from "../../components/listing/CarCardSkeleton";
import { SiteHeader } from "../../components/cardetail/SiteHeader";
import { SiteFooter } from "../../components/cardetail/SiteFooter";

const PAGE_SIZE = 12;

type CarsSearch = {
  make_id?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  condition?: "new" | "used";
  page?: number;
};

export const Route = createFileRoute("/cars/")({
  validateSearch: (search: Record<string, unknown>): CarsSearch => ({
    make_id: (search.make_id as string) || undefined,
    minPrice: search.minPrice ? Number(search.minPrice) : undefined,
    maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
    year: search.year ? Number(search.year) : undefined,
    condition: (search.condition as "new" | "used") || undefined,
    page: search.page ? Number(search.page) : 1,
  }),
  component: CarsListing,
});

function CarsListing() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const supabase = createClient();
  const page = search.page || 1;

  const { data: makes = [] } = useQuery({
    queryKey: ["car_makes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_makes")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as CarMake[];
    },
  });

  const { data: carsData, isLoading: carsLoading } = useQuery({
    queryKey: ["cars", search],
    queryFn: async () => {
      let query = supabase
        .from("cars")
        .select("*", { count: "exact" })
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (search.make_id) query = query.eq("make_id", search.make_id);
      if (search.minPrice) query = query.gte("price_cash", search.minPrice);
      if (search.maxPrice) query = query.lte("price_cash", search.maxPrice);
      if (search.year) query = query.eq("year", search.year);
      if (search.condition) query = query.eq("condition", search.condition);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;
      return { cars: data as Car[], total: count ?? 0 };
    },
  });

  const carIds = useMemo(() => (carsData?.cars || []).map((c) => c.id), [carsData]);

  const { data: imagesData } = useQuery({
    queryKey: ["car-images-batch", carIds],
    queryFn: async () => {
      if (carIds.length === 0) return {} as Record<string, CarImage[]>;
      const { data, error } = await supabase
        .from("car_images")
        .select("*")
        .in("car_id", carIds)
        .order("sort_order");
      if (error) throw error;
      const grouped: Record<string, CarImage[]> = {};
      for (const img of data as CarImage[]) {
        if (!grouped[img.car_id]) grouped[img.car_id] = [];
        grouped[img.car_id].push(img);
      }
      return grouped;
    },
    enabled: carIds.length > 0,
  });

  const totalPages = carsData ? Math.ceil(carsData.total / PAGE_SIZE) : 0;

  const updateSearch = (key: string, value: string | number | undefined) => {
    const next: Record<string, string | number | undefined> = { ...search, page: 1 };
    if (value === undefined || value === "" || value === 0) {
      delete next[key];
    } else {
      next[key] = value;
    }
    navigate({ search: next, replace: true });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-syarah-text antialiased" dir="rtl">
      <SiteHeader />
      <main>
        <div className="mx-auto max-w-[1152px] px-4 py-6">
          <h1 className="mb-6 text-[22px] font-bold text-syarah-text">السيارات المتاحة</h1>

          <div className="mb-6 flex flex-wrap gap-3">
            <select
              value={search.make_id || ""}
              onChange={(e) => updateSearch("make_id", e.target.value || undefined)}
              className="rounded-[6px] border border-syarah-border bg-white px-4 py-2.5 text-[13px] text-syarah-text outline-none focus:border-syarah-blue"
            >
              <option value="">جميع الماركات</option>
              {makes.map((m) => (
                <option key={m.id} value={m.id}>{m.name_ar}</option>
              ))}
            </select>

            <select
              value={search.condition || ""}
              onChange={(e) => updateSearch("condition", e.target.value || undefined)}
              className="rounded-[6px] border border-syarah-border bg-white px-4 py-2.5 text-[13px] text-syarah-text outline-none focus:border-syarah-blue"
            >
              <option value="">جميع الحالات</option>
              <option value="new">جديدة</option>
              <option value="used">مستعملة</option>
            </select>

            <select
              value={search.year || ""}
              onChange={(e) => updateSearch("year", e.target.value ? Number(e.target.value) : undefined)}
              className="rounded-[6px] border border-syarah-border bg-white px-4 py-2.5 text-[13px] text-syarah-text outline-none focus:border-syarah-blue"
            >
              <option value="">جميع السنوات</option>
              {Array.from({ length: 12 }, (_, i) => 2027 - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="الحد الأدنى للسعر"
              value={search.minPrice || ""}
              onChange={(e) => updateSearch("minPrice", e.target.value ? Number(e.target.value) : undefined)}
              className="w-[140px] rounded-[6px] border border-syarah-border bg-white px-4 py-2.5 text-[13px] text-syarah-text outline-none focus:border-syarah-blue"
            />
            <input
              type="number"
              placeholder="الحد الأقصى للسعر"
              value={search.maxPrice || ""}
              onChange={(e) => updateSearch("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
              className="w-[140px] rounded-[6px] border border-syarah-border bg-white px-4 py-2.5 text-[13px] text-syarah-text outline-none focus:border-syarah-blue"
            />
          </div>

          {carsLoading ? (
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          ) : carsData && carsData.cars.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-4">
                {carsData.cars.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    images={(imagesData?.[car.id] || []).map((img) => img.url)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => navigate({ search: { ...search, page: p }, replace: true })}
                      className={`flex h-9 w-9 items-center justify-center rounded-[6px] text-[13px] font-semibold transition ${
                        p === page
                          ? "bg-syarah-blue text-white"
                          : "border border-syarah-border text-syarah-text hover:border-syarah-blue"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-[16px] text-syarah-muted">
              لا توجد سيارات تطابق البحث
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
