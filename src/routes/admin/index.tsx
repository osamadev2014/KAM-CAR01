import { Link, createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "../../components/layout/DashboardShell";

export const Route = createFileRoute("/admin/")({
  component: AdminIndex,
});

function AdminIndex() {
  return (
    <DashboardShell>
      <section className="rounded-2xl border border-syarah-border bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-syarah-text">لوحة التحكم</h2>
        <p className="mt-2 text-sm text-syarah-muted">
          أضف أو عدّل أو احذف سياراتك بسهولة.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            to="/admin/cars/new"
            className="group relative flex flex-col items-start gap-3 rounded-2xl border border-syarah-border bg-white p-6 shadow-sm transition-all duration-200 hover:border-syarah-blue hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-syarah-section text-syarah-blue transition-colors group-hover:bg-syarah-blue group-hover:text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-syarah-text transition-colors group-hover:text-syarah-blue">
                إضافة سيارة
              </p>
              <p className="mt-1 text-[13px] text-syarah-muted">
                أضف سيارة جديدة للبيع أو المزاد
              </p>
            </div>
          </Link>

          <Link
            to="/cars"
            className="group relative flex flex-col items-start gap-3 rounded-2xl border border-syarah-border bg-white p-6 shadow-sm transition-all duration-200 hover:border-syarah-blue hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-syarah-section text-syarah-blue transition-colors group-hover:bg-syarah-blue group-hover:text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1h2" />
                <path d="M20 16V8h-4" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-syarah-text transition-colors group-hover:text-syarah-blue">
                عرض السيارات
              </p>
              <p className="mt-1 text-[13px] text-syarah-muted">
                شاهد جميع السيارات المتوفرة
              </p>
            </div>
          </Link>
        </div>
      </section>
    </DashboardShell>
  );
}
