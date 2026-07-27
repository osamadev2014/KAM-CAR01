export type CarCondition = "new" | "used";
export type CarStatus = "draft" | "published" | "sold";

export interface CarMake {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  logo_path: string;
  sort_order: number;
  created_at: string;
}

export interface CarModel {
  id: string;
  make_id: string;
  name_ar: string;
  name_en: string | null;
  created_at: string;
}

export interface Car {
  id: string;
  title: string;
  make_id: string;
  model_id: string;
  trim: string | null;
  year: number;
  condition: CarCondition;
  status: CarStatus;
  price_cash: number;
  price_installment_month: number | null;
  exterior_color: string | null;
  interior_color: string | null;
  origin: string | null;
  fuel_type: string | null;
  transmission: string | null;
  gear_count: number | null;
  cylinders: number | null;
  engine_size: number | null;
  drivetrain: string | null;
  keys_count: number | null;
  seats_count: number | null;
  engine_type: string | null;
  fuel_tank_liters: number | null;
  horsepower: number | null;
  fuel_consumption_km_l: number | null;
  warranty_years: number | null;
  warranty_km: number | null;
  warranty_unlimited_km: boolean;
  description: string | null;
  features: Record<string, string[]>;
  ad_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface CarImage {
  id: string;
  car_id: string;
  url: string;
  sort_order: number;
  created_at: string;
}

export interface CarInsert {
  title: string;
  make_id: string;
  model_id: string;
  trim?: string | null;
  year: number;
  condition: CarCondition;
  status: CarStatus;
  price_cash: number;
  price_installment_month?: number | null;
  exterior_color?: string | null;
  interior_color?: string | null;
  origin?: string | null;
  fuel_type?: string | null;
  transmission?: string | null;
  gear_count?: number | null;
  cylinders?: number | null;
  engine_size?: number | null;
  drivetrain?: string | null;
  keys_count?: number | null;
  seats_count?: number | null;
  engine_type?: string | null;
  fuel_tank_liters?: number | null;
  horsepower?: number | null;
  fuel_consumption_km_l?: number | null;
  warranty_years?: number | null;
  warranty_km?: number | null;
  warranty_unlimited_km?: boolean;
  description?: string | null;
  features?: Record<string, string[]>;
}

export interface CarImageInsert {
  car_id: string;
  url: string;
  sort_order: number;
}
