import { useState } from "react";
import { Link } from "@tanstack/react-router";

interface SidebarSection {
  title: string;
  items: { label: string; href: string; icon?: string }[];
}

interface DashboardShellProps {
  children: React.ReactNode;
  sections?: SidebarSection[];
  title?: string;
}

const DEFAULT_SECTIONS: SidebarSection[] = [
  {
    title: "القائمة",
    items: [
      { label: "لوحة التحكم", href: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
      { label: "إضافة سيارة", href: "/admin/cars/new", icon: "M12 4v16m8-8H4" },
    ],
  },
  {
    title: "الإدارة",
    items: [
      { label: "السيارات", href: "/cars", icon: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" },
      { label: "المزادات", href: "/auctions", icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" },
    ],
  },
];

export function DashboardShell({
  children,
  sections = DEFAULT_SECTIONS,
  title = "لوحة التحكم",
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 h-16 px-4 border-b border-syarah-border shrink-0">
        <div className="w-10 h-10 rounded-xl bg-syarah-blue flex items-center justify-center text-white font-bold shrink-0 text-[14px]">
          A
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-syarah-text truncate">KAM-CAR</p>
            <p className="text-[11px] text-syarah-muted truncate">لوحة التحكم</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {sections.map((section) => (
          <div key={section.title} className="mb-1">
            {!collapsed && (
              <p className="text-[11px] font-semibold text-syarah-muted uppercase tracking-wider px-4 py-2">
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 mx-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  collapsed ? "justify-center mx-auto w-12 h-10 p-0" : ""
                } text-syarah-muted hover:bg-syarah-section hover:text-syarah-text`}
                title={collapsed ? item.label : undefined}
              >
                {item.icon && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d={item.icon} />
                  </svg>
                )}
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-syarah-border p-3 shrink-0">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center justify-center w-full p-2 rounded-xl text-syarah-muted hover:bg-syarah-section transition-colors"
          aria-label={collapsed ? "توسيع" : "طي"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-syarah-section" dir="rtl">
      <aside
        className={`fixed top-0 h-screen z-20 bg-white border-l border-syarah-border transition-all duration-200 hidden lg:flex flex-col ${
          collapsed ? "w-16" : "w-64"
        }`}
        style={{ right: 0, left: "auto" }}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl flex flex-col" style={{ left: "auto" }}>
            <div className="flex items-center justify-between h-16 px-4 border-b border-syarah-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-syarah-blue flex items-center justify-center text-white font-bold text-[12px] shrink-0">A</div>
                <p className="text-[13px] font-semibold text-syarah-text">KAM-CAR</p>
              </div>
              <button type="button" onClick={() => setMobileOpen(false)} className="p-2 rounded-xl text-syarah-muted hover:bg-syarah-section transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {sections.map((section) => (
                <div key={section.title} className="mb-1">
                  <p className="text-[11px] font-semibold text-syarah-muted uppercase tracking-wider px-4 py-2">{section.title}</p>
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 mx-2 px-4 py-2.5 rounded-xl text-[13px] font-medium text-syarah-muted hover:bg-syarah-section hover:text-syarah-text transition-all"
                    >
                      {item.icon && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                          <path d={item.icon} />
                        </svg>
                      )}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-syarah-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-xl text-syarah-muted hover:bg-syarah-section transition-colors lg:hidden"
                aria-label="فتح القائمة"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setCollapsed((v) => !v)}
                className="p-2 rounded-xl text-syarah-muted hover:bg-syarah-section transition-colors hidden lg:flex"
                aria-label={collapsed ? "توسيع" : "طي"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </button>
              <h1 className="text-[15px] font-semibold text-syarah-text">{title}</h1>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" className="relative p-2 rounded-xl text-syarah-muted hover:bg-syarah-section transition-colors" aria-label="الإشعارات">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </button>
              <div className="w-8 h-8 rounded-full bg-syarah-blue flex items-center justify-center text-white text-[12px] font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
