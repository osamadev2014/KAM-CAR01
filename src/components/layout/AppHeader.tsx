import { useState } from "react";
import { Link } from "@tanstack/react-router";

const NAV_LINKS = [
  { to: "/cars" as const, label: "السيارات" },
  { to: "/dealers" as const, label: "الوكلاء" },
  { to: "/auctions" as const, label: "المزادات" },
  { to: "/inspect" as const, label: "الفحص الفني" },
  { to: "/finance" as const, label: "التمويل والتأمين" },
];

export function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-syarah-border/60 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center shrink-0">
            <span className="text-[20px] font-extrabold text-syarah-blue tracking-tight">
              KAM<span className="text-syarah-green">CAR</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 text-[13px] font-medium rounded-xl text-syarah-muted transition-all duration-150 hover:bg-syarah-section hover:text-syarah-text"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/cars/new"
            className="hidden sm:inline-flex items-center justify-center rounded-xl bg-syarah-green px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#009345]"
          >
            بيع سيارتك
          </Link>

          <Link
            to="/login"
            className="hidden sm:inline-flex items-center justify-center rounded-xl border border-syarah-border bg-white px-4 py-2 text-[13px] font-semibold text-syarah-text transition-colors hover:border-syarah-blue hover:text-syarah-blue"
          >
            دخول / حسابي
          </Link>

          <button
            type="button"
            aria-label="القائمة"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-syarah-section"
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-syarah-border bg-white">
          <ul className="mx-auto max-w-[1200px] px-4 py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-[14px] font-medium text-syarah-text transition-colors hover:text-syarah-blue border-b border-syarah-border/50 last:border-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 flex flex-col gap-2">
              <Link
                to="/admin/cars/new"
                onClick={() => setMobileOpen(false)}
                className="block text-center rounded-xl bg-syarah-green px-4 py-3 text-[14px] font-bold text-white"
              >
                بيع سيارتك
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center rounded-xl border border-syarah-border px-4 py-3 text-[14px] font-semibold text-syarah-text"
              >
                دخول / حسابي
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

const BOTTOM_NAV_ITEMS = [
  { to: "/" as const, label: "الرئيسية", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { to: "/cars" as const, label: "تصفح", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { to: "/admin/cars/new" as const, label: "بيع", icon: "M12 4v16m8-8H4", premium: true },
  { to: "/favorites" as const, label: "المفضلة", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { to: "/login" as const, label: "حسابي", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-syarah-border bg-white/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          if (item.premium) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center gap-0.5"
              >
                <div className="h-11 w-11 rounded-xl bg-syarah-blue flex items-center justify-center shadow-md">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                <span className="text-[10px] font-medium text-syarah-muted">{item.label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 text-syarah-muted"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
