import { Link } from "@tanstack/react-router";

const NAV_LINKS_1 = [
  { to: "/" as const, label: "الرئيسية" },
  { to: "/cars" as const, label: "السيارات" },
  { to: "/dealers" as const, label: "الوكلاء" },
  { to: "/auctions" as const, label: "المزادات" },
];

const NAV_LINKS_2 = [
  { to: "/inspections" as const, label: "الفحص الفني" },
  { to: "/finance" as const, label: "التمويل" },
  { to: "/insurance" as const, label: "التأمين" },
  { to: "/about" as const, label: "من نحن" },
];

export function AppFooter() {
  return (
    <footer className="bg-white border-t border-syarah-border">
      <div className="mx-auto max-w-[1200px] px-4 pt-10 pb-6">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center shrink-0">
            <span className="text-[22px] font-extrabold text-syarah-blue tracking-tight">
              KAM<span className="text-syarah-green">CAR</span>
            </span>
          </Link>
        </div>

        <nav className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-syarah-muted">
          {NAV_LINKS_1.map((link) => (
            <Link key={link.to} to={link.to} className="transition-colors hover:text-syarah-blue">
              {link.label}
            </Link>
          ))}
        </nav>
        <nav className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-syarah-muted">
          {NAV_LINKS_2.map((link) => (
            <Link key={link.to} to={link.to} className="transition-colors hover:text-syarah-blue">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-syarah-muted">تابعنا</span>
            {["facebook", "twitter", "instagram", "youtube"].map((social) => (
              <a
                key={social}
                href="#"
                aria-label={social}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-syarah-border text-syarah-muted transition-colors hover:border-syarah-blue hover:text-syarah-blue"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <hr className="my-6 border-syarah-border" />

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[12px] text-syarah-muted">
            <Link to="/about" className="hover:text-syarah-blue">الشروط والأحكام</Link>
            <span className="text-syarah-border">|</span>
            <Link to="/about" className="hover:text-syarah-blue">سياسة الخصوصية</Link>
          </div>
          <p className="text-[12px] text-syarah-muted">
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} KAM-CAR
          </p>
        </div>
      </div>
    </footer>
  );
}
