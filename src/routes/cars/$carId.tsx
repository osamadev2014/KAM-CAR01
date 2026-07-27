import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createClient } from "../../lib/supabase";
import type { Car, CarImage, CarMake, CarModel } from "../../lib/types";
import { SiteHeader } from "../../components/cardetail/SiteHeader";
import { SiteFooter } from "../../components/cardetail/SiteFooter";
import { Gallery } from "../../components/cardetail/Gallery";
import { SpecCard } from "../../components/cardetail/SpecCard";
import { SimilarCarCard } from "../../components/cardetail/SimilarCarCard";
import { Faq } from "../../components/cardetail/Faq";
import { SarIcon } from "../../components/cardetail/SarIcon";

export const Route = createFileRoute("/cars/$carId")({
  component: CarDetailPage,
});

function CarDetailPage() {
  const { carId } = Route.useParams();
  const [fav, setFav] = useState(false);
  const supabase = createClient();

  const { data: car, isLoading: carLoading } = useQuery({
    queryKey: ["car", carId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", carId)
        .single();
      if (error) throw error;
      return data as Car;
    },
  });

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

  const { data: models = [] } = useQuery({
    queryKey: ["car_models", car?.make_id],
    queryFn: async () => {
      if (!car?.make_id) return [];
      const { data, error } = await supabase
        .from("car_models")
        .select("*")
        .eq("make_id", car.make_id)
        .order("name_ar");
      if (error) throw error;
      return data as CarModel[];
    },
    enabled: !!car?.make_id,
  });

  const { data: images = [] } = useQuery({
    queryKey: ["car-images", carId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_images")
        .select("*")
        .eq("car_id", carId)
        .order("sort_order");
      if (error) throw error;
      return data as CarImage[];
    },
    enabled: !!carId,
  });

  const { data: similarCars = [] } = useQuery({
    queryKey: ["similar-cars", carId, car?.make_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("status", "published")
        .eq("make_id", car!.make_id)
        .neq("id", carId)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data as Car[];
    },
    enabled: !!car,
  });

  const { data: recentCars = [] } = useQuery({
    queryKey: ["recent-cars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data as Car[];
    },
  });

  if (carLoading) {
    return (
      <div className="min-h-screen bg-white" dir="rtl">
        <SiteHeader />
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-syarah-border border-t-syarah-blue" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-white" dir="rtl">
        <SiteHeader />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h1 className="text-[28px] font-bold text-syarah-text">السيارة غير موجودة</h1>
          <p className="mt-2 text-[14px] text-syarah-muted">
            يبدو أن هذه السيارة لم تعد متاحة أو أن الرابط غير صحيح.
          </p>
          <Link
            to="/cars"
            className="mt-6 rounded-[6px] bg-syarah-blue px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-syarah-deep-blue"
          >
            تصفح السيارات
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const makeName = makes.find((m) => m.id === car.make_id)?.name_ar || "";
  const modelName = models.find((m) => m.id === car.model_id)?.name_ar || "";

  const galleryUrls = images.map((img) => img.url);
  const fmt = (n: number) => n.toLocaleString("en");

  const featureGroups = Object.entries(car.features || {}).map(([title, items]) => ({
    title,
    items: items as string[],
  }));

  const specIcon = (n: string) => `https://cdn.syarah.com/syarah/bundles/post_details/${n}.svg`;

  const warrantyText = (() => {
    const years = car.warranty_years ?? 0;
    const km = car.warranty_km;
    const unlimited = car.warranty_unlimited_km;
    if (years === 0 && !km && !unlimited) return null;
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} سنوات`);
    if (unlimited) parts.push("غير محدود الكيلومتر");
    else if (km) parts.push(`${km.toLocaleString("en")} كم`);
    return parts.join(" أو ") || null;
  })();

  const carInfo: { icon: string; label: string; value: string }[] = [
    { icon: specIcon("car_make"), label: "الماركة", value: makeName },
    { icon: specIcon("car_model"), label: "الموديل", value: modelName },
    { icon: specIcon("car_year"), label: "الموديل", value: String(car.year) },
    ...(car.trim ? [{ icon: "https://cdn.syarah.com/syarah/bundles/Extention.svg", label: "الفئة", value: car.trim }] : []),
    ...(car.exterior_color ? [{ icon: specIcon("ext_color"), label: "اللون الخارجي", value: car.exterior_color }] : []),
    ...(car.interior_color ? [{ icon: specIcon("int_color"), label: "اللون الداخلي", value: car.interior_color }] : []),
    ...(car.origin ? [{ icon: specIcon("car_origin"), label: "الوارد", value: car.origin }] : []),
    ...(car.fuel_type ? [{ icon: specIcon("fuel_type"), label: "نوع الوقود", value: car.fuel_type }] : []),
    ...(car.transmission ? [{ icon: "https://cdn.syarah.com/syarah/bundles/Gear.svg", label: "نوع القير", value: car.transmission }] : []),
    ...(car.gear_count ? [{ icon: specIcon("gear_speed"), label: "سرعات القير", value: String(car.gear_count) }] : []),
    ...(car.cylinders ? [{ icon: specIcon("cylinder"), label: "عدد السلندرات", value: `${car.cylinders} سيليندر` }] : []),
    { icon: specIcon("car_status"), label: "الحالة", value: car.condition === "new" ? "جديدة" : "مستعملة" },
    ...(car.engine_size ? [{ icon: "https://cdn.syarah.com/syarah/bundles/engine_size.svg", label: "حجم المحرك", value: String(car.engine_size) }] : []),
    ...(car.drivetrain ? [{ icon: specIcon("car_drivetrain"), label: "نوع الدفع", value: car.drivetrain }] : []),
    ...(car.keys_count ? [{ icon: specIcon("car_key"), label: "عدد مفاتيح السيارة", value: String(car.keys_count) }] : []),
    ...(car.seats_count ? [{ icon: specIcon("car_seats"), label: "عدد المقاعد", value: String(car.seats_count) }] : []),
    ...(car.engine_type ? [{ icon: specIcon("car_engine_type"), label: "نوع المحرك", value: car.engine_type }] : []),
    ...(car.fuel_tank_liters ? [{ icon: specIcon("fuel_tank"), label: "سعة خزان الوقود", value: `${car.fuel_tank_liters} لتر` }] : []),
    ...(car.horsepower ? [{ icon: specIcon("car_horse_power"), label: "القدرة بالحصان", value: `${car.horsepower} حصان` }] : []),
    ...(car.fuel_consumption_km_l ? [{ icon: "https://cdn-frontend-r2.syarah.com/prod/assets/images/local_gas_station.svg", label: "استهلاك الوقود", value: `${car.fuel_consumption_km_l} (كم/لتر)` }] : []),
  ];

  const similarForDisplay = similarCars.map((c) => ({
    title: c.title,
    cash: fmt(c.price_cash),
    installment: c.price_installment_month != null ? fmt(c.price_installment_month) : "0",
    images: [] as string[],
    href: `/cars/${c.id}`,
    bnpl: false,
  }));

  const recentForDisplay = recentCars.filter((c) => c.id !== car.id).slice(0, 1).map((c) => ({
    title: c.title,
    cash: fmt(c.price_cash),
    installment: c.price_installment_month != null ? fmt(c.price_installment_month) : "0",
    images: [] as string[],
    href: `/cars/${c.id}`,
    ribbon: undefined as string | undefined,
    bnpl: false,
  }));

  return (
    <div className="min-h-screen bg-white font-sans text-syarah-text antialiased" dir="rtl">
      <SiteHeader />

      <main>
        <div className="mx-auto max-w-[1152px] px-4">
          <nav aria-label="مسار التنقل" className="py-3">
            <ol className="flex flex-wrap items-center justify-start gap-x-1.5 text-[12px] text-syarah-muted">
              <li className="flex items-center gap-x-1.5">
                <a href="/cars" className="transition-colors hover:text-syarah-blue">
                  السيارات
                </a>
              </li>
              <li className="flex items-center gap-x-1.5">
                <span className="text-syarah-border">/</span>
                <span>{car.title}</span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 gap-x-5 pb-10 lg:grid-cols-[minmax(0,1fr)_326px] lg:grid-rows-[auto_1fr]">
            <div className="order-1 lg:col-start-1 lg:row-start-1">
              {galleryUrls.length > 0 ? (
                <Gallery images={galleryUrls} title={car.title} />
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center rounded-[8px] bg-[#f3f3f3] text-[14px] text-syarah-muted">
                  لا توجد صور
                </div>
              )}
            </div>

            <aside className="order-2 mt-5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0">
              <h1 className="text-[24px] font-bold leading-[1.5] text-syarah-text">{car.title}</h1>

              <div className="mt-2 flex justify-start">
                <span className="rounded-[4px] bg-[#f4f4f4] px-3 py-[5px] text-[13px] text-syarah-text">
                  {car.condition === "new" ? "جديدة" : "مستعملة"}
                </span>
              </div>

              <hr className="my-4 border-syarah-border" />

              <div className="flex rounded-[6px] border border-syarah-border">
                <div className="flex-1 px-4 py-3">
                  <span className="text-[14px] text-syarah-muted">سعر الكاش</span>
                  <div className="mt-1.5 flex items-center justify-end gap-1.5 text-syarah-green">
                    <SarIcon className="h-[15px] w-[15px]" />
                    <span className="text-[26px] font-bold leading-none tabular-nums">{fmt(car.price_cash)}</span>
                  </div>
                </div>
                {car.price_installment_month != null && (
                  <>
                    <div className="w-px bg-syarah-green/60" />
                    <div className="flex-1 px-4 py-3">
                      <span className="text-[14px] text-syarah-muted">التقسيط</span>
                      <div className="mt-1.5 flex items-center justify-end gap-1.5 text-syarah-blue">
                        <span className="text-[13px]">/شهرياً</span>
                        <SarIcon className="h-[13px] w-[13px]" />
                        <span className="text-[26px] font-bold leading-none tabular-nums">{fmt(car.price_installment_month)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <p className="mt-3 flex items-center justify-end gap-1.5 text-[12px] text-syarah-muted">
                السعر يشمل الضريبة المضافة
              </p>

              {warrantyText && (
                <div className="mt-4 flex items-center gap-2 rounded-[8px] border border-syarah-blue/40 bg-white px-4 py-3.5 text-[13px] text-syarah-text">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#00a94f" strokeWidth="1.8" className="shrink-0">
                    <path d="M12 2l8 4v6c0 5-3.4 9.2-8 10-4.6-.8-8-5-8-10V6z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                  <span>
                    <strong className="font-bold">الضمان:</strong> {warrantyText}
                  </span>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-syarah-border pt-4">
                <button
                  type="button"
                  onClick={() => setFav((v) => !v)}
                  aria-pressed={fav}
                  className="flex items-center gap-2 text-[14px] text-syarah-text transition-colors hover:text-syarah-blue"
                >
                  أضف إلى المفضلة
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={fav ? "#2c5fb5" : "none"} stroke="#2c5fb5" strokeWidth="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {car.ad_number && (
                <div className="mt-4 border-t border-syarah-border pt-4">
                  <p className="text-[14px] text-syarah-text">
                    رقم الإعلان: <strong className="font-bold">{car.ad_number}</strong>
                  </p>
                </div>
              )}
            </aside>

            <div className="order-3 lg:col-start-1 lg:row-start-2">
              <h2 className="mt-6 mb-4 text-center text-[20px] font-bold text-syarah-blue">
                معلومات السيارة
              </h2>

              <div className="flex flex-col gap-3">
                {carInfo.length > 0 && (
                  <SpecCard title="معلومات السيارة" defaultOpen>
                    <dl className="grid grid-cols-1 sm:grid-cols-2">
                      {carInfo.map((row, i) => (
                        <div
                          key={row.label}
                          className={`flex items-center gap-2.5 border-syarah-border px-5 py-3 ${
                            i % 2 === 0 ? "sm:border-l" : ""
                          } ${i < carInfo.length - (carInfo.length % 2 === 0 ? 2 : 1) ? "border-b" : ""}`}
                        >
                          <img src={row.icon} alt="" loading="lazy" className="h-[19px] w-[19px] shrink-0" />
                          <dt className="text-[13px] text-syarah-muted">{row.label}:</dt>
                          <dd className="text-[13px] font-semibold text-syarah-text">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </SpecCard>
                )}

                {featureGroups.map((g) => (
                  <SpecCard key={g.title} title={g.title}>
                    <ul className="flex flex-wrap gap-x-6 gap-y-3 px-5 py-4">
                      {g.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-[13px] text-syarah-text">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00a94f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </SpecCard>
                ))}

                {car.description && (
                  <SpecCard title="تفاصيل السيارة">
                    <p className="px-5 py-4 text-[13px] leading-[2.1] text-syarah-text">
                      {car.description}
                    </p>
                  </SpecCard>
                )}
              </div>
            </div>
          </div>
        </div>

        {similarForDisplay.length > 0 && (
          <section className="bg-syarah-section py-12">
            <div className="mx-auto max-w-[1152px] px-4">
              <h2 className="mb-8 text-center text-[26px] font-bold text-syarah-deep-blue">
                سيارات مشابهة
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-3">
                {similarForDisplay.map((c, i) => (
                  <SimilarCarCard key={`${c.href}-${i}`} car={c} />
                ))}
              </div>
            </div>
          </section>
        )}

        {recentForDisplay.length > 0 && (
          <section className="bg-white py-12">
            <div className="mx-auto max-w-[1152px] px-4">
              <h2 className="mb-8 text-center text-[26px] font-bold text-syarah-deep-blue">
                سيارات شوهدت مؤخراً
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-3">
                {recentForDisplay.map((c, i) => (
                  <SimilarCarCard key={`${c.href}-${i}`} car={c} />
                ))}
              </div>
            </div>
          </section>
        )}

        <Faq />
      </main>

      <SiteFooter />
    </div>
  );
}
