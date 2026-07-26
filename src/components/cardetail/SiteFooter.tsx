const FOOTER_LINKS_1 = [
  ["الرئيسية", "https://syarah.com/"],
  ["من نحن", "https://syarah.com/site/about-us"],
  ["اتصل بنا", "https://syarah.com/site/contact-us"],
  ["دليل سيارة", "https://syarah.com/blog"],
  ["برنامج سيارة للتسويق بالعمولة", "https://syarah.com/affiliate"],
];

const FOOTER_LINKS_2 = [
  ["سيارة ترند", "https://syarah.com/trend"],
  ["أسعار السيارات", "https://syarah.com/car-prices"],
  ["مبيعات الشركات", "https://syarah.com/site/b2b"],
  ["الصفحات المساعدة", "https://syarah.com/sitemap"],
];

const ICONS = "https://cdn-frontend-r2.syarah.com/prod/assets/images";

const SOCIAL = [
  { label: "facebook", src: `${ICONS}/Facebook%20Icon.svg` },
  { label: "linkedin", src: `${ICONS}/linkedinIcon.svg` },
  { label: "x", src: `${ICONS}/twitterIcon.svg` },
  { label: "youtube", src: `${ICONS}/youtubeIcon.svg` },
  { label: "snapchat", src: `${ICONS}/snapchatIcon.svg` },
];

const PAYMENTS_ROW_1 = ["VISA", "mastercard", "Apple Pay", "تحويل بنكي"];


export function SiteFooter() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-[1200px] px-4 pt-10 pb-6">
        <div className="flex justify-center">
          <img
            src="https://cdn-frontend-r2.syarah.com/prod/assets/images/logoN.svg"
            alt="سيارة"
            className="h-[40px] w-auto"
          />
        </div>

        <nav className="mt-6 flex flex-wrap justify-end gap-x-8 gap-y-3 text-[13px] text-syarah-text">
          {FOOTER_LINKS_1.map(([label, href]) => (
            <a key={label} href={href} className="transition-colors hover:text-syarah-blue">
              {label}
            </a>
          ))}
        </nav>
        <nav className="mt-3 flex flex-wrap justify-end gap-x-8 gap-y-3 text-[13px] text-syarah-text">
          {FOOTER_LINKS_2.map(([label, href]) => (
            <a key={label} href={href} className="transition-colors hover:text-syarah-blue">
              {label}
            </a>
          ))}
        </nav>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <a
            href="https://maps.app.goo.gl/"
            className="flex items-center gap-2 rounded-full border border-syarah-border px-4 py-2 text-[13px] text-syarah-blue transition-colors hover:border-syarah-blue"
          >
            عنوان الشركة
            <img src={`${ICONS}/mdi_location.svg`} alt="" className="h-[15px] w-[15px]" />
          </a>
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href="https://syarah.com/"
              aria-label={s.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-syarah-border transition-colors hover:border-syarah-blue"
            >
              <img src={s.src} alt="" className="h-[15px] w-[15px]" />
            </a>
          ))}
        </div>


        <hr className="mt-6 border-syarah-border" />

        <div className="mt-4 text-left text-[12px] leading-[2.1] text-syarah-muted">
          <p>شركة سعوديه بسجل تجاري 1010538980 مصدره الرياض</p>
          <p>
            <a href="https://syarah.com/site/terms" className="hover:text-syarah-blue">الشروط والأحكام</a>
            {" | "}
            <a href="https://syarah.com/site/privacy" className="hover:text-syarah-blue">سياسة الخصوصية</a>
            {" | "}
            <a href="https://syarah.com/site/return-policy" className="hover:text-syarah-blue">سياسة الإرجاع</a>
          </p>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="rounded-[8px] border border-syarah-border p-3 md:order-2">
            <iframe
              title="خريطة موقع الشركة"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.0179846607275!2d46.8348856!3d24.7605725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2fab6abe210645%3A0xb6b6a73b3bdd70b6!2sSyarah%20Ltd.!5e0!3m2!1sen!2sjo!4v1700392307735!5m2!1sen!2sjo"
              loading="lazy"
              className="h-[160px] w-full rounded-[6px] border-0 bg-[#e9eef3]"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <p className="mt-3 flex items-start justify-end gap-2 text-right text-[13px] leading-[1.9] text-syarah-text">
              <span>
                حي النهضة، طريق خريص 13222 الرياض
                <br />
                المملكة العربية السعودية
              </span>
              <img
                src={`${ICONS}/location_on-24px@1Blue.svg`}
                alt=""
                className="mt-1 h-[16px] w-[16px] shrink-0"
              />
            </p>

          </div>

          <div className="md:order-1">
            <h3 className="text-[15px] font-bold text-syarah-green">طرق دفع إلكترونية آمنة</h3>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {PAYMENTS_ROW_1.map((p) => (
                <span
                  key={p}
                  className="flex h-[34px] w-[62px] items-center justify-center rounded-[5px] border border-syarah-border text-[10px] font-semibold uppercase text-syarah-muted"
                >
                  {p}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <img src="https://cdn-frontend-r2.syarah.com/prod/assets/images/bnpl_tabby_logo.png" alt="tabby" className="h-[26px] w-auto" />
              <img src="https://cdn-frontend-r2.syarah.com/prod/assets/images/bnpl_tamara_logo.png" alt="tamara" className="h-[26px] w-auto" />
              <img src="https://cdn-frontend-r2.syarah.com/prod/assets/images/bnpl_amwal_logo.png" alt="amwal" className="h-[26px] w-auto" />
              <span className="flex h-[30px] w-[58px] items-center justify-center rounded-[5px] border border-syarah-border text-[10px] font-semibold text-syarah-muted">
                mada
              </span>
              <span className="flex h-[30px] w-[58px] items-center justify-center rounded-[5px] border border-syarah-border text-[10px] font-semibold text-syarah-muted">
                سداد
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 overflow-hidden rounded-[8px] bg-[#2226c4] px-6 py-6 text-white md:flex-row-reverse">
          <p className="text-center text-[17px] font-bold md:text-right">
            حمل التطبيق الان لتجربة أذكى لبيع وشراء السيارات بالمملكة
          </p>
          <div className="flex gap-3">
            <a
              href="https://apps.apple.com/"
              aria-label="App Store"
              className="transition-opacity hover:opacity-85"
            >
              <img src={`${ICONS}/about-us/store-ios.svg`} alt="App Store" className="h-[44px] w-auto" />
            </a>
            <a
              href="https://play.google.com/"
              aria-label="Google Play"
              className="transition-opacity hover:opacity-85"
            >
              <img src={`${ICONS}/about-us/store-android.svg`} alt="Google Play" className="h-[44px] w-auto" />
            </a>
          </div>
        </div>


        <p className="mt-5 text-center text-[12px] text-syarah-muted">
          جميع الحقوق محفوظة لشركة موقع سيارة المحدودة © 2026
        </p>
      </div>
    </footer>
  );
}
