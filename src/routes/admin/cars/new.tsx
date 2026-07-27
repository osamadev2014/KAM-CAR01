import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CarForm } from "../../../components/admin/CarForm";

export const Route = createFileRoute("/admin/cars/new")({
  component: NewCarPage,
});

function NewCarPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-syarah-section px-4 py-10" dir="rtl">
      <div className="mx-auto max-w-[800px]">
        <h1 className="mb-6 text-[22px] font-bold text-syarah-text">إضافة سيارة جديدة</h1>
        <CarForm onSuccess={() => navigate({ to: "/admin" })} />
      </div>
    </div>
  );
}
