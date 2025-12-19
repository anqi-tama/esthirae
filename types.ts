
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export interface KPI {
  id: string;
  label: string;
  value: string | number;
  trend?: string; // e.g., "+12%"
  trendDirection?: 'up' | 'down' | 'neutral';
  color: 'gold' | 'lavender' | 'sage';
}

export enum AppointmentStatus {
  REQUESTED = 'Requested',
  CONFIRMED = 'Confirmed',
  CHECKED_IN = 'Checked-in',
  IN_TREATMENT = 'In Treatment',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export enum TreatmentStatus {
  WAITING = 'Waiting',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

// --- Wallet & Package Types (New) ---

export interface ServiceWalletItem {
  id: string; // Unique ID of this holding
  packageId: string; // Origin Package
  packageName: string;
  procedureName: string;
  totalUnits: number;
  remainingUnits: number;
  purchaseDate: Date;
  expiryDate: Date;
  unitValue: number; // Prorated value per unit (for refund/conversion logic)
  status: 'Active' | 'Expired' | 'Depleted';
}

export interface Patient {
  id: string;
  nik?: string; // National ID
  name: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female';
  email?: string;
  address?: string;
  tier: string;
  lastVisit: Date;
  lastDoctor: string;
  avatarUrl?: string;
  allergies?: string[];
  
  // Wallet Architecture
  walletBalance?: number; // Cash Wallet (Refundable/Flexible)
  valueWalletBalance?: number; // Value Wallet (Non-refundable, Promo tied)
  serviceWallet?: ServiceWalletItem[]; // Service Wallet (Unit based)
  
  walletExpiryDate?: Date; // For Cash/Value Wallet
  activeVouchers?: number;
  loyaltyPoints?: number;
}

export interface MedicalRecordPhoto {
  before: string;
  after: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  doctorName: string;
  treatmentType: string;
  diagnosis: string;
  clinicalNotes: string;
  // Added fields for detailed execution info
  treatmentPlan?: string;
  procedureNotes?: string;
  procedures?: string[]; // List of executed procedure names
  prescriptions: string[];
  photos?: MedicalRecordPhoto[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string; // Denormalized for display
  treatment: string;
  time: string; // HH:mm format
  date: Date;
  doctor: string;
  room?: string;
  notes?: string;
  status: AppointmentStatus;
  avatarUrl?: string;
}

// --- Product & Prescription Types ---

export interface ProductIngredient {
  id: string;
  name: string;
  qty: number;
  unit: string;
  price: number;
}

export interface SignaConfig {
  active: boolean;
  frequency: string; // e.g. "3" (times a day)
  dose: string;      // e.g. "1" (unit)
  unit: string;      // e.g. "Tablet", "Oles", "Tetes"
  notes?: string;    // e.g. "Sesudah makan"
  summary: string;   // Generated text: "3x1 Tablet Sesudah makan"
}

export interface TreatmentProduct {
  id: string;
  name: string;
  type: 'Retail' | 'Compound'; // Obat Jadi vs Racikan
  quantity: number;
  unit: string;
  price?: number;
  
  // Specific for Compound/Racikan
  ingredients?: ProductIngredient[];
  
  // Signa / Aturan Pakai
  signa?: SignaConfig;
}

export interface ExecutedProcedure {
  id: string;
  procedureId: string;
  name: string;
  price: number;
  notes?: string;
}

export interface Treatment {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  doctorName: string; // or Therapist
  type: string;
  status: TreatmentStatus;
  room: string;
  
  // Assessment
  complaint?: string;
  observation?: string;
  diagnosis?: string;
  
  // Plan & Execution
  linkedServiceWalletId?: string; // ID of the patient's package being redeemed
  additionalProcedures?: ExecutedProcedure[]; // New Field: Multiple treatments
  plan?: string;
  proceduresDone?: string;
  patientReaction?: string;
  
  // Products
  productsUsed?: TreatmentProduct[];
  
  // Post Care
  postCareInstructions?: string;
  nextVisit?: string;
  
  // Meta
  isFinalized: boolean;
}

export interface RevenueData {
  name: string;
  value: number;
}

// --- POS & Finance Types ---

export enum PaymentMethodType {
  CASH = 'Cash',
  TRANSFER = 'Bank Transfer',
  QRIS = 'QRIS',
  DEBIT = 'Debit Card',
  CREDIT = 'Credit Card',
  WALLET = 'Deposit Wallet',
  VOUCHER = 'Voucher'
}

export interface PaymentRecord {
  method: PaymentMethodType;
  amount: number;
  referenceId?: string; // Auth code, transaction ID
}

export interface InvoiceItem {
  id: string;
  name: string;
  type: 'Treatment' | 'Product' | 'Admin' | 'Package'; // Added Package type
  quantity: number;
  unitPrice: number;
  
  // Item Level Discount
  discountType?: 'Percent' | 'Nominal';
  discountValue?: number; // 10 or 50000
  subtotal: number; // (qty * price) - discount
}

export enum InvoiceStatus {
  DRAFT = 'Draft',
  UNPAID = 'Unpaid',
  PARTIAL = 'Partial',
  PAID = 'Paid',
  CANCELLED = 'Cancelled'
}

export interface Invoice {
  id: string;
  date: Date;
  patientId: string;
  patientName: string;
  patientTier: string;
  doctorName: string;
  
  items: InvoiceItem[];
  
  // Totals
  subtotal: number;
  
  // Invoice Level Discount
  globalDiscountType?: 'Percent' | 'Nominal';
  globalDiscountValue?: number;
  
  taxAmount: number;
  totalAmount: number; // Final Amount Due
  
  // Payments
  payments: PaymentRecord[];
  paidAmount: number;
  remainingAmount: number;
  
  status: InvoiceStatus;
}

// --- Retail Sales Types ---

export interface RetailProduct {
  id: string;
  name: string;
  category: 'Skincare' | 'Supplement' | 'Kit' | 'Merchandise';
  price: number;
  stock: number;
  imageUrl?: string;
  color?: string; // For UI fallback if no image
}

export interface CartItem extends RetailProduct {
  qty: number;
  discountType?: 'Percent' | 'Nominal';
  discountValue?: number;
  subtotal: number;
}

// --- Inventory Types ---

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  buyPrice: number; // HPP
  sellPrice: number;
  supplierName: string;
  status: 'Active' | 'Inactive';
  lastUpdated: Date;
}

export interface StockMovement {
  id: string;
  date: Date;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  itemId: string;
  itemName: string;
  qty: number;
  reason: string; // Purchase, Sales, Treatment, Opname, Expired
  actor: string;
  referenceId?: string; // PO Number or Invoice ID
}

export interface PurchaseOrderItem {
  itemId: string;
  itemName: string;
  qty: number;
  unitCost: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: string;
  date: Date;
  expectedDate?: Date;
  supplier: string;
  status: 'Draft' | 'Ordered' | 'Received';
  items?: PurchaseOrderItem[];
  totalAmount: number;
  itemsCount: number;
  notes?: string;
}

export interface StockOpnameItem {
  itemId: string;
  itemName: string;
  systemStock: number;
  physicalStock: number;
  unit: string;
  reason?: string;
}

export interface StockOpnameSession {
  id: string;
  date: Date;
  status: 'In Progress' | 'Completed';
  performedBy: string; // User Name
  notes?: string;
  items: StockOpnameItem[];
}

// --- Procedure / Tindakan Types ---

export type ProcedureCategory = 'Injectable' | 'Laser & Light' | 'Facial' | 'Body' | 'Consultation' | 'Other';

export interface ProcedureItem {
  itemId: string; // Ref to InventoryItem
  itemName: string;
  type: 'Consumable' | 'Medicine' | 'Product' | 'Asset';
  quantity: number;
  unit: string;
  unitCost: number; // Snapshot of cost at time of defining
  subtotal: number;
}

export interface Procedure {
  id: string;
  code: string;
  name: string;
  category: ProcedureCategory;
  description?: string;
  status: 'Active' | 'Inactive';
  
  // Composition (BOM)
  items: ProcedureItem[];
  
  // Costing Structure
  materialCost: number; // Sum of items
  doctorFee: number;
  adminFee: number;
  otherCost?: number;
  totalCost: number;
  
  // Pricing
  marginPercent: number;
  finalPrice: number;
  
  updatedAt: Date;
}

// --- Package Types (New) ---

export interface PackageItem {
  procedureId: string; // Link to Procedure ID
  procedureName: string;
  unitCount: number;
  // Calculated field for UI
  normalPriceSnapshot?: number; 
}

export interface PackageMaster {
  id: string;
  code: string;
  name: string;
  totalPrice: number;
  validityDays: number; // e.g. 365 days
  items: PackageItem[];
  description?: string;
  status: 'Active' | 'Inactive';
  
  // Financial info
  totalNormalPrice?: number; // Sum of items * normal price
  savingsPercent?: number; // Marketing display
}

// --- Loyalty & CRM Types ---

export interface LoyaltyTier {
  id: string;
  name: string;
  minSpend: number;
  color: string;
  benefits: string[];
}

export interface PointRule {
  id: string;
  name: string;
  type: 'Spend' | 'Treatment' | 'Product';
  conditionItem?: string; // e.g. "Laser" or "Skincare"
  points: number;
  status: 'Active' | 'Inactive';
}

export interface Promotion {
  id: string;
  name: string;
  type: 'Discount' | 'Cashback' | 'Bonus Point' | 'Fixed Cut' | 'Buy X Get Y'; // Expanded Types
  targetTier: string;
  value: number; // e.g. 10 (for 10% or 10 points)
  valueType: 'Percent' | 'Nominal' | 'Point';
  startDate: Date;
  endDate: Date;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Paused';
  usageCount: number;
  description?: string;

  // New Fields for Enhanced Engine
  codeMethod?: 'Auto' | 'Generic' | 'Unique';
  promoCode?: string; // For Generic Code
  uniqueCodePrefix?: string; // For Unique generation
  
  // Constraints / Rules
  validDays?: string[]; // ["Mon", "Tue"]
  validTimeStart?: string; // "10:00"
  validTimeEnd?: string; // "14:00"
  audienceFilter?: 'All' | 'New' | 'Tier' | 'Birthday';
  minTransaction?: number; // Min Belanja
  maxDiscountValue?: number; // Max Potongan (Anti Boncos)
  globalQuota?: number;
  userQuota?: number; // 1x per User

  // Buy X Get Y
  buyItem?: string;
  getItem?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerType: 'Inactive Duration' | 'Birthday' | 'Wallet Balance' | 'Post-Treatment';
  triggerValue: string; // e.g. "90" days, "7" days before, "1000000" IDR
  actionType: 'Send WhatsApp' | 'Inject Voucher' | 'Email';
  actionValue: string; // Message template or Voucher Code
  status: 'Active' | 'Paused';
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  content: string;
}

export interface Voucher {
  id: string;
  code: string;
  name: string;
  type: 'Nominal' | 'Percent';
  value: number;
  minTransaction?: number;
  expiryDate: Date;
  status: 'Active' | 'Used' | 'Expired';
  patientId?: string; // If assigned to specific patient
}

// Wallet & Finance Types
export interface WalletRuleConfig {
  enableExpiry: boolean;
  expiryMonths: number;
  allowRefund: boolean;
  refundAdminFeePercent: number;
}

export interface WalletLog {
  id: string;
  date: Date;
  patientId: string;
  patientName: string;
  type: 'Top Up' | 'Payment' | 'Refund' | 'Correction' | 'Adjustment';
  amount: number; // Positive or Negative
  balanceAfter: number;
  paymentMethod?: PaymentMethodType; // Only for Top Up
  referenceId?: string; // Invoice ID or External Ref
  performedBy?: string; // Cashier/Admin Name
  notes?: string;
}

// --- Staff & Shift Management Types ---

export type StaffRole = 'Doctor' | 'Nurse' | 'Therapist' | 'Cashier' | 'Admin';

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  email?: string;
  status: 'Active' | 'Inactive';
  avatarUrl?: string;
  password?: string; // New: Login Password
  
  // Medical Specific
  strNumber?: string; // Surat Tanda Registrasi
  sipNumber?: string; // Surat Izin Praktik
  specialization?: string; // e.g. Dermatologist, Aesthetician
  permitExpiry?: Date;
}

export interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: StaffRole;
  date: Date; // Specific Date
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  location?: string; // Room or Branch
  isRecurring: boolean; // If true, repeats weekly on this day
  notes?: string;
}

// --- Setting & Clinic Types ---

export interface ClinicProfile {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  businessHours: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  status: 'Active' | 'Inactive';
}
