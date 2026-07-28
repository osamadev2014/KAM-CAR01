import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createClient } from "../../lib/supabase";
import type { Auction, AuctionBid, Car, CarMake, CarModel } from "../../lib/types";
import { SiteHeader } from "../../components/cardetail/SiteHeader";
import { SiteFooter } from "../../components/cardetail/SiteFooter";

export const Route = createFileRoute("/auctions/$auctionId")({
  component: AuctionDetailPage,
});

function AuctionDetailPage() {
  const { auctionId } = Route.useParams();
  const [bidAmount, setBidAmount] = useState("");
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data: auction, isLoading } = useQuery({
    queryKey: ["auction", auctionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auctions")
        .select("*, car:cars(*)")
        .eq("slug", auctionId)
        .single();
      if (error) throw error;
      return auction as Auction & { car: Car };
    },
  });

  const { data: bids = [] } = useQuery({
    queryKey: ["auction-bids", auction?.id],
    queryFn: async () => {
      if (!auction) return [];
      const { data, error } = await supabase
        .from("auction_bids")
        .select("*")
        .eq("auction_id", auction.id)
        .order("amount", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as AuctionBid[];
    },
    enabled: !!auction,
  });

  const { data: makes = [] } = useQuery({
    queryKey: ["car_makes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_makes").select("*").order("sort_order");
      if (error) throw error;
      return data as CarMake[];
    },
  });

  const { data: models = [] } = useQuery({
    queryKey: ["car_models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_models").select("*");
      if (error) throw error;
      return data as CarModel[];
    },
  });

  const bidMutation = useMutation({
    mutationFn: async (amount: number) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("يجب تسجيل الدخول أولاً");

      const { error } = await supabase.from("auction_bids").insert({
        auction_id: auction!.id,
        bidder_id: session.user.id,
        amount,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
      queryClient.invalidateQueries({ queryKey: ["auction-bids", auction?.id] });
      setBidAmount("");
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
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days} يوم ${hours} ساعة ${minutes} دقيقة`;
    return `${hours} ساعة ${minutes} دقيقة`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-syarah-bg">
        <SiteHeader />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-white rounded-2xl border border-syarah-border" />
            <div className="h-96 bg-white rounded-2xl border border-syarah-border" />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex flex-col bg-syarah-bg">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-syarah-text">المزاد غير موجود</h1>
            <Link to="/auctions" className="mt-4 inline-block text-syarah-blue hover:underline">
              العودة للمزادات
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const currentPrice = auction.current_price ?? auction.start_price;
  const minimumBid = currentPrice + auction.bid_increment;
  const make = auction.car ? makes.find((m) => m.id === auction.car!.make_id) : null;
  const model = auction.car ? models.find((m) => m.id === auction.car!.model_id) : null;

  return (
    <div className="min-h-screen flex flex-col bg-syarah-bg">
      <SiteHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-syarah-border bg-white overflow-hidden">
              <div className="aspect-video bg-syarah-section flex items-center justify-center">
                <svg className="w-16 h-16 text-syarah-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-syarah-text">{auction.title}</h1>
                {auction.car && (
                  <p className="text-syarah-muted mt-2">
                    {make?.name_ar} {model?.name_ar} {auction.car.year} - {auction.car.condition === "new" ? "جديدة" : "مستعملة"}
                  </p>
                )}
                {auction.car && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {auction.car.mileage_km != null && (
                      <div className="text-center p-3 rounded-xl bg-syarah-section">
                        <p className="text-xs text-syarah-muted">الكيلومترات</p>
                        <p className="font-bold text-syarah-text">{auction.car.mileage_km.toLocaleString("ar-SA")}</p>
                      </div>
                    )}
                    {auction.car.transmission && (
                      <div className="text-center p-3 rounded-xl bg-syarah-section">
                        <p className="text-xs text-syarah-muted">ناقل الحركة</p>
                        <p className="font-bold text-syarah-text">{auction.car.transmission}</p>
                      </div>
                    )}
                    {auction.car.fuel_type && (
                      <div className="text-center p-3 rounded-xl bg-syarah-section">
                        <p className="text-xs text-syarah-muted">نوع الوقود</p>
                        <p className="font-bold text-syarah-text">{auction.car.fuel_type}</p>
                      </div>
                    )}
                    {auction.car.engine_size && (
                      <div className="text-center p-3 rounded-xl bg-syarah-section">
                        <p className="text-xs text-syarah-muted">حجم المحرك</p>
                        <p className="font-bold text-syarah-text">{auction.car.engine_size}L</p>
                      </div>
                    )}
                  </div>
                )}
                {auction.description && (
                  <p className="mt-4 text-syarah-muted leading-relaxed">{auction.description}</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-syarah-border bg-white p-6">
              <h2 className="text-lg font-bold text-syarah-text mb-4">سجل المزايدات</h2>
              {bids.length === 0 ? (
                <p className="text-syarah-muted text-center py-8">لا توجد مزايدات بعد</p>
              ) : (
                <div className="space-y-3">
                  {bids.map((bid, i) => (
                    <div
                      key={bid.id}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        i === 0 ? "bg-syarah-blue/5 border border-syarah-blue/20" : "bg-syarah-section"
                      }`}
                    >
                      <div>
                        <span className="text-sm text-syarah-muted">مزايدة #{bids.length - i}</span>
                        {bid.is_winning && (
                          <span className="mr-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            الأعلى
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-syarah-text">
                        {bid.amount.toLocaleString("ar-SA")} ر.س
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-syarah-border bg-white p-6 sticky top-24">
              <div className="text-center mb-6">
                {auction.status === "active" && auction.end_time && (
                  <p className="text-sm text-syarah-muted mb-2">
                    الوقت المتبقي: {getTimeRemaining(auction.end_time)}
                  </p>
                )}
                <p className="text-xs text-syarah-muted">السعر الحالي</p>
                <p className="text-3xl font-bold text-syarah-blue mt-1">
                  {currentPrice.toLocaleString("ar-SA")} ر.س
                </p>
                <p className="text-xs text-syarah-muted mt-1">
                  ابتداءً من {auction.start_price.toLocaleString("ar-SA")} ر.س
                </p>
              </div>

              {auction.status === "active" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-syarah-muted">المزايدة (الحد الأدنى: {minimumBid.toLocaleString("ar-SA")} ر.س)</label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={minimumBid.toString()}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl border border-syarah-border bg-white text-syarah-text focus:outline-none focus:ring-2 focus:ring-syarah-blue"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const amount = parseFloat(bidAmount);
                      if (amount >= minimumBid) {
                        bidMutation.mutate(amount);
                      }
                    }}
                    disabled={!bidAmount || parseFloat(bidAmount) < minimumBid || bidMutation.isPending}
                    className="w-full py-3 rounded-xl bg-syarah-blue text-white font-bold hover:bg-syarah-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bidMutation.isPending ? "جاري الإرسال..." : "تقديم المزايدة"}
                  </button>
                  {bidMutation.isError && (
                    <p className="text-sm text-red-500 text-center">{bidMutation.error.message}</p>
                  )}
                  {auction.buy_now_price && (
                    <button className="w-full py-3 rounded-xl border-2 border-syarah-blue text-syarah-blue font-bold hover:bg-syarah-blue/5 transition-colors">
                      شراء فوري: {auction.buy_now_price.toLocaleString("ar-SA")} ر.س
                    </button>
                  )}
                </div>
              )}

              {auction.status === "ended" && (
                <div className="text-center p-4 rounded-xl bg-syarah-section">
                  <p className="text-syarah-muted">انتهى المزاد</p>
                  {auction.winning_bid && (
                    <p className="font-bold text-syarah-text mt-1">
                      سعر البيع: {auction.winning_bid.toLocaleString("ar-SA")} ر.س
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-syarah-muted">الحد الأدنى للمزايدة</span>
                  <span className="text-syarah-text font-medium">{auction.bid_increment.toLocaleString("ar-SA")} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-syarah-muted">عدد المزايدات</span>
                  <span className="text-syarah-text font-medium">{auction.bid_count}</span>
                </div>
                {auction.buy_now_price && (
                  <div className="flex justify-between">
                    <span className="text-syarah-muted">سعر الشراء الفوري</span>
                    <span className="text-syarah-text font-medium">{auction.buy_now_price.toLocaleString("ar-SA")} ر.س</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
