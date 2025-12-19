
import { 
  LayoutDashboard, 
  CalendarClock, 
  UserRound, 
  CreditCard, 
  PackageSearch, 
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
  TicketPercent, 
  Megaphone 
} from 'lucide-react';
import { MenuGroup, Appointment, AppointmentStatus, Patient, MedicalRecord, Treatment, TreatmentStatus, Invoice, InvoiceStatus, PaymentMethodType, RetailProduct, InventoryItem, StockMovement, PurchaseOrder, LoyaltyTier, Promotion, Voucher, WalletLog, Staff, Shift, Procedure, PackageMaster, WhatsAppTemplate } from './types';

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
    nik: '3171234567890002',
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
  },
  { 
    id: 'P-003', 
    nik: '3171234567890003',
    name: 'Sophia Miller', 
    phone: '081345678901', 
    dob: '1992-08-30', 
    gender: 'Female',
    tier: 'Silver',
    lastVisit: new Date('2023-10-10'),
    lastDoctor: 'Dr. James',
    avatarUrl: 'https://picsum.photos/id/66/100/100',
    walletBalance: 50000,
    activeVouchers: 1,
    loyaltyPoints: 120
  },
  { 
    id: 'P-004', 
    nik: '3171234567890004',
    name: 'Isabella Davis', 
    phone: '081122334455', 
    dob: '1990-02-14', 
    gender: 'Female',
    tier: 'Platinum',
    lastVisit: new Date('2023-10-22'),
    lastDoctor: 'Dr. A. Wijaya',
    avatarUrl: 'https://picsum.photos/id/68/100/100',
    walletBalance: 1200000,
    loyaltyPoints: 3400
  },
  { 
    id: 'P-005', 
    nik: '3171234567890005',
    name: 'Charlotte Garcia', 
    phone: '081555666777', 
    dob: '1985-06-19', 
    gender: 'Female',
    tier: 'Silver',
    lastVisit: new Date('2023-08-05'),
    lastDoctor: 'Dr. James',
    avatarUrl: 'https://picsum.photos/id/76/100/100',
    loyaltyPoints: 50
  },
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
    complaint: 'Dull skin and redness after sun exposure.',
    diagnosis: 'Mild Erythema',
    plan: 'Laser Genesis 14J/cm2, Cooling Mask',
    isFinalized: false
  },
  {
    id: 'TRT-2023-002',
    patientId: 'P-003',
    patientName: 'Sophia Miller',
    date: new Date(),
    doctorName: 'Dr. James',
    type: 'Korean Glow Facial',
    status: TreatmentStatus.WAITING,
    room: 'Room C (Facial)',
    isFinalized: false
  },
  {
    id: 'TRT-2023-003',
    patientId: 'P-005',
    patientName: 'Charlotte Garcia',
    date: new Date(new Date().setHours(9, 0, 0, 0)), 
    doctorName: 'Dr. Sarah',
    type: 'Microdermabrasion',
    status: TreatmentStatus.COMPLETED,
    room: 'Room C (Facial)',
    complaint: 'Rough texture',
    diagnosis: 'Dead skin cell buildup',
    proceduresDone: 'Diamond peel performed. Extracted comedones.',
    productsUsed: [
      { id: 'PROD-1', name: 'Soothing Toner', type: 'Retail', quantity: 5, unit: 'ml'},
      { id: 'PROD-2', name: 'Disposable Sponge', type: 'Retail', quantity: 2, unit: 'pcs'}
    ],
    isFinalized: true
  }
];

export const MOCK_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'MR-2023-001',
    patientId: 'P-001',
    date: '2023-10-20',
    doctorName: 'Dr. Sarah',
    treatmentType: 'Laser Rejuvenation',
    diagnosis: 'Hyperpigmentation & Mild Acne Scars',
    clinicalNotes: 'Patient complained of dull skin. Mild redness observed post-procedure. Advised sunscreen usage.',
    treatmentPlan: 'Laser Genesis 14J/cm2, 2 passes.',
    procedureNotes: 'Performed Laser Genesis. Spot treatment on cheeks. Applied cooling gel.',
    procedures: ['Laser Rejuvenation', 'Calming Mask'],
    prescriptions: ['Sunscreen SPF 50', 'Post-Laser Cream'],
    photos: [
      { before: 'https://picsum.photos/id/100/200/200', after: 'https://picsum.photos/id/101/200/200' }
    ]
  },
  {
    id: 'MR-2023-002',
    patientId: 'P-001',
    date: '2023-09-10',
    doctorName: 'Dr. Sarah',
    treatmentType: 'Chemical Peel',
    diagnosis: 'Uneven Skin Tone',
    clinicalNotes: 'Skin looks congested. Patient wants brighter tone.',
    treatmentPlan: '20% Glycolic Acid Peel, 3 mins.',
    procedureNotes: 'Applied peel. Neutralized after 3 mins. No adverse reaction.',
    procedures: ['Glycolic Acid Peel'],
    prescriptions: ['Soothing Gel'],
    photos: []
  },
  {
     id: 'MR-2023-003',
     patientId: 'P-004',
     date: '2023-10-22',
     doctorName: 'Dr. A. Wijaya',
     treatmentType: 'Botox Injection',
     diagnosis: 'Dynamic wrinkles on forehead',
     clinicalNotes: 'Deep wrinkles visible on frown.',
     treatmentPlan: 'Botox 20 units total. Frontalis and Glabella.',
     procedureNotes: 'Injected 20 units. Patient tolerated procedure well. Ice pack applied.',
     procedures: ['Botox Injection (20U)'],
     prescriptions: [],
     photos: [ { before: 'https://picsum.photos/id/200/200/200', after: 'https://picsum.photos/id/201/200/200' }]
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-231024-001',
    date: new Date(),
    patientId: 'P-005',
    patientName: 'Charlotte Garcia',
    patientTier: 'Silver',
    doctorName: 'Dr. Sarah',
    status: InvoiceStatus.UNPAID,
    items: [
      { id: 'ITM-1', name: 'Microdermabrasion', type: 'Treatment', quantity: 1, unitPrice: 450000, subtotal: 450000 },
      { id: 'ITM-2', name: 'Soothing Toner', type: 'Product', quantity: 1, unitPrice: 150000, subtotal: 150000 },
      { id: 'ITM-3', name: 'Admin Fee', type: 'Admin', quantity: 1, unitPrice: 15000, subtotal: 15000 },
    ],
    subtotal: 615000,
    taxAmount: 61500, // 10%
    totalAmount: 676500,
    payments: [],
    paidAmount: 0,
    remainingAmount: 676500
  },
  {
    id: 'INV-231024-002',
    date: new Date(new Date().setHours(11, 0, 0, 0)),
    patientId: 'P-001',
    patientName: 'Emma Wilson',
    patientTier: 'Platinum',
    doctorName: 'Dr. Sarah',
    status: InvoiceStatus.PAID,
    items: [
      { id: 'ITM-4', name: 'Laser Rejuvenation', type: 'Treatment', quantity: 1, unitPrice: 1200000, subtotal: 1200000 },
    ],
    subtotal: 1200000,
    taxAmount: 120000,
    totalAmount: 1320000,
    payments: [
      { method: PaymentMethodType.WALLET, amount: 1000000 },
      { method: PaymentMethodType.CASH, amount: 320000 }
    ],
    paidAmount: 1320000,
    remainingAmount: 0
  }
];

export const MOCK_RETAIL_PRODUCTS: RetailProduct[] = [
  { id: 'RP-001', name: 'Daily Sunscreen SPF 50', category: 'Skincare', price: 185000, stock: 45, color: '#FFD700' },
  { id: 'RP-002', name: 'Hydrating Toner', category: 'Skincare', price: 120000, stock: 32, color: '#87CEEB' },
  { id: 'RP-003', name: 'Vitamin C Serum', category: 'Skincare', price: 250000, stock: 15, color: '#FFA500' },
  { id: 'RP-004', name: 'Acne Patch Pack', category: 'Skincare', price: 55000, stock: 100, color: '#98FB98' },
  { id: 'RP-005', name: 'Collagen Drink Box', category: 'Supplement', price: 350000, stock: 20, color: '#FFB6C1' },
  { id: 'RP-006', name: 'Whitening Supplement', category: 'Supplement', price: 450000, stock: 12, color: '#E6E6FA' },
  { id: 'RP-007', name: 'Home Peeling Kit', category: 'Kit', price: 500000, stock: 8, color: '#D3D3D3' },
  { id: 'RP-008', name: 'Esthirae Tote Bag', category: 'Merchandise', price: 85000, stock: 50, color: '#F5F5DC' },
];

export const ROOMS = ['Room A (VIP)', 'Room B (Laser)', 'Room C (Facial)', 'Consultation 1'];

export const TODAY_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientId: 'P-001',
    patientName: 'Emma Wilson',
    treatment: 'Laser Rejuvenation (Full Face)',
    time: '10:00',
    date: new Date(),
    doctor: 'Dr. Sarah',
    status: AppointmentStatus.CHECKED_IN,
    avatarUrl: 'https://picsum.photos/id/64/100/100',
    room: 'Room B (Laser)'
  },
  {
    id: '2',
    patientId: 'P-002',
    patientName: 'Olivia Brown',
    treatment: 'Botox Injection (3 Areas)',
    time: '11:00',
    date: new Date(),
    doctor: 'Dr. Sarah',
    status: AppointmentStatus.REQUESTED,
    avatarUrl: 'https://picsum.photos/id/65/100/100',
    room: 'Room A (VIP)'
  },
  {
    id: '3',
    patientId: 'P-003',
    patientName: 'Sophia Miller',
    treatment: 'Korean Glow Facial',
    time: '13:00',
    date: new Date(),
    doctor: 'Dr. James',
    status: AppointmentStatus.CONFIRMED,
    avatarUrl: 'https://picsum.photos/id/66/100/100',
    room: 'Room C (Facial)'
  },
  {
    id: '4',
    patientId: 'P-004',
    patientName: 'Isabella Davis',
    treatment: 'Slimming Consultation',
    time: '14:00',
    date: new Date(),
    doctor: 'Dr. James',
    status: AppointmentStatus.CONFIRMED,
    avatarUrl: 'https://picsum.photos/id/68/100/100',
    room: 'Consultation 1'
  },
   {
    id: '5',
    patientId: 'P-005',
    patientName: 'Charlotte Garcia',
    treatment: 'Microdermabrasion',
    time: '16:00',
    date: new Date(),
    doctor: 'Dr. Sarah',
    status: AppointmentStatus.CONFIRMED,
    avatarUrl: 'https://picsum.photos/id/76/100/100',
    room: 'Room C (Facial)'
  }
];

export const REVENUE_DATA = [
  { name: 'Mon', value: 12000 },
  { name: 'Tue', value: 18000 },
  { name: 'Wed', value: 15000 },
  { name: 'Thu', value: 22000 },
  { name: 'Fri', value: 28000 },
  { name: 'Sat', value: 35000 },
  { name: 'Sun', value: 19000 },
];

// New Data for Doctor Commission
export const DOCTOR_COMMISSION_DATA = [
  { name: 'Mon', value: 1500000 },
  { name: 'Tue', value: 2800000 },
  { name: 'Wed', value: 1200000 },
  { name: 'Thu', value: 3500000 },
  { name: 'Fri', value: 4100000 },
  { name: 'Sat', value: 5200000 },
  { name: 'Sun', value: 2100000 },
];

export const TREATMENT_DISTRIBUTION = [
  { name: 'Laser & Light', value: 400 },
  { name: 'Injectables', value: 300 },
  { name: 'Facials', value: 300 },
  { name: 'Body Contouring', value: 100 },
];

// New Data for Top Revenue Treatments
export const TOP_REVENUE_TREATMENTS = [
  { name: 'Laser Rejuvenation', revenue: 174000000, count: 145, percentage: 100 },
  { name: 'Botox Injection', revenue: 97500000, count: 65, percentage: 56 },
  { name: 'HIFU Facelift', revenue: 45000000, count: 15, percentage: 25 },
  { name: 'Korean Glow Facial', revenue: 49000000, count: 98, percentage: 28 },
  { name: 'Slimming Drip', revenue: 24000000, count: 32, percentage: 13 },
];

// --- Inventory Mock Data ---

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'INV-001', sku: 'SKU-001', name: 'Nutriplus Gel', category: 'Consumable', unit: 'Tube', currentStock: 120, minStock: 20, buyPrice: 120000, sellPrice: 188500, supplierName: 'PT. Derma Indo', status: 'Active', lastUpdated: new Date() },
  { id: 'INV-002', sku: 'SKU-002', name: 'Antibiotic Powder', category: 'Raw Material', unit: 'gr', currentStock: 500, minStock: 100, buyPrice: 8000, sellPrice: 15000, supplierName: 'PT. Medika Farma', status: 'Active', lastUpdated: new Date() },
  { id: 'INV-003', sku: 'SKU-003', name: 'Sterile Water', category: 'Consumable', unit: 'ml', currentStock: 15, minStock: 20, buyPrice: 2000, sellPrice: 5000, supplierName: 'PT. Medika Farma', status: 'Active', lastUpdated: new Date() },
  { id: 'INV-004', sku: 'SKU-004', name: 'Vitamin C Serum', category: 'Retail', unit: 'ml', currentStock: 8, minStock: 10, buyPrice: 150000, sellPrice: 250000, supplierName: 'PT. Glow Asia', status: 'Active', lastUpdated: new Date() },
  { id: 'INV-005', sku: 'SKU-005', name: 'Sunscreen SPF 50', category: 'Retail', unit: 'Tube', currentStock: 45, minStock: 15, buyPrice: 95000, sellPrice: 185000, supplierName: 'PT. Derma Indo', status: 'Active', lastUpdated: new Date() },
  { id: 'INV-006', sku: 'SKU-006', name: 'Disposable Syringe 3cc', category: 'Equipment', unit: 'Pcs', currentStock: 0, minStock: 50, buyPrice: 1500, sellPrice: 0, supplierName: 'PT. Alat Kes', status: 'Active', lastUpdated: new Date() },
];

export const MOCK_STOCK_LOGS: StockMovement[] = [
  { id: 'LOG-001', date: new Date(), type: 'OUT', itemId: 'INV-001', itemName: 'Nutriplus Gel', qty: 2, reason: 'Treatment TRT-2023-001', actor: 'Dr. Sarah' },
  { id: 'LOG-002', date: new Date(), type: 'IN', itemId: 'INV-005', itemName: 'Sunscreen SPF 50', qty: 50, reason: 'Purchase PO-2023-088', actor: 'Admin Gudang' },
  { id: 'LOG-003', date: new Date(Date.now() - 86400000), type: 'OUT', itemId: 'INV-004', itemName: 'Vitamin C Serum', qty: 1, reason: 'Retail Sales', actor: 'Kasir' },
  { id: 'LOG-004', date: new Date(Date.now() - 172800000), type: 'ADJUSTMENT', itemId: 'INV-003', itemName: 'Sterile Water', qty: -2, reason: 'Opname: Broken Bottle', actor: 'Admin Gudang' },
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-2023-090', date: new Date(), supplier: 'PT. Derma Indo', status: 'Draft', totalAmount: 12500000, itemsCount: 4 },
  { id: 'PO-2023-089', date: new Date(Date.now() - 86400000), supplier: 'PT. Medika Farma', status: 'Received', totalAmount: 4500000, itemsCount: 2 },
];

// --- Procedures Mock Data (New) ---

export const MOCK_PROCEDURES: Procedure[] = [
  {
    id: 'PRC-001',
    code: 'BOT-50',
    name: 'Botox Injection (50 Units)',
    category: 'Injectable',
    description: 'Wrinkle reduction treatment for upper face.',
    status: 'Active',
    items: [
      { itemId: 'INV-006', itemName: 'Disposable Syringe 3cc', type: 'Consumable', quantity: 1, unit: 'Pcs', unitCost: 1500, subtotal: 1500 },
      { itemId: 'INV-003', itemName: 'Sterile Water', type: 'Consumable', quantity: 2, unit: 'ml', unitCost: 2000, subtotal: 4000 }
    ],
    materialCost: 5500,
    doctorFee: 500000,
    adminFee: 25000,
    otherCost: 10000,
    totalCost: 540500,
    marginPercent: 122, // Approx
    finalPrice: 1200000,
    updatedAt: new Date()
  },
  {
    id: 'PRC-002',
    code: 'FAC-GLOW',
    name: 'Korean Glow Facial',
    category: 'Facial',
    description: 'Deep cleansing and brightening facial.',
    status: 'Active',
    items: [
      { itemId: 'INV-001', itemName: 'Nutriplus Gel', type: 'Consumable', quantity: 0.2, unit: 'Tube', unitCost: 120000, subtotal: 24000 },
    ],
    materialCost: 24000,
    doctorFee: 150000,
    adminFee: 15000,
    totalCost: 189000,
    marginPercent: 138,
    finalPrice: 450000,
    updatedAt: new Date()
  }
];

// --- Package Mock Data (New) ---

export const MOCK_PACKAGES: PackageMaster[] = [
    {
        id: 'PKG-001',
        code: 'ACNE-WAR-10',
        name: 'Acne Warrior Package (10x)',
        totalPrice: 3500000,
        validityDays: 365,
        items: [
            { procedureId: 'PRC-002', procedureName: 'Korean Glow Facial', unitCount: 5 },
            // In real app, would link to an Acne specific procedure
        ],
        description: 'Complete acne resolution kit. Includes 5 facials and medications.',
        status: 'Active',
        totalNormalPrice: 4500000,
        savingsPercent: 22
    },
    {
        id: 'PKG-002',
        code: 'GLOW-UP-3',
        name: 'Instant Glow Up (3x)',
        totalPrice: 1200000,
        validityDays: 90,
        items: [
            { procedureId: 'PRC-002', procedureName: 'Korean Glow Facial', unitCount: 3 }
        ],
        description: 'Short term booster pack.',
        status: 'Active',
        totalNormalPrice: 1350000,
        savingsPercent: 11
    }
];

// --- CRM Mock Data ---

export const MOCK_LOYALTY_TIERS: LoyaltyTier[] = [
    { id: 'TIER-1', name: 'Silver', minSpend: 0, color: 'bg-gray-100 border-gray-300 text-gray-700', benefits: ['1 pt per Rp 10k', 'Standard Booking'] },
    { id: 'TIER-2', name: 'Gold', minSpend: 15000000, color: 'bg-amber/10 border-amber/30 text-amber', benefits: ['1.5 pts per Rp 10k', '5% Discount Product', 'Birthday Voucher Rp 200k'] },
    { id: 'TIER-3', name: 'Platinum', minSpend: 50000000, color: 'bg-[#e5e4e2] border-gray-400 text-gray-800', benefits: ['2 pts per Rp 10k', '10% Discount All', 'Priority Booking', 'Free Consultation'] },
];

export const MOCK_PROMOTIONS: Promotion[] = [
    { id: 'PRM-001', name: '10.10 Double Date Sale', type: 'Discount', targetTier: 'All', value: 10, valueType: 'Percent', startDate: new Date('2023-10-10'), endDate: new Date('2023-10-12'), status: 'Expired', usageCount: 45 },
    { id: 'PRM-002', name: 'Gold Member Exclusive', type: 'Discount', targetTier: 'Gold', value: 15, valueType: 'Percent', startDate: new Date('2023-10-01'), endDate: new Date('2023-10-31'), status: 'Active', usageCount: 12 },
    { id: 'PRM-003', name: 'New Arrival Cashback', type: 'Cashback', targetTier: 'All', value: 50000, valueType: 'Nominal', startDate: new Date('2023-10-20'), endDate: new Date('2023-11-20'), status: 'Active', usageCount: 5 },
];

export const MOCK_VOUCHERS: Voucher[] = [
    { id: 'V-001', code: 'WELCOME50', name: 'Welcome Voucher', type: 'Nominal', value: 50000, minTransaction: 500000, expiryDate: new Date('2023-12-31'), status: 'Active' },
    { id: 'V-002', code: 'BDAY-EMMA', name: 'Birthday Treat', type: 'Percent', value: 20, expiryDate: new Date('2023-05-12'), status: 'Used', patientId: 'P-001' }
];

export const MOCK_WALLET_LOGS: WalletLog[] = [
    { id: 'WL-001', date: new Date(), patientId: 'P-001', patientName: 'Emma Wilson', type: 'Top Up', amount: 1000000, balanceAfter: 2500000, notes: 'Promo Topup October' },
    { id: 'WL-002', date: new Date(Date.now() - 86400000), patientId: 'P-004', patientName: 'Isabella Davis', type: 'Payment', amount: -500000, balanceAfter: 1200000, notes: 'Payment for Invoice #INV-231024-002' }
];

// --- Staff & Shift Mock Data ---

export const MOCK_STAFF: Staff[] = [
  { id: 'ST-001', name: 'Dr. Sarah', role: 'Doctor', phone: '08122334455', status: 'Active', strNumber: 'STR-12345', sipNumber: 'SIP-54321', specialization: 'Dermatologist', avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Lee' },
  { id: 'ST-002', name: 'Dr. James', role: 'Doctor', phone: '08133445566', status: 'Active', strNumber: 'STR-67890', sipNumber: 'SIP-09876', specialization: 'Aesthetic GP', avatarUrl: 'https://ui-avatars.com/api/?name=James+Wong' },
  { id: 'ST-003', name: 'Dr. A. Wijaya', role: 'Doctor', phone: '08144556677', status: 'Active', strNumber: 'STR-11223', sipNumber: 'SIP-33221', specialization: 'Plastic Surgeon', avatarUrl: 'https://ui-avatars.com/api/?name=A+Wijaya' },
  { id: 'ST-004', name: 'Nurse Rina', role: 'Nurse', phone: '08155667788', status: 'Active', strNumber: 'STR-N-111', avatarUrl: 'https://ui-avatars.com/api/?name=Rina+Sari' },
  { id: 'ST-005', name: 'Therapist Maya', role: 'Therapist', phone: '08166778899', status: 'Active', avatarUrl: 'https://ui-avatars.com/api/?name=Maya' },
  { id: 'ST-006', name: 'Admin Budi', role: 'Admin', phone: '08177889900', status: 'Active', avatarUrl: 'https://ui-avatars.com/api/?name=Budi' },
];

export const MOCK_SHIFTS: Shift[] = [
  { id: 'SH-001', staffId: 'ST-001', staffName: 'Dr. Sarah', staffRole: 'Doctor', date: new Date(), startTime: '09:00', endTime: '17:00', location: 'Room B', isRecurring: true },
  { id: 'SH-002', staffId: 'ST-002', staffName: 'Dr. James', staffRole: 'Doctor', date: new Date(), startTime: '13:00', endTime: '20:00', location: 'Room C', isRecurring: true },
  { id: 'SH-003', staffId: 'ST-004', staffName: 'Nurse Rina', staffRole: 'Nurse', date: new Date(), startTime: '08:00', endTime: '16:00', location: 'General', isRecurring: true },
  { id: 'SH-004', staffId: 'ST-005', staffName: 'Therapist Maya', staffRole: 'Therapist', date: new Date(), startTime: '10:00', endTime: '18:00', location: 'Treatment Hall', isRecurring: true },
];
