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
  dealer_id: string | null;
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

export type UserRole = "customer" | "dealer" | "admin";

export interface Profile {
  id: string;
  phone: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Dealer {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  is_active: boolean;
  is_approved: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface DealerInsert {
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
}

export interface DealerBranch {
  id: string;
  dealer_id: string;
  name: string;
  city: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

export interface DealerUser {
  id: string;
  dealer_id: string;
  user_id: string;
  role: string;
  permissions: Record<string, unknown>;
  created_at: string;
}

export type AuctionStatus = "draft" | "active" | "ended" | "cancelled";

export interface Auction {
  id: string;
  title: string;
  slug: string;
  car_id: string;
  seller_id: string;
  dealer_id: string | null;
  status: AuctionStatus;
  start_price: number;
  reserve_price: number | null;
  buy_now_price: number | null;
  bid_increment: number;
  current_price: number | null;
  winner_id: string | null;
  winning_bid: number | null;
  start_time: string | null;
  end_time: string | null;
  bid_count: number;
  viewer_count: number;
  terms: string | null;
  created_at: string;
  updated_at: string;
  car?: Car;
}

export interface AuctionBid {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  is_winning: boolean;
  created_at: string;
}

export interface AuctionWatcher {
  id: string;
  auction_id: string;
  user_id: string;
  created_at: string;
}

export interface InspectionCenter {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  is_active: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface InspectionService {
  id: string;
  center_id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

export type AppointmentStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";

export interface InspectionAppointment {
  id: string;
  center_id: string;
  service_id: string;
  customer_id: string;
  car_id: string | null;
  appointment_date: string;
  status: AppointmentStatus;
  price: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  center?: InspectionCenter;
  service?: InspectionService;
}

export type InspectionOutcome = "pass" | "conditional_pass" | "fail";

export interface InspectionReport {
  id: string;
  appointment_id: string;
  center_id: string;
  car_id: string | null;
  score: number;
  max_score: number;
  outcome: InspectionOutcome | null;
  summary: string | null;
  recommendation: string | null;
  estimated_repair_cost: number | null;
  is_public: boolean;
  share_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface InspectionReportSection {
  id: string;
  report_id: string;
  name: string;
  score: number;
  max_score: number;
  notes: string | null;
  sort_order: number;
  created_at: string;
}

export interface InspectionReportItem {
  id: string;
  section_id: string;
  name: string;
  status: "good" | "fair" | "poor" | "critical" | null;
  score: number;
  notes: string | null;
  sort_order: number;
  created_at: string;
}

export type FinanceRevenueModel = "per_lead" | "percentage" | "per_approved";

export interface FinancePartner {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  phone: string | null;
  email: string | null;
  revenue_model: FinanceRevenueModel;
  revenue_per_lead: number;
  revenue_percentage: number;
  revenue_per_approved: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type FinanceRequestStatus = "pending" | "under_review" | "approved" | "rejected" | "expired";

export interface FinanceRequest {
  id: string;
  customer_id: string;
  partner_id: string;
  car_id: string | null;
  vehicle_price: number;
  down_payment: number;
  requested_amount: number;
  monthly_income: number | null;
  employment_status: string | null;
  status: FinanceRequestStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  partner?: FinancePartner;
  car?: Car;
}

export type FinanceOfferStatus = "pending" | "accepted" | "rejected" | "expired";

export interface FinanceOffer {
  id: string;
  request_id: string;
  partner_id: string;
  monthly_payment: number;
  interest_rate: number;
  term_months: number;
  approved_amount: number;
  status: FinanceOfferStatus;
  created_at: string;
  partner?: FinancePartner;
}

export type CampaignType = "banner" | "featured_listing" | "sponsored";
export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "cancelled";

export interface AdPlacement {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  width: number | null;
  height: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Advertiser {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdCampaign {
  id: string;
  advertiser_id: string;
  name: string;
  type: CampaignType;
  placement_id: string | null;
  budget: number;
  spent: number;
  start_date: string;
  end_date: string;
  status: CampaignStatus;
  media_url: string | null;
  target_url: string | null;
  title: string | null;
  description: string | null;
  impressions_count: number;
  clicks_count: number;
  created_at: string;
  updated_at: string;
  advertiser?: Advertiser;
  placement?: AdPlacement;
}

export type PaymentStatus = "pending" | "processing" | "succeeded" | "failed" | "refunded" | "cancelled";
export type PaymentType = "subscription" | "listing_fee" | "auction_deposit" | "ad_payment" | "inspection_fee";

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentType;
  reference_id: string | null;
  reference_type: string | null;
  stripe_payment_id: string | null;
  stripe_session_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus = "active" | "past_due" | "cancelled" | "expired";
export type BillingPeriod = "monthly" | "yearly";

export interface Subscription {
  id: string;
  user_id: string;
  plan_name: string;
  plan_price: number;
  billing_period: BillingPeriod;
  status: SubscriptionStatus;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}
