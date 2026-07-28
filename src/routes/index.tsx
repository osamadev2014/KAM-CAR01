import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../lib/supabase";
import { AppHeader } from "../components/layout/AppHeader";
import { AppFooter } from "../components/layout/AppFooter";
import { SarIcon } from "../components/cardetail/SarIcon";
import type { Car, CarImage, CarMake } from "../lib/types";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const CATEGORY_CARDS = [
  { title: "سيارات مستعملة", desc: "مضمونة ومفحوصة", href: "/cars", icon: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" },
  { title: "سيارات جديدة", desc: "ضمان الوكالة", href: "/cars?condition=new", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
  { title: "بيع سيارتك", desc: "اعرض سيارتك للبيع", href: "/admin/cars/new", icon: "M12 4v16m8-8H4" },
  { title: "الفحص الفني", desc: "فحص شامل واحترافي", href: "/inspections", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
];

const WHY_US_ITEMS = [
  { title: "فحص 200 نقطة", desc: "فحص شامل من خبراء معتمدين لضمان جودة السيارة", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title: "ضمان شامل", desc: "ضمان يصل إلى 3 سنوات ضد العيوب الميكانيكية", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title: "توصيل لباب بيتك", desc: "نوصل السيارة لأي مكان في المملكة", icon: "M8 17a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zM2 5a2 2 0 012-2h12l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" },
  { title: "خيارات تمويل متنوعة", desc: "نقدم حلول تمويل مناسبة لكل الميزانيات", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "تصفح السيارات", desc: "اختر من مئات السيارات المعروضة بالمواصفات التي تناسبك" },
  { step: "02", title: "احجز بضغطة زر", desc: "احجز سيارتك إلكترونياً أو تواصل مع فريق المبيعات" },
  { step: "03", title: "ادفع بأمان", desc: "اختر طريقة الدفع المناسبة: كاش أو تمويل أو تقسيط" },
  { step: "04", title: "توصلك لين عندك", desc: "نوصل السيارة لأي عنوان في المملكة العربية السعودية" },
];

const FAQ_ITEMS = [
  { q: "كيف أشتري سيارة من KAM-CAR؟", a: "تصفح السيارات المتاحة، اختر السيارة المناسبة، ثم تواصل مع فريق المبيعات لإتمام عملية الشراء. يمكنك الدفع نقداً أو عبر تمويل بنكي." },
  { q: "هل السيارات مفحوصة؟", a: "نعم، جميع السيارات المنشورة على المنصة تخضع لفحص شامل يشمل أكثر من 200 نقطة فحص فني وميكانيكي." },
  { q: "ما هي طرق الدفع المتاحة؟", a: "نقبل الدفع النقدي، التحويل البنكي، والتقسيط عبر شركات التمويل المعتمدة." },
  { q: "هل يمكنني بيع سيارتي عبر المنصة؟", a: "نعم، يمكنك إضافة سيارتك للبيع من خلال لوحة التحكم. أضف الصور والمواصفات وحدد السعر المناسب." },
];

function HomePage() {
  const navigate = useNavigate();
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllMakes, setShowAllMakes] = useState(false);

  const { data: makes = [] } = useQuery({
    queryKey: ["car_makes_home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_makes")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as CarMake[];
    },
  });

  const { data: featuredCars = [], isLoading: featuredLoading } = useQuery({
    queryKey: ["featured_cars_home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data as Car[];
    },
  });

  const carIds = featuredCars.map((c) => c.id);

  const { data: imagesMap = {} } = useQuery({
    queryKey: ["featured_images_home", carIds],
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

  const { data: makeNames = {} } = useQuery({
    queryKey: ["make_names_home", [...new Set(featuredCars.map((c) => c.make_id))]],
    queryFn: async () => {
      const ids = [...new Set(featuredCars.map((c) => c.make_id))];
      if (ids.length === 0) return {} as Record<string, string>;
      const { data, error } = await supabase
        .from("car_makes")
        .select("id, name_ar")
        .in("id", ids);
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const m of data as { id: string; name_ar: string }[]) {
        map[m.id] = m.name_ar;
      }
      return map;
    },
    enabled: featuredCars.length > 0,
  });

  const { data: modelNames = {} } = useQuery({
    queryKey: ["model_names_home", [...new Set(featuredCars.map((c) => c.model_id))]],
    queryFn: async () => {
      const ids = [...new Set(featuredCars.map((c) => c.model_id))];
      if (ids.length === 0) return {} as Record<string, string>;
      const { data, error } = await supabase
        .from("car_models")
        .select("id, name_ar")
        .in("id", ids);
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const m of data as { id: string; name_ar: string }[]) {
        map[m.id] = m.name_ar;
      }
      return map;
    },
    enabled: featuredCars.length > 0,
  });

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (q) {
      navigate({ to: "/cars", search: { page: 1 } });
    } else {
      navigate({ to: "/cars" });
    }
  };

  const fmt = (n: number) => n.toLocaleString("en");
  const visibleMakes = showAllMakes ? makes : makes.slice(0, 12);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <AppHeader />

      <main className="flex-1">
        {/* ===== 1. HERO BANNER ===== */}
        <section className="relative overflow-hidden bg-gradient-to-l from-syarah-blue to-syarah-deep-blue">
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:py-20 md:py-28">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                اكتشف سيارتك المثالية
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/80">
                آلاف السيارات المستعملة الجديدة بفحص شامل وضمان شامل
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/cars"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[14px] font-bold text-syarah-blue transition-colors hover:bg-white/90"
                >
                  تصفح السيارات
                </Link>
                <Link
                  to="/admin/cars/new"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-6 py-3 text-[14px] font-bold text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  بيع سيارتك
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 hidden h-full w-1/2 md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-syarah-blue/30" />
          </div>
        </section>

        {/* ===== 2. SEARCH BAR + CATEGORY CARDS ===== */}
        <section className="relative z-20 -mt-10 px-4 sm:-mt-14">
          <div className="mx-auto max-w-[960px]">
            <div className="rounded-2xl border border-syarah-border bg-white p-4 shadow-lg sm:p-6">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="ابحث عن الماركة أو الموديل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-12 w-full rounded-xl border border-syarah-border bg-syarah-section pr-12 pl-4 text-[14px] text-syarah-text placeholder-syarah-muted outline-none transition-colors focus:border-syarah-blue focus:ring-2 focus:ring-syarah-blue/20"
                />
                <svg className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-syarah-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {CATEGORY_CARDS.map((card) => (
                  <a
                    key={card.title}
                    href={card.href}
                    className="flex flex-col items-center gap-2 rounded-xl border border-syarah-border bg-syarah-section/50 p-4 text-center transition-all duration-200 hover:border-syarah-blue/30 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-syarah-blue/10 text-syarah-blue">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={card.icon} />
                      </svg>
                    </div>
                    <span className="text-[13px] font-bold text-syarah-text">{card.title}</span>
                    <span className="text-[11px] text-syarah-muted">{card.desc}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 3. BROWSE BY MAKE ===== */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-[1200px] px-4">
            <h2 className="mb-6 text-center text-xl font-bold text-syarah-text sm:text-2xl">
              تصفح حسب الماركة
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {visibleMakes.map((make) => (
                <a
                  key={make.id}
                  href={`/cars?make_id=${make.id}`}
                  className="flex items-center gap-2 rounded-xl border border-syarah-border bg-white px-4 py-3 transition-all duration-200 hover:border-syarah-blue/40 hover:shadow-md"
                >
                  {make.logo_path ? (
                    <img src={make.logo_path} alt={make.name_ar} className="h-6 w-6 object-contain" loading="lazy" />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-syarah-section text-[10px] font-bold text-syarah-blue">
                      {make.name_ar.charAt(0)}
                    </div>
                  )}
                  <span className="text-[13px] font-medium text-syarah-text">{make.name_ar}</span>
                </a>
              ))}
            </div>
            {makes.length > 12 && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllMakes((v) => !v)}
                  className="text-[13px] font-semibold text-syarah-blue transition-colors hover:text-syarah-deep-blue"
                >
                  {showAllMakes ? "عرض أقل" : `عرض جميع الماركات (${makes.length})`}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ===== 4. FEATURED CARS ===== */}
        <section className="bg-syarah-section py-10 sm:py-14">
          <div className="mx-auto max-w-[1200px] px-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-syarah-text sm:text-2xl">سيارات مميزة</h2>
              <Link to="/cars" className="text-[13px] font-semibold text-syarah-blue transition-colors hover:text-syarah-deep-blue">
                عرض الكل ←
              </Link>
            </div>

            {featuredLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl border border-syarah-border bg-white">
                    <div className="aspect-[16/10] bg-syarah-section" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 w-3/4 rounded bg-syarah-section" />
                      <div className="h-3 w-1/2 rounded bg-syarah-section" />
                      <div className="h-3 w-2/3 rounded bg-syarah-section" />
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredCars.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {featuredCars.map((car) => {
                  const images = imagesMap[car.id] || [];
                  const primary = images[0]?.url;
                  const makeName = makeNames[car.make_id] || "";
                  const modelName = modelNames[car.model_id] || "";

                  return (
                    <a
                      key={car.id}
                      href={`/cars/${car.id}`}
                      className="group overflow-hidden rounded-2xl border border-syarah-border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-syarah-section">
                        {primary ? (
                          <img
                            src={primary}
                            alt={car.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-syarah-muted">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                              <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1h2" />
                              <path d="M20 16V8h-4" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className="rounded-full bg-syarah-blue/90 px-2.5 py-1 text-[10px] font-bold text-white">
                            {car.condition === "new" ? "جديدة" : "مستعملة"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-[14px] font-bold text-syarah-text leading-tight group-hover:text-syarah-blue transition-colors">
                          {car.title}
                        </h3>
                        <p className="mt-1 text-[12px] text-syarah-muted">
                          {makeName} {modelName} {car.year}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-syarah-green">
                            <SarIcon className="h-3.5 w-3.5" />
                            <span className="text-[16px] font-bold tabular-nums">{fmt(car.price_cash)}</span>
                          </div>
                          {car.price_installment_month != null && (
                            <span className="text-[11px] text-syarah-blue font-medium">
                              قسط {fmt(car.price_installment_month)}/شهرياً
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-syarah-muted">
                          <span>{car.year}</span>
                          {car.fuel_type && <><span>·</span><span>{car.fuel_type}</span></>}
                          {car.transmission && <><span>·</span><span>{car.transmission}</span></>}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-[15px] text-syarah-muted">
                لا توجد سيارات متاحة حالياً
              </div>
            )}
          </div>
        </section>

        {/* ===== 5. WHY CHOOSE US ===== */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-[1200px] px-4">
            <h2 className="mb-8 text-center text-xl font-bold text-syarah-text sm:text-2xl">
              لماذا KAM-CAR؟
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {WHY_US_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-syarah-border bg-white p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-7"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-syarah-blue/10 text-syarah-blue sm:h-14 sm:w-14">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="text-[13px] font-bold text-syarah-text sm:text-[15px]">{item.title}</h3>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-syarah-muted sm:text-[13px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 6. HOW IT WORKS ===== */}
        <section className="bg-syarah-section py-10 sm:py-14">
          <div className="mx-auto max-w-[1200px] px-4">
            <h2 className="mb-8 text-center text-xl font-bold text-syarah-text sm:text-2xl">
              كيف تشتري سيارتك؟
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-syarah-blue text-[18px] font-bold text-white sm:h-14 sm:w-14 sm:text-[20px]">
                    {item.step}
                  </div>
                  <h3 className="text-[13px] font-bold text-syarah-text sm:text-[15px]">{item.title}</h3>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-syarah-muted sm:text-[13px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 7. FAQ ===== */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="mb-8 text-center text-xl font-bold text-syarah-text sm:text-2xl">
              أسئلة متكررة
            </h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-syarah-border bg-white transition-all duration-200 hover:border-syarah-border"
                  open={i === 0}
                >
                  <summary className="flex cursor-pointer items-center justify-between p-4 sm:p-5 list-none">
                    <span className="text-[13px] font-medium text-syarah-text sm:text-[15px]">{faq.q}</span>
                    <svg
                      className="h-5 w-5 shrink-0 text-syarah-muted transition-transform duration-300 group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="border-t border-syarah-border px-4 pb-4 pt-3 text-[12px] leading-relaxed text-syarah-muted sm:px-5 sm:pb-5 sm:pt-4 sm:text-[14px]">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 8. FINAL CTA ===== */}
        <section className="bg-[#1a1a1a] py-12 sm:py-16">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-syarah-blue/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2c5fb5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1h2" />
                <path d="M20 16V8h-4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white sm:text-3xl">جاهز تشتري سيارتك؟</h2>
            <p className="mt-3 text-[13px] text-white/60 sm:text-base">
              انضم إلى آلاف العملاء الذين وثقوا في KAM-CAR لشراء سياراتهم
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/cars"
                className="inline-flex items-center justify-center rounded-full bg-syarah-blue px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-syarah-deep-blue sm:px-8 sm:py-3.5"
              >
                ابدأ البحث الآن
              </Link>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/20 px-6 py-3 text-[14px] font-bold text-white transition-colors hover:border-white/40 hover:bg-white/5 sm:px-8 sm:py-3.5"
              >
                تواصل معنا
              </a>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
