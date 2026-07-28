import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createClient } from "../../lib/supabase";
import type { Auction, Car } from "../../lib/types";
import { AppHeader } from "../../components/layout/AppHeader";
import { AppFooter } from "../../components/layout/AppFooter";

export const Route = createFileRoute("/auctions/")({
  component: AuctionsPage,
});

function AuctionsPage() {
  const [status, setStatus] = useState<"active" | "ended" | "">("");
  const supabase = createClient();

  const { data: auctions = [], isLoading } = useQuery({
    queryKey: ["auctions", status],
    queryFn: async () => {
      let query = supabase
        .from("auctions")
        .select("*, car:cars(*)")
        .in("status", status ? [status] : ["active", "ended"])
        .order("end_time", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data as (Auction & { car: Car })[];
    },
  });

  const getTimeRemaining = (endTime: string | null) => {
    if (!endTime) return null;
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) return "انتهى";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days} يوم ${hours} ساعة`;
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} ساعة ${minutes} دقيقة`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-syarah-bg">
      <AppHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-syarah-text">المزادات</h1>
          <p className="mt-2 text-syarah-muted">تصفح المزادات النشطة والمكتملة</p>
        </div>

        <div className="flex gap-2 mb-8">
          {[
            { value: "", label: "الكل" },
            { value: "active", label: "نشط" },
            { value: "ended", label: "انتهى" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value as "active" | "ended" | "")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                status === opt.value
                  ? "bg-syarah-blue text-white"
                  : "bg-white border border-syarah-border text-syarah-text hover:border-syarah-blue"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-white border border-syarah-border animate-pulse" />
            ))}
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-syarah-muted text-lg">لا توجد مزادات حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <Link
                key={auction.id}
                to="/auctions/$auctionId"
                params={{ auctionId: auction.slug }}
                className="group rounded-2xl border border-syarah-border bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:border-syarah-blue"
              >
                <div className="aspect-[4/3] bg-syarah-section relative">
                  {auction.car ? (
                    <div className="w-full h-full flex items-center justify-center text-syarah-muted">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-syarah-muted">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      auction.status === "active"
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {auction.status === "active" ? "نشط" : "انتهى"}
                  </span>
                  {auction.status === "active" && auction.end_time && (
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 text-xs font-medium text-syarah-text">
                      {getTimeRemaining(auction.end_time)}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-syarah-text group-hover:text-syarah-blue transition-colors line-clamp-1">
                    {auction.title}
                  </h3>
                  {auction.car && (
                    <p className="text-sm text-syarah-muted mt-1">
                      {auction.car.year} - {auction.car.condition === "new" ? "جديدة" : "مستعملة"}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-xs text-syarah-muted">السعر الحالي</p>
                      <p className="text-lg font-bold text-syarah-blue">
                        {(auction.current_price ?? auction.start_price).toLocaleString("ar-SA")} ر.س
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-syarah-muted">المزايدات</p>
                      <p className="text-sm font-medium text-syarah-text">{auction.bid_count}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
