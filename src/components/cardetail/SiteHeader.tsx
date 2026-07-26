import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-4">
        <a href="https://syarah.com/" aria-label="سيارة">
          <img
            src="https://cdn-frontend-r2.syarah.com/prod/assets/images/logoN.svg"
            alt="سيارة"
            className="h-[38px] w-auto"
          />
        </a>
        <button
          type="button"
          aria-label="القائمة"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-slate-50"
        >
          <img
            src="https://cdn-frontend-r2.syarah.com/prod/assets/images/menuToggle.svg"
            alt=""
            className="h-[22px] w-[24px]"
          />
        </button>
      </div>
      {open && (
        <nav className="border-t border-syarah-border bg-white">
          <ul className="mx-auto flex max-w-[1200px] flex-col px-4 py-2 text-[14px] text-syarah-text">
            {[
              ["الرئيسية", "https://syarah.com/"],
              ["من نحن", "https://syarah.com/site/about-us"],
              ["اتصل بنا", "https://syarah.com/site/contact-us"],
              ["دليل سيارة", "https://syarah.com/blog"],
              ["أسعار السيارات", "https://syarah.com/car-prices"],
            ].map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  className="block py-2 transition-colors hover:text-syarah-blue"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
