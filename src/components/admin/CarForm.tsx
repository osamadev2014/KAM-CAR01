import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../lib/supabase";
import type { CarMake, CarModel } from "../../lib/types";
import {
  carFormSchema,
  type CarFormData,
  FEATURE_CATEGORIES,
  COMMON_FEATURES,
  CONDITION_OPTIONS,
  COLOR_OPTIONS,
  ORIGIN_OPTIONS,
  FUEL_OPTIONS,
  TRANSMISSION_OPTIONS,
  GEAR_COUNT_OPTIONS,
  CYLINDER_OPTIONS,
  ENGINE_SIZE_OPTIONS,
  DRIVETRAIN_OPTIONS,
  KEY_COUNT_OPTIONS,
  SEAT_COUNT_OPTIONS,
  ENGINE_TYPE_OPTIONS,
  WARRANTY_KM_OPTIONS,
  YEAR_OPTIONS,
} from "../../lib/car-form-schema";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../../components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover";

type Props = {
  onSuccess?: () => void;
};

const MAX_IMAGES = 20;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function CarForm({ onSuccess }: Props) {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [addingModel, setAddingModel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      condition: "new",
      year: new Date().getFullYear(),
      features: {},
      warranty_years: 0,
      warranty_km: "بدون",
    },
  });

  const features = watch("features") || {};
  const selectedMakeId = watch("make_id");
  const selectedModelId = watch("model_id");
  const selectedWarrantyKm = watch("warranty_km");

  const { data: makes = [] } = useQuery({
    queryKey: ["car_makes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_makes")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as CarMake[];
    },
  });

  const { data: models = [], refetch: refetchModels } = useQuery({
    queryKey: ["car_models", selectedMakeId],
    queryFn: async () => {
      if (!selectedMakeId) return [];
      const { data, error } = await supabase
        .from("car_models")
        .select("*")
        .eq("make_id", selectedMakeId)
        .order("name_ar");
      if (error) throw error;
      return data as CarModel[];
    },
    enabled: !!selectedMakeId,
  });

  const selectedMake = makes.find((m) => m.id === selectedMakeId);
  const selectedModel = models.find((m) => m.id === selectedModelId);

  useEffect(() => {
    if (selectedMakeId) {
      setValue("model_id", "");
      setModelSearch("");
    }
  }, [selectedMakeId, setValue]);

  const handleAddModel = async () => {
    if (!modelSearch.trim() || !selectedMakeId) return;
    setAddingModel(true);
    try {
      const { data, error } = await supabase
        .from("car_models")
        .insert({ make_id: selectedMakeId, name_ar: modelSearch.trim() })
        .select("id")
        .single();
      if (error) throw error;
      await refetchModels();
      setValue("model_id", data.id);
      setModelSearch("");
      setModelOpen(false);
    } catch (err: any) {
      alert("خطأ في إضافة الموديل: " + err.message);
    } finally {
      setAddingModel(false);
    }
  };

  const addFiles = (fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList).filter((f) => {
      if (!ALLOWED_TYPES.includes(f.type)) {
        alert(`الملف ${f.name} غير مدعوم. استخدم JPG, PNG, أو WEBP`);
        return false;
      }
      if (f.size > MAX_FILE_SIZE) {
        alert(`الملف ${f.name} يتجاوز 5MB`);
        return false;
      }
      return true;
    });
    const remaining = MAX_IMAGES - images.length;
    const toAdd = newFiles.slice(0, remaining);
    if (newFiles.length > remaining) {
      alert(`يمكنك إضافة ${remaining} صور فقط (الحد الأقصى ${MAX_IMAGES})`);
    }
    setImages((prev) => [...prev, ...toAdd]);
    for (const file of toAdd) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setImagePreviews((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const toggleFeature = (category: string, feature: string) => {
    const current = features[category] || [];
    const updated = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature];
    setValue("features", { ...features, [category]: updated }, { shouldValidate: true });
  };

  const saveCar = async (data: CarFormData, status: "draft" | "published") => {
    if (status === "published" && images.length === 0) {
      alert("يجب رفع صورة واحدة على الأقل للنشر");
      return;
    }

    setSaving(true);
    try {
      const adNumber = `KAM-${Date.now().toString(36).toUpperCase()}`;

      const { data: carData, error: carError } = await supabase
        .from("cars")
        .insert({
          ...data,
          status,
          features: data.features || {},
          ad_number: adNumber,
          warranty_years: data.warranty_years || 0,
          warranty_km: data.warranty_km ?? null,
          warranty_unlimited_km: data.warranty_unlimited_km || false,
        })
        .select("id")
        .single();

      if (carError) throw new Error("خطأ في حفظ السيارة: " + carError.message);

      const carId = carData.id;

      const imageInserts = [];
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${carId}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(path, file);

        if (uploadError) {
          console.error("خطأ في رفع الصورة:", uploadError);
          continue;
        }

        const { data: urlData } = supabase.storage.from("car-images").getPublicUrl(path);
        imageInserts.push({ car_id: carId, url: urlData.publicUrl, sort_order: i });
      }

      if (imageInserts.length > 0) {
        const { error: imgError } = await supabase.from("car_images").insert(imageInserts);
        if (imgError) {
          alert("تم حفظ السيارة لكن حدث خطأ في حفظ بيانات الصور.");
        }
      }

      if (images.length > 0 && imageInserts.length === 0) {
        alert("تم حفظ السيارة كمسودة لأن جميع الصور فشل رفعها.");
      } else {
        alert(status === "published" ? "تم نشر السيارة بنجاح" : "تم حفظ السيارة كمسودة");
      }

      onSuccess?.();
    } catch (err: any) {
      alert("خطأ غير متوقع: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredModels = modelSearch
    ? models.filter((m) => m.name_ar.includes(modelSearch))
    : models;

  const needsNewModel =
    modelSearch.trim() &&
    !models.some((m) => m.name_ar === modelSearch.trim());

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6" dir="rtl">
      {/* بيانات أساسية */}
      <fieldset className="rounded-[8px] border border-syarah-border bg-white p-5">
        <legend className="px-2 text-[15px] font-bold text-syarah-text">البيانات الأساسية</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[13px] text-syarah-muted">العنوان *</label>
            <input {...register("title")} className="w-full rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue" />
            {errors.title && <p className="mt-1 text-[12px] text-syarah-red">{errors.title.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-[13px] text-syarah-muted">الماركة *</label>
            <select {...register("make_id")} className="w-full rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue">
              <option value="">اختر الماركة</option>
              {makes.map((m) => (
                <option key={m.id} value={m.id}>{m.name_ar}</option>
              ))}
            </select>
            {errors.make_id && <p className="mt-1 text-[12px] text-syarah-red">{errors.make_id.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-[13px] text-syarah-muted">الموديل *</label>
            <Popover open={modelOpen} onOpenChange={setModelOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={!selectedMakeId}
                  className="flex w-full items-center justify-between rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue disabled:opacity-50"
                >
                  <span>{selectedModel ? selectedModel.name_ar : "اختر الموديل"}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" dir="rtl">
                <Command>
                  <CommandInput
                    placeholder="بحث عن موديل..."
                    value={modelSearch}
                    onValueChange={setModelSearch}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {needsNewModel ? (
                        <button
                          type="button"
                          disabled={addingModel}
                          onClick={handleAddModel}
                          className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-syarah-blue hover:bg-syarah-section"
                        >
                          {addingModel ? "جاري الإضافة..." : `إضافة "${modelSearch}" كموديل جديد`}
                        </button>
                      ) : (
                        "لا توجد نتائج"
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredModels.map((m) => (
                        <CommandItem
                          key={m.id}
                          value={m.name_ar}
                          onSelect={() => {
                            setValue("model_id", m.id);
                            setModelOpen(false);
                          }}
                        >
                          {m.name_ar}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.model_id && <p className="mt-1 text-[12px] text-syarah-red">{errors.model_id.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-[13px] text-syarah-muted">الفئة</label>
            <input {...register("trim")} className="w-full rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue" />
          </div>
          <div>
            <label className="mb-1 block text-[13px] text-syarah-muted">الموديل (سنة) *</label>
            <select {...register("year", { valueAsNumber: true })} className="w-full rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue">
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            {errors.year && <p className="mt-1 text-[12px] text-syarah-red">{errors.year.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-[13px] text-syarah-muted">الحالة *</label>
            <select {...register("condition")} className="w-full rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue">
              {CONDITION_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* الأسعار */}
      <fieldset className="rounded-[8px] border border-syarah-border bg-white p-5">
        <legend className="px-2 text-[15px] font-bold text-syarah-text">الأسعار</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[13px] text-syarah-muted">سعر الكاش (ر.س) *</label>
            <input type="number" step="0.01" {...register("price_cash", { valueAsNumber: true })} className="w-full rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue" />
            {errors.price_cash && <p className="mt-1 text-[12px] text-syarah-red">{errors.price_cash.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-[13px] text-syarah-muted">القسط الشهري (ر.س)</label>
            <input type="number" step="0.01" {...register("price_installment_month", { valueAsNumber: true })} className="w-full rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue" />
          </div>
        </div>
      </fieldset>

      {/* المواصفات التقنية */}
      <fieldset className="rounded-[8px] border border-syarah-border bg-white p-5">
        <legend className="px-2 text-[15px] font-bold text-syarah-text">المواصفات التقنية</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="اللون الخارجي" register={register("exterior_color")} options={COLOR_OPTIONS} />
          <SelectField label="اللون الداخلي" register={register("interior_color")} options={COLOR_OPTIONS} />
          <SelectField label="الوارد" register={register("origin")} options={ORIGIN_OPTIONS} />
          <SelectField label="نوع الوقود" register={register("fuel_type")} options={FUEL_OPTIONS} />
          <SelectField label="نوع القير" register={register("transmission")} options={TRANSMISSION_OPTIONS} />
          <SelectField label="نوع الدفع" register={register("drivetrain")} options={DRIVETRAIN_OPTIONS.map((d) => d.value)} optionLabels={DRIVETRAIN_OPTIONS.map((d) => d.label)} />
          <NumberSelectField label="سرعات القير" register={register("gear_count", { valueAsNumber: true })} options={GEAR_COUNT_OPTIONS} />
          <NumberSelectField label="عدد السلندرات" register={register("cylinders", { valueAsNumber: true })} options={CYLINDER_OPTIONS} />
          <NumberSelectField label="حجم المحرك" register={register("engine_size", { valueAsNumber: true })} options={ENGINE_SIZE_OPTIONS.map(Number)} />
          <NumberSelectField label="القدرة بالحصان" register={register("horsepower", { valueAsNumber: true })} options={null} />
          <NumberSelectField label="عدد المفاتيح" register={register("keys_count", { valueAsNumber: true })} options={KEY_COUNT_OPTIONS} />
          <NumberSelectField label="عدد المقاعد" register={register("seats_count", { valueAsNumber: true })} options={SEAT_COUNT_OPTIONS} />
          <SelectField label="نوع المحرك" register={register("engine_type")} options={ENGINE_TYPE_OPTIONS} />
          <InputField label="سعة الخزان (لتر)" register={register("fuel_tank_liters", { valueAsNumber: true })} type="number" step="0.1" />
          <InputField label="استهلاك الوقود (كم/لتر)" register={register("fuel_consumption_km_l", { valueAsNumber: true })} type="number" step="0.1" />
        </div>
      </fieldset>

      {/* الضمان */}
      <fieldset className="rounded-[8px] border border-syarah-border bg-white p-5">
        <legend className="px-2 text-[15px] font-bold text-syarah-text">الضمان</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberSelectField label="سنوات الضمان" register={register("warranty_years", { valueAsNumber: true })} options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
          <div>
            <label className="mb-1 block text-[13px] text-syarah-muted">الكيلومتر</label>
            <select
              value={watch("warranty_unlimited_km") ? "unlimited" : (watch("warranty_km") != null ? String(watch("warranty_km")) : "")}
              onChange={(e) => {
                if (e.target.value === "unlimited") {
                  setValue("warranty_unlimited_km", true);
                  setValue("warranty_km", null);
                } else if (e.target.value === "") {
                  setValue("warranty_unlimited_km", false);
                  setValue("warranty_km", null);
                } else {
                  setValue("warranty_unlimited_km", false);
                  setValue("warranty_km", Number(e.target.value));
                }
              }}
              className="w-full rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue"
            >
              <option value="">—</option>
              {WARRANTY_KM_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.unlimited ? "unlimited" : (opt.value != null ? String(opt.value) : "")}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* المميزات */}
      <fieldset className="rounded-[8px] border border-syarah-border bg-white p-5">
        <legend className="px-2 text-[15px] font-bold text-syarah-text">المواصفات والمميزات</legend>
        <div className="flex flex-col gap-5">
          {FEATURE_CATEGORIES.map((cat) => (
            <div key={cat}>
              <h4 className="mb-2 text-[14px] font-bold text-syarah-text">{cat}</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {(COMMON_FEATURES[cat] || []).map((f) => (
                  <label key={f} className="flex items-center gap-2 text-[13px] text-syarah-text cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(features[cat] || []).includes(f)}
                      onChange={() => toggleFeature(cat, f)}
                      className="h-4 w-4 accent-syarah-blue"
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {/* الوصف */}
      <fieldset className="rounded-[8px] border border-syarah-border bg-white p-5">
        <legend className="px-2 text-[15px] font-bold text-syarah-text">الوصف</legend>
        <textarea
          {...register("description")}
          rows={4}
          maxLength={2000}
          className="w-full rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue"
          placeholder="وصف السيارة..."
        />
        <p className="mt-1 text-right text-[11px] text-syarah-muted">
          {(watch("description") || "").length}/2000
        </p>
      </fieldset>

      {/* الصور */}
      <fieldset className="rounded-[8px] border border-syarah-border bg-white p-5">
        <legend className="px-2 text-[15px] font-bold text-syarah-text">
          الصور ({images.length}/{MAX_IMAGES})
        </legend>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-[8px] border-2 border-dashed py-8 transition ${
            dragOver ? "border-syarah-blue bg-syarah-section" : "border-syarah-border"
          } ${images.length >= MAX_IMAGES ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7a7a7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="mt-2 text-[13px] text-syarah-muted">اسحب الصور هنا أو اضغط للاختيار</p>
          <p className="mt-1 text-[11px] text-syarah-muted">JPG, PNG, WEBP — حتى 5MB لكل صورة — ${MAX_IMAGES} صورة كحد أقصى</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
        />

        {imagePreviews.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative h-[100px] w-[140px] overflow-hidden rounded-[6px] border border-syarah-border">
                <img src={src} alt={`صورة ${i + 1}`} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/40 py-1">
                  <button type="button" onClick={() => moveImage(i, i - 1)} disabled={i === 0} className="text-[11px] text-white disabled:opacity-30">&#9655;</button>
                  <span className="text-[11px] text-white">{i + 1}/{imagePreviews.length}</span>
                  <button type="button" onClick={() => moveImage(i, i + 1)} disabled={i === imagePreviews.length - 1} className="text-[11px] text-white disabled:opacity-30">&#9665;</button>
                </div>
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-syarah-red text-[11px] text-white">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <p className="mt-2 text-[12px] text-syarah-red">يجب رفع صورة واحدة على الأقل للنشر</p>
        )}
      </fieldset>

      {/* أزرار الحفظ */}
      <div className="flex gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={handleSubmit((data) => saveCar(data, "draft"))}
          className="rounded-[6px] border border-syarah-border bg-white px-6 py-3 text-[14px] font-semibold text-syarah-text transition-colors hover:border-syarah-blue hover:text-syarah-blue disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : "حفظ كمسودة"}
        </button>
        <button
          type="button"
          disabled={saving || images.length === 0}
          onClick={handleSubmit((data) => saveCar(data, "published"))}
          className="rounded-[6px] bg-syarah-green px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#009345] disabled:cursor-not-allowed disabled:opacity-50"
          title={images.length === 0 ? "يجب رفع صورة واحدة على الأقل للنشر" : ""}
        >
          {saving ? "جاري النشر..." : "نشر"}
        </button>
      </div>
    </form>
  );
}

function SelectField({
  label,
  register,
  options,
  optionLabels,
}: {
  label: string;
  register: any;
  options: readonly string[];
  optionLabels?: readonly string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-[13px] text-syarah-muted">{label}</label>
      <select {...register} className="w-full rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue">
        <option value="">—</option>
        {options.map((opt, i) => (
          <option key={opt} value={opt}>{optionLabels ? optionLabels[i] : opt}</option>
        ))}
      </select>
    </div>
  );
}

function NumberSelectField({
  label,
  register,
  options,
}: {
  label: string;
  register: any;
  options: readonly number[] | null;
}) {
  if (!options) {
    return (
      <div>
        <label className="mb-1 block text-[13px] text-syarah-muted">{label}</label>
        <input type="number" {...register} className="w-full rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue" />
      </div>
    );
  }
  return (
    <div>
      <label className="mb-1 block text-[13px] text-syarah-muted">{label}</label>
      <select {...register} className="w-full rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue">
        <option value="">—</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function InputField({
  label,
  register,
  type = "text",
  step,
}: {
  label: string;
  register: any;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[13px] text-syarah-muted">{label}</label>
      <input type={type} step={step} {...register} className="w-full rounded-[6px] border border-syarah-border px-3 py-2.5 text-[13px] outline-none focus:border-syarah-blue" />
    </div>
  );
}
