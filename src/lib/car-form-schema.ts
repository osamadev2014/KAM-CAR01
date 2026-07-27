import { z } from "zod";

const currentYear = new Date().getFullYear();

export const carFormSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  make_id: z.string().min(1, "الماركة مطلوبة"),
  model_id: z.string().min(1, "الموديل مطلوب"),
  trim: z.string().optional(),
  year: z
    .number({ required_error: "الموديل مطلوب" })
    .int()
    .min(2015, "الموديل لا يقل عن 2015")
    .max(currentYear + 1, "الموديل غير صالح"),
  condition: z.enum(["new", "used"]),
  price_cash: z.number({ required_error: "سعر الكاش مطلوب" }).min(0, "السعر لا يكون سالباً"),
  price_installment_month: z.number().min(0).optional().nullable(),

  exterior_color: z.string().optional().nullable(),
  interior_color: z.string().optional().nullable(),
  origin: z.string().optional().nullable(),
  fuel_type: z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  gear_count: z.number().int().min(0).optional().nullable(),
  cylinders: z.number().int().min(0).optional().nullable(),
  engine_size: z.number().min(0).optional().nullable(),
  drivetrain: z.string().optional().nullable(),
  keys_count: z.number().int().min(0).optional().nullable(),
  seats_count: z.number().int().min(0).optional().nullable(),
  engine_type: z.string().optional().nullable(),
  fuel_tank_liters: z.number().min(0).optional().nullable(),
  horsepower: z.number().int().min(0).optional().nullable(),
  fuel_consumption_km_l: z.number().min(0).optional().nullable(),

  warranty_years: z.number().int().min(0).max(10).optional().nullable(),
  warranty_km: z.number().int().min(0).optional().nullable(),
  warranty_unlimited_km: z.boolean().default(false),

  description: z.string().max(2000, "الوصف لا يتجاوز 2000 حرف").optional().nullable(),

  features: z.record(z.array(z.string())).default({}),
});

export type CarFormData = z.infer<typeof carFormSchema>;

export const FEATURE_CATEGORIES = ["الامان", "الراحة", "تقنيات", "تجهيزات خارجية"] as const;

export const COMMON_FEATURES: Record<string, string[]> = {
  الامان: [
    "وسائد هوائية امامية",
    "فرامل ABS",
    "مراقبة ضغط الاطارات",
    "الثبات الإلكتروني ESP",
    "المساعدة على صعود المرتفعات HAC",
    "أحزمة أمان",
    "EBD توزيع قوة الفرامل الكترونيا",
    "نظام التحكم بالإنزلاق (TRC)",
    "فرامل يد الكترونى",
  ],
  الراحة: [
    "مقاعد جلد",
    "تشغيل بصمة",
    "تحكم دريكسون",
    "مثبت سرعة",
    "زجاج كهربائي",
    "مكيف أوتوماتيك",
    "تحكم مقاعد يدوى",
    "ISOFIX لتثبيت مقاعد الاطفال",
  ],
  تقنيات: ["بلوتوث", "مدخل USB", "كاميرا خلفية", "منافذ طاقة", "شاشة وسائط", "راديو"],
  "تجهيزات خارجية": [
    "مرايا تحكم كهربائي",
    "جنوط",
    "اشارات بالمرايا",
    "دخول ذكي",
    "مصابيح ضباب خلفية",
    "أنوار نهارية LED",
    "التحكم بارتفاع الأنوار الأمامية",
  ],
};

export const CONDITION_OPTIONS = [
  { value: "new", label: "جديدة" },
  { value: "used", label: "مستعملة" },
] as const;

export const COLOR_OPTIONS = [
  "أبيض", "أسود", "فضي", "رمادي", "أحمر", "أزرق", "بني",
  "بيج", "ذهبي", "برتقالي", "أخضر", "نيلي", "كحلي", "سماوي", "أصفر",
] as const;

export const ORIGIN_OPTIONS = [
  "سعودي", "خليجي", "أمريكي", "أوروبي", "ياباني", "كوري", "صيني",
] as const;

export const FUEL_OPTIONS = ["بنزين", "ديزل", "هايبرد", "كهربائي"] as const;

export const TRANSMISSION_OPTIONS = ["اوتوماتيك", "يدوي", "CVT"] as const;

export const GEAR_COUNT_OPTIONS = [4, 5, 6, 7, 8, 9, 10] as const;

export const CYLINDER_OPTIONS = [0, 3, 4, 5, 6, 8, 10, 12] as const;

export const ENGINE_SIZE_OPTIONS = [
  1.0, 1.2, 1.4, 1.5, 1.6, 1.8, 2.0, 2.4, 2.5, 3.0, 3.5, 4.0, 5.0, 6.0,
] as const;

export const DRIVETRAIN_OPTIONS = [
  { value: "FWD", label: "FWD دفع امامي" },
  { value: "RWD", label: "RWD دفع خلفي" },
  { value: "AWD", label: "AWD دفع رباعي" },
  { value: "4WD", label: "4WD دفع رباعي" },
] as const;

export const KEY_COUNT_OPTIONS = [1, 2, 3, 4] as const;

export const SEAT_COUNT_OPTIONS = [2, 4, 5, 6, 7, 8, 9] as const;

export const ENGINE_TYPE_OPTIONS = [
  "تنفس طبيعي", "تيربو", "سوبرتشارجر", "كهربائي", "هايبرد",
] as const;

export const WARRANTY_KM_OPTIONS = [
  { value: null, unlimited: false, label: "بدون" },
  { value: 50000, unlimited: false, label: "50,000" },
  { value: 100000, unlimited: false, label: "100,000" },
  { value: 150000, unlimited: false, label: "150,000" },
  { value: 200000, unlimited: false, label: "200,000" },
  { value: null, unlimited: true, label: "غير محدود" },
] as const;

export const YEAR_OPTIONS = Array.from(
  { length: currentYear + 1 - 2015 },
  (_, i) => currentYear + 1 - i,
);
