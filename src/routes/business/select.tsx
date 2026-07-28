import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "../../components/cardetail/SiteHeader";
import { SiteFooter } from "../../components/cardetail/SiteFooter";

export const Route = createFileRoute("/business/select")({
  component: BusinessSelect,
});

function BusinessSelect() {
  return (
    <div className="min-h-screen bg-white font-sans text-syarah-text antialiased" dir="rtl">
      <SiteHeader />
      <main>
        <div className="mx-auto max-w-[800px] px-4 py-10">
          <h1 className="mb-2 text-[22px] font-bold text-syarah-text">اختر نوع حسابك</h1>
          <p className="mb-8 text-[14px] text-syarah-muted">
            اختر ما يناسبك للمتابعة
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/"
              className="group flex flex-col items-center gap-4 rounded-2xl border border-syarah-border bg-white p-8 text-center shadow-sm transition-all duration-200 hover:border-syarah-blue hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-syarah-section text-syarah-blue transition-colors group-hover:bg-syarah-blue group-hover:text-white">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18" r="2.5" />
                  <circle cx="18.5" cy="18" r="2.5" />
                </svg>
              </div>
              <div>
                <p className="text-[16px] font-bold text-syarah-text group-hover:text-syarah-blue">
                  شخصي
                </p>
                <p className="mt-1 text-[13px] text-syarah-muted">
                  بيع وشراء سياراتك بسهولة
                </p>
              </div>
            </Link>

            <div className="flex flex-col items-center gap-4 rounded-2xl border border-syarah-border bg-syarah-section/50 p-8 text-center opacity-60">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-syarah-section text-syarah-muted">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div>
                <p className="text-[16px] font-bold text-syarah-text">
                  تجاري / معرض
                </p>
                <p className="mt-1 text-[13px] text-syarah-muted">
                  قريباً — لإدارة معرضك ومخزونك
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
