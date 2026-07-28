import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Car, Store, Gavel, ClipboardCheck, Wallet, Shield, X } from "lucide-react";
import type { Profile } from "../../lib/types";

interface MenuItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

interface Props {
  open: boolean;
  onClose: () => void;
  profile: Profile | null;
  authChecked: boolean;
  onLogout: () => void;
}

function MenuList({ items, onClose }: { items: MenuItem[]; onClose: () => void }) {
  return (
    <ul className="mx-5 flex flex-col">
      {items.map((it) => (
        <li key={it.to} className="h-[50px]">
          <Link
            to={it.to}
            onClick={onClose}
            className="group flex h-[50px] items-center gap-3 text-[14px] text-[#6c7a8d] transition-colors hover:text-syarah-blue"
          >
            <span className="relative h-[22px] w-[22px] shrink-0 text-[#6c7a8d] transition-colors group-hover:text-syarah-blue">
              {it.icon}
            </span>
            <span>{it.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function AppSideMenu({ open, onClose, profile, authChecked, onLogout }: Props) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const prevOpen = useRef(false);

  useEffect(() => {
    if (open && !prevOpen.current) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else if (!open && prevOpen.current) {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => { clearTimeout(timer); }
    }
    prevOpen.current = open;
  }, [open]);

  if (!mounted) return null;

  const BROWSE: MenuItem[] = [
    { label: "السيارات", to: "/cars", icon: <Car size={22} /> },
    { label: "الوكلاء", to: "/dealers", icon: <Store size={22} /> },
    { label: "المزادات", to: "/auctions", icon: <Gavel size={22} /> },
  ];

  const SERVICES: MenuItem[] = [
    { label: "الفحص الفني", to: "/inspections", icon: <ClipboardCheck size={22} /> },
    { label: "التمويل", to: "/finance", icon: <Wallet size={22} /> },
    { label: "التأمين", to: "/insurance", icon: <Shield size={22} /> },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/90 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`fixed inset-y-0 left-0 z-[61] w-[300px] overflow-y-auto bg-white transition-transform duration-300 ${visible ? 'translate-x-0' : '-translate-x-full'}`}>
        <header className="flex h-[61px] items-center justify-between px-[15px]">
          <Link to="/" className="flex items-center shrink-0" onClick={onClose}>
            <span className="text-[20px] font-extrabold text-syarah-blue tracking-tight">
              KAM<span className="text-syarah-green">CAR</span>
            </span>
          </Link>
          <button type="button" onClick={onClose} aria-label="إغلاق" className="p-1">
            <X size={18} className="text-[#6c7a8d]" />
          </button>
        </header>

        <div>
          <section className="flex h-[73px] items-center justify-between bg-[#f4f7fb] px-5">
            {authChecked && profile ? (
              <div className="flex items-center gap-2">
                {profile.role === "admin" && (
                  <button
                    type="button"
                    onClick={() => { onClose(); window.location.href = "/admin"; }}
                    className="flex h-[33px] items-center rounded-[4px] border border-syarah-blue px-3 text-[10px] font-bold text-syarah-blue transition-colors hover:bg-syarah-blue/5"
                  >
                    لوحة التحكم
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); onClose(); }}
                  className="flex h-[33px] items-center rounded-[4px] border border-red-200 px-3 text-[10px] font-bold text-red-500 transition-colors hover:bg-red-50"
                >
                  خروج
                </button>
              </div>
            ) : authChecked ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { onClose(); window.location.href = "/login"; }}
                  className="flex h-[33px] items-center rounded-[4px] border border-syarah-blue px-3 text-[10px] font-bold text-syarah-blue transition-colors hover:bg-syarah-blue/5"
                >
                  دخول
                </button>
                <button
                  type="button"
                  onClick={() => { onClose(); window.location.href = "/register"; }}
                  className="flex h-[33px] items-center rounded-[4px] bg-syarah-blue px-3 text-[10px] font-bold text-white transition-colors hover:bg-syarah-blue/90"
                >
                  حساب جديد
                </button>
              </div>
            ) : null}
          </section>

          <section className="pt-5">
            <strong className="block px-5 text-[16px] font-bold text-syarah-blue">تصفح</strong>
            <div className="mt-5">
              <MenuList items={BROWSE} onClose={onClose} />
            </div>
          </section>

          <div className="mx-[15px] h-px bg-[#cdd1d4]" />

          <section className="pt-5">
            <strong className="block px-5 text-[16px] font-bold text-syarah-blue">خدمات</strong>
            <div className="mt-5">
              <MenuList items={SERVICES} onClose={onClose} />
            </div>
          </section>

          <div className="mx-[15px] h-px bg-[#cdd1d4]" />

          <div className="px-5 pt-5">
            <strong className="flex items-center justify-end gap-2 text-[14px] font-normal text-[#00b362]">
              <span>طرق دفع إلكترونية آمنة</span>
            </strong>

            <ul className="mt-3 flex flex-wrap justify-end gap-2">
              {["Visa", "Mastercard", "Mada", "Apple Pay"].map((p) => (
                <li key={p}>
                  <span className="flex h-[34px] w-[52px] items-center justify-center rounded-[5px] border border-syarah-border text-[10px] font-semibold uppercase text-syarah-muted">
                    {p}
                  </span>
                </li>
              ))}
              <li>
                <span className="flex h-[34px] w-[52px] items-center justify-center rounded-[5px] border border-syarah-border text-[9px] font-semibold text-syarah-muted">
                  تحويل بنكي
                </span>
              </li>
            </ul>

            <div className="mt-5 flex flex-row-reverse justify-start gap-4 text-[12px] text-[#6c7a8d]">
              <Link to="/" onClick={onClose} className="hover:text-syarah-blue">
                الأحكام والشروط
              </Link>
              <span>|</span>
              <Link to="/" onClick={onClose} className="hover:text-syarah-blue">
                سياسة الخصوصية
              </Link>
            </div>

            <div className="mt-4 pb-5 text-right text-[12px] text-[#6c7a8d]">
              <span>جميع الحقوق محفوظة KAM-CAR</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
