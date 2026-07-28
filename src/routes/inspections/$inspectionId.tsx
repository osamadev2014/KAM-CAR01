import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createClient } from "../../lib/supabase";
import type { InspectionCenter, InspectionService } from "../../lib/types";
import { SiteHeader } from "../../components/cardetail/SiteHeader";
import { SiteFooter } from "../../components/cardetail/SiteFooter";

export const Route = createFileRoute("/inspections/$inspectionId")({
  component: InspectionDetailPage,
});

function InspectionDetailPage() {
  const { inspectionId } = Route.useParams();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [booking, setBooking] = useState(false);
  const supabase = createClient();

  const { data: center, isLoading } = useQuery({
    queryKey: ["inspection-center", inspectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inspection_centers")
        .select("*")
        .eq("slug", inspectionId)
        .single();
      if (error) throw error;
      return data as InspectionCenter;
    },
  });

  const { data: services = [] } = useQuery({
    queryKey: ["inspection-services", center?.id],
    queryFn: async () => {
      if (!center) return [];
      const { data, error } = await supabase
        .from("inspection_services")
        .select("*")
        .eq("center_id", center.id)
        .eq("is_active", true)
        .order("price");
      if (error) throw error;
      return data as InspectionService[];
    },
    enabled: !!center,
  });

  const handleBook = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/login";
      return;
    }

    if (!selectedService || !selectedDate) return;

    setBooking(true);
    const service = services.find((s) => s.id === selectedService);
    if (!service) return;

    const { error } = await supabase.from("inspection_appointments").insert({
      center_id: center!.id,
      service_id: selectedService,
      customer_id: session.user.id,
      appointment_date: new Date(selectedDate).toISOString(),
      price: service.price,
    });

    setBooking(false);

    if (!error) {
      alert("تم حجز موعد الفحص بنجاح!");
      setSelectedDate("");
      setSelectedService("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-syarah-bg">
        <SiteHeader />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-white rounded-2xl border border-syarah-border" />
            <div className="h-64 bg-white rounded-2xl border border-syarah-border" />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!center) {
    return (
      <div className="min-h-screen flex flex-col bg-syarah-bg">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-syarah-text">مركز الفحص غير موجود</h1>
            <Link to="/inspections" className="mt-4 inline-block text-syarah-blue hover:underline">
              العودة لمراكز الفحص
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-syarah-bg">
      <SiteHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="rounded-2xl border border-syarah-border bg-white overflow-hidden mb-8">
          <div className="h-48 bg-syarah-section relative">
            {center.logo_url ? (
              <img src={center.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-syarah-muted">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-syarah-text">{center.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              {center.city && <span className="text-syarah-muted">{center.city}</span>}
              {center.address && <span className="text-syarah-muted">| {center.address}</span>}
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-syarah-text">{center.rating.toFixed(1)}</span>
                <span className="text-syarah-muted text-sm">({center.review_count})</span>
              </div>
            </div>
            {center.description && (
              <p className="mt-4 text-syarah-muted leading-relaxed">{center.description}</p>
            )}
            <div className="flex gap-2 mt-4">
              {center.phone && (
                <a href={`tel:${center.phone}`} className="px-4 py-2 rounded-xl bg-syarah-blue text-white text-sm font-medium hover:bg-syarah-blue/90 transition-colors">
                  اتصال
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-syarah-text mb-4">خدمات الفحص</h2>
            {services.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-syarah-border bg-white">
                <p className="text-syarah-muted">لا توجد خدمات متاحة حالياً</p>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedService === service.id
                        ? "border-syarah-blue bg-syarah-blue/5"
                        : "border-syarah-border bg-white hover:border-syarah-blue/50"
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-syarah-text">{service.name}</h3>
                        {service.description && (
                          <p className="text-sm text-syarah-muted mt-1">{service.description}</p>
                        )}
                        <p className="text-xs text-syarah-muted mt-1">المدة: {service.duration_minutes} دقيقة</p>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-bold text-syarah-blue">{service.price.toLocaleString("ar-SA")} ر.س</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="rounded-2xl border border-syarah-border bg-white p-6 sticky top-24">
              <h2 className="text-lg font-bold text-syarah-text mb-4">حجز موعد</h2>
              {!selectedService ? (
                <p className="text-syarah-muted text-sm text-center py-4">اختر خدمة من القائمة</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-syarah-muted">التاريخ والوقت</label>
                    <input
                      type="datetime-local"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl border border-syarah-border bg-white text-syarah-text focus:outline-none focus:ring-2 focus:ring-syarah-blue"
                    />
                  </div>
                  <button
                    onClick={handleBook}
                    disabled={!selectedDate || booking}
                    className="w-full py-3 rounded-xl bg-syarah-blue text-white font-bold hover:bg-syarah-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {booking ? "جاري الحجز..." : "تأكيد الحجز"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
