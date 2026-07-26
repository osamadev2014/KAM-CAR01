import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  assets,
  carDescription,
  carInfo,
  carTitle,
  featureGroups,
  galleryImages,
  recentCar,
  similarCars,
} from "../data/listing";
import { SiteHeader } from "../components/cardetail/SiteHeader";
import { SiteFooter } from "../components/cardetail/SiteFooter";
import { Gallery } from "../components/cardetail/Gallery";
import { SpecCard } from "../components/cardetail/SpecCard";
import { SimilarCarCard } from "../components/cardetail/SimilarCarCard";
import { Faq } from "../components/cardetail/Faq";
import { SarIcon } from "../components/cardetail/SarIcon";

const TITLE = "دونج فينج شاين E1 2026 للبيع - سيارة";
const DESCRIPTION =
  "دونج فينج شاين E1 2026 جديدة لون رمادي بسعر 44,275 ريال شامل الضريبة، وقسط شهري يبدأ من 885 ريال. احجزها الآن من سيارة.";
const OG_IMAGE = galleryImages[0];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
  }),
  component: CarDetail,
});

const BREADCRUMB = [
  ["الرئيسية", "https://syarah.com/"],
  ["سيارات و مركبات", "https://syarah.com/autos"],
  ["دونج فينج", "https://syarah.com/autos/dongfeng"],
  ["شاين", "https://syarah.com/autos/dongfeng/shine"],
  ["2026", "https://syarah.com/autos/dongfeng/shine/2026"],
];

const BNPL = [
  {
    logo: assets.amwal,
    alt: "amwal",
    text: "قسطها حتى 24 دفعة، متوافق مع الشريعة",
  },
  {
    logo: assets.tamara,
    alt: "tamara",
    text: "قسمها على 4 دفعات بدون رسوم تأخير، متوافق مع الشريعة",
  },
  {
    logo: assets.tabby,
    alt: "tabby",
    text: "ابتداءً من 3690 /شهر أو على 4 دفعات بدون فوائد",
  },
];

function CarDetail() {
  const [fav, setFav] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-syarah-text antialiased">
      <SiteHeader />

      <main>
        <div className="mx-auto max-w-[1152px] px-4">
          <nav aria-label="مسار التنقل" className="py-3">
            <ol className="flex flex-wrap items-center justify-start gap-x-1.5 text-[12px] text-syarah-muted">
              {BREADCRUMB.map(([label, href], i) => (
                <li key={label} className="flex items-center gap-x-1.5">
                  {i > 0 && <span className="text-syarah-border">/</span>}
                  <a href={href} className="transition-colors hover:text-syarah-blue">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="grid grid-cols-1 gap-x-5 pb-10 lg:grid-cols-[minmax(0,1fr)_326px] lg:grid-rows-[auto_1fr]">
            {/* Gallery (right in RTL on desktop, first on mobile) */}
            <div className="order-1 lg:col-start-1 lg:row-start-1">
              <Gallery images={galleryImages} title={carTitle} />
            </div>

            {/* Info column (left in RTL on desktop) */}
            <aside className="order-2 mt-5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0">

              <h1 className="text-[24px] font-bold leading-[1.5] text-syarah-text">{carTitle}</h1>

              <div className="mt-2 flex justify-start">
                <span className="rounded-[4px] bg-[#f4f4f4] px-3 py-[5px] text-[13px] text-syarah-text">
                  جديدة
                </span>
              </div>

              <hr className="my-4 border-syarah-border" />

              <div className="flex rounded-[6px] border border-syarah-border">
                <div className="flex-1 px-4 py-3">
                  <span className="text-[14px] text-syarah-muted">سعر الكاش</span>
                  <div className="mt-1.5 flex items-center justify-end gap-1.5 text-syarah-green">
                    <SarIcon className="h-[15px] w-[15px]" />
                    <span className="text-[26px] font-bold leading-none tabular-nums">44,275</span>
                  </div>
                </div>
                <div className="w-px bg-syarah-green/60" />
                <div className="flex-1 px-4 py-3">
                  <span className="text-[14px] text-syarah-muted">التقسيط</span>
                  <div className="mt-1.5 flex items-center justify-end gap-1.5 text-syarah-blue">
                    <span className="text-[13px]">/شهرياً</span>
                    <SarIcon className="h-[13px] w-[13px]" />
                    <span className="text-[26px] font-bold leading-none tabular-nums">885</span>
                  </div>
                  <a
                    href="https://syarah.com/site/finance-eligibility?post_id=309250&condition_id=1&reset_eligibility=true"
                    className="mt-2 flex items-center justify-between text-[13px] text-syarah-blue transition-opacity hover:opacity-80"
                  >
                    <span className="flex items-center gap-1.5">
                      <img src={assets.arithmetic} alt="" className="h-[15px] w-[15px]" />
                      احسب التمويل
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </a>
                </div>
              </div>

              <p className="mt-3 flex items-center justify-end gap-1.5 text-[12px] text-syarah-muted">
                السعر يشمل الضريبة المضافة
                <img src={assets.greyCheck} alt="" className="h-[14px] w-[14px]" />
              </p>

              <h2 className="mt-5 text-[16px] font-bold text-syarah-text">
                سوقها الآن، و ادفع لاحقًا !
              </h2>

              <div className="mt-3 flex flex-col gap-3">
                {BNPL.map((b) => (
                  <div
                    key={b.alt}
                    className="rounded-[8px] border border-syarah-border bg-[#fafafa] px-4 py-3"
                  >
                    <div className="flex justify-center">
                      <img src={b.logo} alt={b.alt} className="h-[26px] w-auto" loading="lazy" />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth="1.8" className="shrink-0">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <p className="flex-1 text-right text-[12px] leading-[1.9] text-syarah-text">
                        {b.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://syarah.com/site/finance-eligibility?post_id=309250&condition_id=1&reset_eligibility=true"
                className="mt-3 flex items-center justify-end gap-1.5 text-[13px] text-syarah-blue transition-opacity hover:opacity-80"
              >
                هل أنت مؤهل للتمويل؟
                <img src={assets.lightBlueArrow} alt="" className="h-[12px] w-[12px]" />
              </a>

              <button
                type="button"
                className="mt-4 w-full rounded-[6px] bg-syarah-green py-3.5 text-[16px] font-bold text-white transition-colors hover:bg-[#009345] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-syarah-green"
              >
                احجزها الآن
              </button>

              <a
                href="tel:920000089"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-[6px] border border-syarah-green bg-white py-3.5 text-[16px] font-bold text-syarah-green transition-colors hover:bg-syarah-green/5"
              >
                اتصل بنا للحجز
                <img src={assets.callGreen} alt="" className="h-[18px] w-[18px]" />
              </a>

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
                <button
                  type="button"
                  className="flex items-center gap-2 text-[14px] text-syarah-text transition-colors hover:text-syarah-blue"
                >
                  <img src={assets.share} alt="" className="h-[16px] w-[16px]" />
                  شارك الإعلان
                </button>
              </div>

              <div className="mt-4 border-t border-syarah-border pt-4">
                <p className="text-[14px] text-syarah-text">
                  رقم الإعلان: <strong className="font-bold">309250</strong>
                </p>
                <p className="mt-1 text-[12px] text-syarah-muted">
                  اذكر رقم الإعلان عند الاتصال مع خدمة العملاء
                </p>
              </div>
            </aside>

            {/* Specs column */}
            <div className="order-3 lg:col-start-1 lg:row-start-2">
              <h2 className="mt-6 mb-4 text-center text-[20px] font-bold text-syarah-blue">

                معلومات السيارة
              </h2>

              <div className="flex flex-col gap-3">
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

                <SpecCard title="تفاصيل السيارة">
                  <p className="px-5 py-4 text-[13px] leading-[2.1] text-syarah-text">
                    {carDescription}
                  </p>
                </SpecCard>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-[8px] border border-syarah-blue/40 bg-white px-4 py-3.5 text-[13px] text-syarah-text">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#00a94f" strokeWidth="1.8" className="shrink-0">
                    <path d="M12 2l8 4v6c0 5-3.4 9.2-8 10-4.6-.8-8-5-8-10V6z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                  <span>
                    <strong className="font-bold">الضمان:</strong> ضمان الوكالة 6 سنوات 200000 كم
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-[8px] border border-syarah-blue/40 bg-white px-4 py-3.5 text-[13px] text-syarah-text">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#00a94f" strokeWidth="1.8" className="shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M3 15h4l1.5-3h7L17 15h4" />
                  </svg>
                  <span>
                    <strong className="font-bold">الوكيل:</strong> التوكيلات. العالمية للسيارات
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar cars */}
        <section className="bg-syarah-section py-12">
          <div className="mx-auto max-w-[1152px] px-4">
            <h2 className="mb-8 text-center text-[26px] font-bold text-syarah-deep-blue">
              سيارات مشابهة
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-3">
              {similarCars.map((car, i) => (
                <SimilarCarCard key={`${car.href}-${i}`} car={car} />
              ))}
            </div>
          </div>
        </section>

        {/* Recently viewed */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-[1152px] px-4">
            <h2 className="mb-8 text-center text-[26px] font-bold text-syarah-deep-blue">
              سيارات شوهدت مؤخراً
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-3">
              <SimilarCarCard car={recentCar} />
            </div>
          </div>
        </section>

        <Faq />
      </main>

      <SiteFooter />

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-syarah-border bg-white px-4 py-3 lg:hidden">
        <a
          href="tel:920000089"
          className="flex flex-1 items-center justify-center gap-2 rounded-[6px] border border-syarah-green py-3 text-[15px] font-bold text-syarah-green transition-colors hover:bg-syarah-green/5"
        >
          اتصل بنا للحجز
          <img src={assets.callGreen} alt="" className="h-[17px] w-[17px]" />
        </a>
        <button
          type="button"
          className="flex-1 rounded-[6px] bg-syarah-green py-3 text-[15px] font-bold text-white transition-colors hover:bg-[#009345]"
        >
          احجزها الآن
        </button>
      </div>
      <div className="h-[72px] lg:hidden" />
    </div>
  );
}
