import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../lib/supabase";
import { DashboardShell } from "../../components/layout/DashboardShell";

export const Route = createFileRoute("/admin/")({
  component: AdminIndex,
});

function AdminIndex() {
  const supabase = createClient();

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [carsRes, usersRes, dealersRes, auctionsRes, inspectionsRes, financeRes, adsRes] = await Promise.all([
        supabase.from("cars").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("dealers").select("id", { count: "exact", head: true }),
        supabase.from("auctions").select("id", { count: "exact", head: true }),
        supabase.from("inspection_appointments").select("id", { count: "exact", head: true }),
        supabase.from("finance_requests").select("id", { count: "exact", head: true }),
        supabase.from("ad_campaigns").select("id", { count: "exact", head: true }),
      ]);

      return {
        cars: carsRes.count ?? 0,
        users: usersRes.count ?? 0,
        dealers: dealersRes.count ?? 0,
        auctions: auctionsRes.count ?? 0,
        inspections: inspectionsRes.count ?? 0,
        finance: financeRes.count ?? 0,
        ads: adsRes.count ?? 0,
      };
    },
  });

  const dashboardCards = [
    {
      title: "إضافة سيارة",
      description: "أضف سيارة جديدة للبيع أو المزاد",
      link: "/admin/cars/new",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
      ),
      count: stats?.cars,
      countLabel: "سيارة",
    },
    {
      title: "عرض السيارات",
      description: "شاهد وأدر جميع السيارات",
      link: "/cars",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      title: "الوكلاء",
      description: "إدارة الوكلاء المعتمدين",
      link: "/admin/dealers",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      count: stats?.dealers,
      countLabel: "وكيل",
    },
    {
      title: "المزادات",
      description: "إدارة المزادات النشطة والمكتملة",
      link: "/admin/auctions",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      count: stats?.auctions,
      countLabel: "مزاد",
    },
    {
      title: "مراكز الفحص",
      description: "إدارة مراكز الفحص والمواعيد",
      link: "/admin/inspections",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      count: stats?.inspections,
      countLabel: "موعد",
    },
    {
      title: "التمويل",
      description: "إدارة طلبات التمويل وشركاء التمويل",
      link: "/admin/finance",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      count: stats?.finance,
      countLabel: "طلب",
    },
    {
      title: "الإعلانات",
      description: "إدارة الحملات الإعلانية والشوراع",
      link: "/admin/ads",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      count: stats?.ads,
      countLabel: "حملة",
    },
    {
      title: "المستخدمين",
      description: "عرض وإدارة جميع المستخدمين",
      link: "/admin/users",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      count: stats?.users,
      countLabel: "مستخدم",
    },
  ];

  return (
    <DashboardShell>
      <section className="rounded-2xl border border-syarah-border bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-syarah-text">لوحة التحكم</h2>
        <p className="mt-2 text-sm text-syarah-muted">نظرة عامة على منصة KAM CAR</p>

        {stats && (
          <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-4">
            <div className="rounded-xl border border-syarah-border bg-syarah-section p-4">
              <p className="text-xs text-syarah-muted">السيارات</p>
              <p className="text-2xl font-bold text-syarah-text mt-1">{stats.cars}</p>
            </div>
            <div className="rounded-xl border border-syarah-border bg-syarah-section p-4">
              <p className="text-xs text-syarah-muted">المستخدمين</p>
              <p className="text-2xl font-bold text-syarah-text mt-1">{stats.users}</p>
            </div>
            <div className="rounded-xl border border-syarah-border bg-syarah-section p-4">
              <p className="text-xs text-syarah-muted">الوكلاء</p>
              <p className="text-2xl font-bold text-syarah-text mt-1">{stats.dealers}</p>
            </div>
            <div className="rounded-xl border border-syarah-border bg-syarah-section p-4">
              <p className="text-xs text-syarah-muted">المزادات</p>
              <p className="text-2xl font-bold text-syarah-text mt-1">{stats.auctions}</p>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardCards.map((card) => (
            <Link
              key={card.link}
              to={card.link}
              className="group relative flex flex-col items-start gap-3 rounded-2xl border border-syarah-border bg-white p-6 shadow-sm transition-all duration-200 hover:border-syarah-blue hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-syarah-section text-syarah-blue transition-colors group-hover:bg-syarah-blue group-hover:text-white">
                {card.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-semibold text-syarah-text transition-colors group-hover:text-syarah-blue">
                    {card.title}
                  </p>
                  {card.count !== undefined && (
                    <span className="text-sm font-bold text-syarah-blue">{card.count}</span>
                  )}
                </div>
                <p className="mt-1 text-[13px] text-syarah-muted">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
