import { 
  LayoutDashboard, 
  CalendarClock, 
  UserRound, 
  CreditCard, 
  Sparkles, 
  Stethoscope, 
  BarChart3, 
  Settings2, 
  Activity, 
  ShoppingBag, 
  ClipboardList, 
  Package, 
  Layers, 
  Truck, 
  ClipboardCheck, 
  History, 
  Box, 
  Users, 
  Crown, 
  TicketPercent 
} from 'lucide-react';
import { MenuGroup, Appointment, AppointmentStatus, Patient, MedicalRecord, Treatment, TreatmentStatus, Invoice, InvoiceStatus, PaymentMethodType, RetailProduct, InventoryItem, StockMovement, PurchaseOrder, LoyaltyTier, Promotion, Voucher, WalletLog, Staff, Shift, Procedure, PackageMaster, WhatsAppTemplate } from './types.ts';

// Grouped Sidebar Structure
export const MENU_GROUPS: MenuGroup[] = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { id: 'agenda', label: 'Agenda & Booking', icon: CalendarClock, path: '/agenda' },
      { id: 'queue', label: 'Patient Queue', icon: Users, path: '/queue-monitor' },
    ]
  },
  {
    label: 'Clinical',
    items: [
      { id: 'emr', label: 'Patients & EMR', icon: UserRound, path: '/patients' },
      { id: 'treatments', label: 'Clinical Treatments', icon: Activity, path: '/treatments' }, 
      { id: 'services', label: 'Services', icon: ClipboardList, path: '/services' },
      { id: 'packages', label: 'Package Treatment', icon: Box, path: '/packages' },
    ]
  },
  {
    label: 'Transaction Activities',
    items: [
      { id: 'cashier', label: 'Cashier', icon: CreditCard, path: '/cashier' },
      { id: 'sales', label: 'Retail Sales', icon: ShoppingBag, path: '/sales' },
    ]
  },
  {
    label: 'Inventory & Stock',
    items: [
      { id: 'inv-catalog', label: 'Inventory Catalog', icon: Package, path: '/inventory' },
      { id: 'inv-stock', label: 'Stock Info', icon: Layers, path: '/stock' },
      { id: 'inv-purchasing', label: 'Purchasing', icon: Truck, path: '/purchasing' },
      { id: 'inv-opname', label: 'Stok Opname', icon: ClipboardCheck, path: '/opname' },
      { id: 'inv-logs', label: 'Stock Logs', icon: History, path: '/logs' },
    ]
  },
  {
    label: 'CRM & Loyalty',
    items: [
      { id: 'crm', label: 'CRM (360 View)', icon: Users, path: '/crm' },
      { id: 'loyalty', label: 'Loyalty Program', icon: Crown, path: '/loyalty' },
      { id: 'promo', label: 'Promotion Engine', icon: TicketPercent, path: '/promotions' },
    ]
  },
  {
    label: 'Management',
    items: [
      { id: 'staff', label: 'Staff & Shift', icon: Stethoscope, path: '/staff' },
      { id: 'reports', label: 'Reports & Statistic', icon: BarChart3, path: '/reports' },
      { id: 'settings', label: 'Clinic Settings', icon: Settings2, path: '/settings' },
    ]
  }
];

export const MOCK_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
    { id: 'T1', title: 'We Miss You (Re-activation)', content: "Halo Kak [Name], sudah lama tidak mampir ke Esthirae! Kami kangen. Yuk treatment lagi minggu ini dan dapatkan complimentary skin analysis." },
    { id: 'T2', title: 'Birthday Wish', content: "Happy Birthday Kak [Name]! 🎂 Sebagai kado spesial, nikmati diskon 20% untuk treatment apapun bulan ini. Tunjukkan pesan ini saat kedatangan ya." },
    { id: 'T3', title: 'Post-Treatment Check', content: "Halo Kak [Name], bagaimana kondisi kulit setelah treatment kemarin? Jangan lupa pakai moisturizer dan sunscreen ya. Jika ada keluhan hubungi kami segera." },
    { id: 'T4', title: 'General Promo Alert', content: "Promo Alert! ✨ Dapatkan kulit glowing instan dengan paket baru kami. Slot terbatas, book sekarang!" },
];

export const MOCK_PATIENTS: Patient[] = [
  { 
    id: 'P-001', 
    nik: '3171234567890001',
    name: 'Emma Wilson', 
    phone: '081234567890', 
    dob: '1995-04-12', 
    gender: 'Female',
    tier: 'Platinum',
    lastVisit: new Date('2023-10-20'),
    lastDoctor: 'Dr. Sarah',
    avatarUrl: 'https://picsum.photos/id/64/100/100',
    allergies: ['Penicillin'],
    walletBalance: 2500000,
    serviceWallet: [
        { id: 'SW-001', packageId: 'PKG-001', packageName: 'Acne Warrior Package', procedureName: 'Acne Peel', totalUnits: 10, remainingUnits: 3, purchaseDate: new Date('2023-01-10'), expiryDate: new Date('2024-01-10'), unitValue: 350000, status: 'Active' }
    ],
    activeVouchers: 2,
    loyaltyPoints: 1250
  },
  { 
    id: 'P-002', 
    name: 'Olivia Brown', 
    phone: '081298765432', 
    dob: '1988-11-23', 
    gender: 'Female',
    tier: 'Gold',
    lastVisit: new Date('2023-09-15'),
    lastDoctor: 'Dr. Sarah',
    avatarUrl: 'https://picsum.photos/id/65/100/100',
    walletBalance: 0,
    activeVouchers: 0,
    loyaltyPoints: 450
  }
];

export const MOCK_TREATMENTS: Treatment[] = [
  {
    id: 'TRT-2023-001',
    patientId: 'P-001',
    patientName: 'Emma Wilson',
    date: new Date(),
    doctorName: 'Dr. Sarah',
    type: 'Laser Rejuvenation',
    status: TreatmentStatus.IN_PROGRESS,
    room: 'Room B (Laser)',
    isFinalized: false
  }
];

export const MOCK_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'MR-2023-001',
    patientId: 'P-001',
    date: '2023-10-20',
    doctorName: 'Dr. Sarah',
    treatmentType: 'Laser Rejuvenation',
    diagnosis: 'Hyperpigmentation',
    clinicalNotes: 'Advised sunscreen usage.',
    prescriptions: ['Sunscreen SPF 50'],
    photos: []
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-231024-001',
    date: new Date(),
    patientId: 'P-001',
    patientName: 'Emma Wilson',
    patientTier: 'Platinum',
    doctorName: 'Dr. Sarah',
    status: InvoiceStatus.UNPAID,
    items: [
      { id: 'ITM-1', name: 'Microdermabrasion', type: 'Treatment', quantity: 1, unitPrice: 450000, subtotal: 450000 }
    ],
    subtotal: 450000,
    taxAmount: 49500,
    totalAmount: 499500,
    payments: [],
    paidAmount: 0,
    remainingAmount: 499500
  }
];

export const MOCK_RETAIL_PRODUCTS: RetailProduct[] = [
  { id: 'RP-001', name: 'Daily Sunscreen SPF 50', category: 'Skincare', price: 185000, stock: 45, color: '#FFD700' },
  { id: 'RP-002', name: 'Hydrating Toner', category: 'Skincare', price: 120000, stock: 32, color: '#87CEEB' }
];

export const ROOMS = ['Room A (VIP)', 'Room B (Laser)', 'Room C (Facial)', 'Consultation 1'];

export const TODAY_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientId: 'P-001',
    patientName: 'Emma Wilson',
    treatment: 'Laser Rejuvenation',
    time: '10:00',
    date: new Date(),
    doctor: 'Dr. Sarah',
    status: AppointmentStatus.CHECKED_IN,
    avatarUrl: 'https://picsum.photos/id/64/100/100',
    room: 'Room B (Laser)'
  }
];

export const REVENUE_DATA = [
  { name: 'Mon', value: 12000000 },
  { name: 'Tue', value: 18000000 },
  { name: 'Wed', value: 15000000 },
  { name: 'Thu', value: 22000000 },
  { name: 'Fri', value: 28000000 },
  { name: 'Sat', value: 35000000 },
  { name: 'Sun', value: 19000000 },
];

export const DOCTOR_COMMISSION_DATA = [
  { name: 'Mon', value: 1500000 },
  { name: 'Tue', value: 2800000 },
  { name: 'Wed', value: 1200000 },
  { name: 'Thu', value: 3500000 },
  { name: 'Fri', value: 4100000 },
  { name: 'Sat', value: 5200000 },
  { name: 'Sun', value: 2100000 },
];

export const TOP_REVENUE_TREATMENTS = [
  { name: 'Laser Rejuvenation', revenue: 174000000, count: 145, percentage: 100 },
  { name: 'Botox Injection', revenue: 97500000, count: 65, percentage: 56 }
];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'INV-001', sku: 'SKU-001', name: 'Nutriplus Gel', category: 'Consumable', unit: 'Tube', currentStock: 120, minStock: 20, buyPrice: 120000, sellPrice: 188500, supplierName: 'PT. Derma Indo', status: 'Active', lastUpdated: new Date() }
];

export const MOCK_STOCK_LOGS: StockMovement[] = [
  { id: 'LOG-001', date: new Date(), type: 'OUT', itemId: 'INV-001', itemName: 'Nutriplus Gel', qty: 2, reason: 'Treatment', actor: 'Dr. Sarah' }
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-001', date: new Date(), supplier: 'PT. Derma Indo', status: 'Draft', totalAmount: 12500000, itemsCount: 4 }
];

export const MOCK_PROCEDURES: Procedure[] = [
  {
    id: 'PRC-001',
    code: 'BOT-50',
    name: 'Botox Injection (50 Units)',
    category: 'Injectable',
    status: 'Active',
    items: [],
    materialCost: 5500,
    doctorFee: 500000,
    adminFee: 25000,
    totalCost: 540500,
    marginPercent: 122,
    finalPrice: 1200000,
    updatedAt: new Date()
  }
];

export const MOCK_PACKAGES: PackageMaster[] = [
    {
        id: 'PKG-001',
        code: 'ACNE-WAR-10',
        name: 'Acne Warrior Package (10x)',
        totalPrice: 3500000,
        validityDays: 365,
        items: [{ procedureId: 'PRC-002', procedureName: 'Korean Glow Facial', unitCount: 5 }],
        status: 'Active'
    }
];

export const MOCK_LOYALTY_TIERS: LoyaltyTier[] = [
    { id: 'TIER-1', name: 'Silver', minSpend: 0, color: 'bg-gray-100 border-gray-300 text-gray-700', benefits: ['1 pt per Rp 10k'] }
];

export const MOCK_PROMOTIONS: Promotion[] = [
    { id: 'PRM-001', name: '10.10 Double Date Sale', type: 'Discount', targetTier: 'All', value: 10, valueType: 'Percent', startDate: new Date('2023-10-10'), endDate: new Date('2023-10-12'), status: 'Expired', usageCount: 45 }
];

export const MOCK_WALLET_LOGS: WalletLog[] = [
    { id: 'WL-001', date: new Date(), patientId: 'P-001', patientName: 'Emma Wilson', type: 'Top Up', amount: 1000000, balanceAfter: 2500000, notes: 'Topup' }
];

export const MOCK_STAFF: Staff[] = [
  { id: 'ST-001', name: 'Dr. Sarah', role: 'Doctor', phone: '08122334455', status: 'Active', specialization: 'Dermatologist', avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Lee' }
];

export const MOCK_SHIFTS: Shift[] = [
  { id: 'SH-001', staffId: 'ST-001', staffName: 'Dr. Sarah', staffRole: 'Doctor', date: new Date(), startTime: '09:00', endTime: '17:00', location: 'Room B', isRecurring: true }
];