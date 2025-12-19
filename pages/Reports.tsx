import React, { useState, useMemo, useEffect } from 'react';
import { 
    BarChart3, 
    TrendingUp, 
    Calendar, 
    FileText, 
    Download, 
    Printer, 
    Filter,
    Activity,
    CreditCard,
    Package,
    Wallet,
    ArrowUpRight,
    Users,
    AlertCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Search,
    Stethoscope,
    Clock,
    Sparkles
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
/* 
   FIX: Removed TREATMENT_DISTRIBUTION as it is not exported from constants.ts. 
   Also removed REVENUE_DATA as it is unused in this file. 
*/
import { MOCK_INVOICES, MOCK_WALLET_LOGS } from '../constants';
import { InvoiceStatus } from '../types';

type ReportTab = 'Dashboard' | 'Transactions' | 'Medical' | 'Inventory' | 'Loyalty';

// Mock Data for Charts
const WEEKLY_SALES_DATA = [
    { day: 'Mon', sales: 12000000, visits: 12 },
    { day: 'Tue', sales: 15500000, visits: 15 },
    { day: 'Wed', sales: 11000000, visits: 10 },
    { day: 'Thu', sales: 18000000, visits: 18 },
    { day: 'Fri', sales: 25000000, visits: 24 },
    { day: 'Sat', sales: 32000000, visits: 30 },
    { day: 'Sun', sales: 21000000, visits: 20 },
];

const TOP_TREATMENTS = [
    { name: 'Laser Rejuvenation', count: 45, revenue: 54000000 },
    { name: 'Korean Glow Facial', count: 32, revenue: 16000000 },
    { name: 'Botox Injection', count: 28, revenue: 42000000 },
    { name: 'Slimming Drip', count: 15, revenue: 11250000 },
];

// Mock Data specific for Medical Reports
const TOP_PROCEDURES_DETAILED = [
    { rank: 1, name: 'Laser Rejuvenation (Full Face)', category: 'Laser & Light', count: 145, revenue: 174000000, trend: 'up', avgTime: '45m' },
    { rank: 2, name: 'Korean Glow Facial', category: 'Facial', count: 98, revenue: 49000000, trend: 'up', avgTime: '60m' },
    { rank: 3, name: 'Botox Injection (3 Areas)', category: 'Injectable', count: 65, revenue: 97500000, trend: 'neutral', avgTime: '30m' },
    { rank: 4, name: 'Acne Peel', category: 'Facial', count: 54, revenue: 18900000, trend: 'down', avgTime: '30m' },
    { rank: 5, name: 'Slimming Drip', category: 'Body', count: 32, revenue: 24000000, trend: 'up', avgTime: '45m' },
    { rank: 6, name: 'Microdermabrasion', category: 'Facial', count: 28, revenue: 12600000, trend: 'neutral', avgTime: '45m' },
    { rank: 7, name: 'HIFU Facelift', category: 'Laser & Light', count: 15, revenue: 45000000, trend: 'up', avgTime: '90m' },
];

const DOCTOR_STATS = [
    { name: 'Dr. Sarah', role: 'Dermatologist', patients: 124, treatments: 156, utilization: 92 },
    { name: 'Dr. James', role: 'Aesthetic GP', patients: 98, treatments: 112, utilization: 85 },
    { name: 'Dr. A. Wijaya', role: 'Plastic Surgeon', patients: 45, treatments: 48, utilization: 70 },
    { name: 'Nurse Rina', role: 'Nurse (Facial)', patients: 80, treatments: 80, utilization: 88 },
];

const Reports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ReportTab>('Dashboard');
    
    // --- Global Date Filter State ---
    // Default to "This Month"
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const [startDate, setStartDate] = useState(startOfMonth.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);
    const [datePreset, setDatePreset] = useState('This Month');

    // --- Date Handlers ---
    const handlePresetChange = (preset: string) => {
        setDatePreset(preset);
        const today = new Date();
        let newStart = new Date();
        let newEnd = new Date();

        switch (preset) {
            case 'Today':
                // Start and End same as today
                break;
            case 'Yesterday':
                newStart.setDate(today.getDate() - 1);
                newEnd.setDate(today.getDate() - 1);
                break;
            case 'This Week':
                const day = today.getDay() || 7; // Get current day number, converting Sun. to 7
                if (day !== 1) newStart.setHours(-24 * (day - 1)); // Set to Monday
                break;
            case 'This Month':
                newStart = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'Last Month':
                newStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                newEnd = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            case 'Custom':
                return; // Do not touch dates, let user pick
        }

        setStartDate(newStart.toISOString().split('T')[0]);
        setEndDate(newEnd.toISOString().split('T')[0]);
    };

    // --- Sub-components for Tabs ---

    const ExecutiveDashboard = () => (
        <div className="space-y-8 animate-fade-in">
            {/* Top Cards KPI */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-soft border-t-4 border-t-soft-gold">
                    <div className="text-xs text-text-muted uppercase tracking-wide">Total Revenue</div>
                    <div className="text-2xl font-bold text-text-dark mt-2">Rp 485.500.000</div>
                    <div className="text-xs text-sage mt-2 flex items-center gap-1"><TrendingUp size={12}/> +12.5% vs prev period</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-soft border-t-4 border-t-lavender">
                    <div className="text-xs text-text-muted uppercase tracking-wide">Total Visits</div>
                    <div className="text-2xl font-bold text-text-dark mt-2">342</div>
                    <div className="text-xs text-text-muted mt-2">Avg 11 visits/day</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-soft border-t-4 border-t-blue-300">
                    <div className="text-xs text-text-muted uppercase tracking-wide">ATV (Avg Transaction)</div>
                    <div className="text-2xl font-bold text-text-dark mt-2">Rp 1.420.000</div>
                    <div className="text-xs text-sage mt-2 flex items-center gap-1"><TrendingUp size={12}/> +5% growth</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-soft border-t-4 border-t-sage">
                    <div className="text-xs text-text-muted uppercase tracking-wide">Repeat Patient Rate</div>
                    <div className="text-2xl font-bold text-text-dark mt-2">68%</div>
                    <div className="text-xs text-text-muted mt-2">High retention</div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-soft">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-text-dark text-lg">Revenue Trend</h3>
                        <div className="flex gap-2">
                            <span className="text-xs text-text-muted bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={WEEKLY_SALES_DATA}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d6b98c" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#d6b98c" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#8a8a8a', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8a8a8a', fontSize: 12}} tickFormatter={(val) => `${val/1000000}M`} />
                                <Tooltip 
                                    formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#d6b98c" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Performers */}
                <div className="bg-white p-6 rounded-xl shadow-soft flex flex-col">
                    <h3 className="font-bold text-text-dark text-lg mb-4">Top Treatments</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                        {TOP_TREATMENTS.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div>
                                    <div className="font-semibold text-sm text-text-dark">{item.name}</div>
                                    <div className="text-xs text-text-muted">{item.count} performed</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-sm text-soft-gold">Rp {(item.revenue/1000000).toFixed(1)}M</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 w-full py-2 text-sm text-soft-gold font-medium hover:bg-soft-gold/5 rounded-lg transition-colors">
                        View Full Report
                    </button>
                </div>
            </div>

            {/* Insight Alerts */}
            <div className="bg-amber/5 border border-amber/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-amber mt-0.5" size={20}/>
                <div>
                    <h4 className="font-bold text-amber text-sm">Operational Insights</h4>
                    <ul className="list-disc list-inside text-xs text-text-dark/70 mt-1 space-y-1">
                        <li>Stock Alert: <strong>Nutriplus Gel</strong> is below minimum level (15 units left).</li>
                        <li><strong>Dr. Sarah</strong> has a 95% utilization rate this week - consider opening more slots.</li>
                        <li><strong>Acne Peel Promo</strong> has low redemption (2 uses). Consider extending validity.</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    const TransactionReports = () => {
        // Local state for table
        const [currentPage, setCurrentPage] = useState(1);
        const [searchQuery, setSearchQuery] = useState('');
        const ITEMS_PER_PAGE = 5;

        // Filter Logic
        const filteredTransactions = useMemo(() => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Adjust end date to end of day
            end.setHours(23, 59, 59, 999);

            return MOCK_INVOICES.filter(inv => {
                const invDate = new Date(inv.date);
                const isDateInRange = invDate >= start && invDate <= end;
                const isMatchSearch = 
                    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    inv.patientName.toLowerCase().includes(searchQuery.toLowerCase());
                
                return isDateInRange && isMatchSearch;
            });
        }, [startDate, endDate, searchQuery]);

        // Pagination Logic
        const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
        const paginatedTransactions = filteredTransactions.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );

        // Reset to page 1 if filters change
        useEffect(() => {
            setCurrentPage(1);
        }, [startDate, endDate, searchQuery]);

        // Summary Calculations based on FILTERED data
        const summary = useMemo(() => {
            return filteredTransactions.reduce((acc, curr) => {
                acc.totalInvoiced += curr.totalAmount;
                if (curr.status === InvoiceStatus.PAID) acc.totalCollected += curr.totalAmount;
                if (curr.status === InvoiceStatus.UNPAID) acc.totalOutstanding += curr.totalAmount;
                // Simplified logic for discounts, assumes only item discounts for mock
                return acc;
            }, { totalInvoiced: 0, totalCollected: 0, totalOutstanding: 0 });
        }, [filteredTransactions]);

        return (
            <div className="bg-white rounded-xl shadow-soft overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gray-50/50 gap-4">
                    <div>
                        <h3 className="font-bold text-text-dark">Transaction History</h3>
                        <p className="text-xs text-text-muted mt-0.5">
                            Showing data from <span className="font-medium text-text-dark">{new Date(startDate).toLocaleDateString()}</span> to <span className="font-medium text-text-dark">{new Date(endDate).toLocaleDateString()}</span>
                        </p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                            <input 
                                type="text" 
                                placeholder="Search Invoice or Patient..." 
                                className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1 shrink-0">
                            <Download size={12}/> Export
                        </button>
                    </div>
                </div>
                
                {/* Summary Row */}
                <div className="grid grid-cols-3 border-b border-gray-100 bg-white">
                    <div className="p-4 border-r border-gray-100 text-center">
                        <div className="text-xs text-text-muted">Filtered Invoiced</div>
                        <div className="font-bold text-text-dark">Rp {summary.totalInvoiced.toLocaleString()}</div>
                    </div>
                    <div className="p-4 border-r border-gray-100 text-center">
                        <div className="text-xs text-text-muted">Collected (Paid)</div>
                        <div className="font-bold text-sage">Rp {summary.totalCollected.toLocaleString()}</div>
                    </div>
                    <div className="p-4 text-center">
                        <div className="text-xs text-text-muted">Outstanding (Unpaid)</div>
                        <div className="font-bold text-amber">Rp {summary.totalOutstanding.toLocaleString()}</div>
                    </div>
                </div>

                <div className="min-h-[300px]">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                            <tr>
                                <th className="px-6 py-4">Date / Invoice</th>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4 text-center">Payment</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedTransactions.map(inv => (
                                <tr key={inv.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-text-dark">{inv.id}</div>
                                        <div className="text-xs text-text-muted">{inv.date.toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-text-dark">{inv.patientName}</td>
                                    <td className="px-6 py-4 text-text-muted text-xs">
                                        {inv.items.length} items ({inv.items[0].name}...)
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium">
                                        Rp {inv.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center text-xs text-text-muted">
                                        {inv.payments.length > 0 ? inv.payments.map(p => p.method).join(', ') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                            inv.status === 'Paid' ? 'bg-sage/10 text-sage border-sage/30' : 
                                            inv.status === 'Unpaid' ? 'bg-amber/10 text-amber border-amber/30' : 
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {paginatedTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-text-muted">
                                        No transactions found for this period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="text-xs text-text-muted">
                        Showing {filteredTransactions.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16}/>
                        </button>
                        <span className="text-xs font-medium text-text-dark px-2">
                            Page {currentPage} of {Math.max(1, totalPages)}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage >= totalPages}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={16}/>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const MedicalReports = () => (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-soft border border-soft-gold/20 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-wide">Total Treatments</p>
                            <h3 className="text-2xl font-bold text-text-dark mt-1">428</h3>
                        </div>
                        <Activity size={20} className="text-soft-gold"/>
                    </div>
                    <div className="mt-4 text-xs text-text-muted">
                        Performed in selected period.
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-soft border border-lavender/30 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-wide">Unique Patients</p>
                            <h3 className="text-2xl font-bold text-text-dark mt-1">315</h3>
                        </div>
                        <Users size={20} className="text-lavender"/>
                    </div>
                    <div className="mt-4 text-xs text-text-muted">
                        Reach count excluding repeat visits.
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-soft border border-sage/30 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-wide">Avg. Duration</p>
                            <h3 className="text-2xl font-bold text-text-dark mt-1">45m</h3>
                        </div>
                        <Clock size={20} className="text-sage"/>
                    </div>
                    <div className="mt-4 text-xs text-text-muted">
                        Average time per treatment session.
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Treatments Table */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-soft overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                        <h3 className="font-bold text-text-dark flex items-center gap-2">
                            <Sparkles size={16} className="text-soft-gold"/> Most Frequent Treatments
                        </h3>
                        <button className="text-xs text-text-muted hover:text-soft-gold border border-gray-200 px-2 py-1 rounded">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                                <tr>
                                    <th className="px-5 py-3 w-10 text-center">#</th>
                                    <th className="px-5 py-3">Treatment Name</th>
                                    <th className="px-5 py-3">Category</th>
                                    <th className="px-5 py-3 text-center">Count</th>
                                    <th className="px-5 py-3 text-right">Revenue</th>
                                    <th className="px-5 py-3 text-center">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {TOP_PROCEDURES_DETAILED.map((proc) => (
                                    <tr key={proc.rank} className="hover:bg-gray-50/50">
                                        <td className="px-5 py-3 text-center font-bold text-text-muted text-xs">{proc.rank}</td>
                                        <td className="px-5 py-3">
                                            <div className="font-medium text-text-dark">{proc.name}</div>
                                            <div className="text-[10px] text-text-muted flex items-center gap-1">
                                                <Clock size={10}/> Avg: {proc.avgTime}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-xs bg-gray-100 text-text-muted px-2 py-0.5 rounded border border-gray-200">
                                                {proc.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center font-bold text-text-dark">{proc.count}</td>
                                        <td className="px-5 py-3 text-right text-text-muted text-xs">
                                            Rp {(proc.revenue/1000000).toFixed(1)}M
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            {proc.trend === 'up' && <TrendingUp size={14} className="text-sage mx-auto"/>}
                                            {proc.trend === 'down' && <TrendingUp size={14} className="text-rose rotate-180 mx-auto"/>}
                                            {proc.trend === 'neutral' && <span className="text-gray-300 text-xs">-</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Doctor Workload */}
                <div className="bg-white rounded-xl shadow-soft p-6 flex flex-col h-full">
                    <h3 className="font-bold text-text-dark mb-4 flex items-center gap-2">
                        <Stethoscope size={16} className="text-soft-gold"/> Doctor Workload
                    </h3>
                    <div className="flex-1 space-y-5">
                        {DOCTOR_STATS.map((doc, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-text-dark text-sm">{doc.name}</div>
                                        <div className="text-xs text-text-muted">{doc.role}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-text-dark">{doc.patients} pts</div>
                                        <div className="text-[10px] text-text-muted">{doc.treatments} procedures</div>
                                    </div>
                                </div>
                                {/* Utilization Bar */}
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${doc.utilization > 90 ? 'bg-rose' : 'bg-soft-gold'}`} 
                                        style={{width: `${doc.utilization}%`}}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-50">
                        <div className="text-xs text-text-muted flex justify-between mb-2">
                            <span>Target Utilization</span>
                            <span className="font-bold">85%</span>
                        </div>
                        <p className="text-[10px] text-text-muted italic">
                            *Utilization calculated based on available shift hours vs procedure duration.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const InventoryReports = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-blue-400">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs text-text-muted uppercase tracking-wide">Total Inventory Value</div>
                            <div className="text-xl font-bold text-text-dark mt-1">Rp 185.000.000</div>
                        </div>
                        <Package size={20} className="text-blue-400"/>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-rose">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs text-text-muted uppercase tracking-wide">Low Stock Items</div>
                            <div className="text-xl font-bold text-text-dark mt-1">5 SKUs</div>
                        </div>
                        <AlertCircle size={20} className="text-rose"/>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-amber">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs text-text-muted uppercase tracking-wide">Stock Discrepancy</div>
                            <div className="text-xl font-bold text-text-dark mt-1">Rp -450.000</div>
                            <div className="text-xs text-text-muted mt-1">Last Opname</div>
                        </div>
                        <Activity size={20} className="text-amber"/>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="font-bold text-text-dark mb-4">Slow Moving Products (Last 90 Days)</h3>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs font-semibold text-text-muted uppercase">
                        <tr>
                            <th className="px-4 py-3">Product Name</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3 text-center">Stock</th>
                            <th className="px-4 py-3 text-center">Sold Qty</th>
                            <th className="px-4 py-3 text-right">Value Stuck</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        <tr>
                            <td className="px-4 py-3 text-text-dark">Premium Anti-Aging Serum</td>
                            <td className="px-4 py-3 text-text-muted">Skincare</td>
                            <td className="px-4 py-3 text-center">12</td>
                            <td className="px-4 py-3 text-center">0</td>
                            <td className="px-4 py-3 text-right text-rose">Rp 18.000.000</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 text-text-dark">Body Slimming Gel</td>
                            <td className="px-4 py-3 text-text-muted">Retail</td>
                            <td className="px-4 py-3 text-center">45</td>
                            <td className="px-4 py-3 text-center">2</td>
                            <td className="px-4 py-3 text-right text-rose">Rp 6.750.000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    const LoyaltyReports = () => (
        <div className="bg-white rounded-xl shadow-soft overflow-hidden animate-fade-in">
             <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-text-dark">Loyalty & Wallet Analysis</h3>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Export Report</button>
                </div>
            </div>
            
            <div className="grid grid-cols-2 p-6 gap-8">
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-text-dark border-b border-gray-100 pb-2">Points Economy</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-text-muted">Points Issued</div>
                            <div className="text-lg font-bold text-soft-gold">125,400</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-text-muted">Points Redeemed</div>
                            <div className="text-lg font-bold text-sage">45,200</div>
                        </div>
                    </div>
                    <div className="text-xs text-text-muted italic">
                        * Redemption Rate: 36% (Healthy)
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-text-dark border-b border-gray-100 pb-2">Wallet Liability</h4>
                    <div className="p-3 bg-soft-gold/5 border border-soft-gold/20 rounded-lg">
                        <div className="text-xs text-text-muted">Total Customer Deposit Balance</div>
                        <div className="text-2xl font-bold text-soft-gold">Rp 42.500.000</div>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6">
                <h4 className="text-sm font-bold text-text-dark mb-3">Recent Wallet Transactions</h4>
                <table className="w-full text-left text-sm">
                    <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                        <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Patient</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {MOCK_WALLET_LOGS.slice(0, 5).map(log => (
                            <tr key={log.id}>
                                <td className="px-4 py-2 text-text-muted">{log.date.toLocaleDateString()}</td>
                                <td className="px-4 py-2 text-text-dark">{log.patientName}</td>
                                <td className="px-4 py-2">
                                    <span className={`text-xs px-2 py-0.5 rounded ${log.type === 'Top Up' ? 'bg-sage/10 text-sage' : 'bg-rose/10 text-rose'}`}>
                                        {log.type}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-right font-medium">{log.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-medium text-text-dark">Reports & Statistic</h1>
                    <p className="text-text-muted mt-1">Operational insights and financial analytics.</p>
                </div>
                
                {/* GLOBAL DATE FILTER */}
                <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm p-1">
                        <div className="relative border-r border-gray-200 pr-2 mr-2">
                            <select 
                                value={datePreset}
                                onChange={(e) => handlePresetChange(e.target.value)}
                                className="text-sm text-text-dark font-medium bg-transparent outline-none cursor-pointer pl-2 pr-6 py-2 appearance-none"
                            >
                                <option>Today</option>
                                <option>Yesterday</option>
                                <option>This Week</option>
                                <option>This Month</option>
                                <option>Last Month</option>
                                <option>Custom</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-1 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"/>
                        </div>
                        
                        <div className="flex items-center gap-2 px-2">
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => { setStartDate(e.target.value); setDatePreset('Custom'); }}
                                className="text-xs text-text-muted font-medium outline-none bg-transparent"
                            />
                            <span className="text-text-muted">-</span>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => { setEndDate(e.target.value); setDatePreset('Custom'); }}
                                className="text-xs text-text-muted font-medium outline-none bg-transparent"
                            />
                        </div>
                    </div>

                    <button className="bg-soft-gold text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-md hover:bg-[#cbad85] transition-all flex items-center gap-2 whitespace-nowrap">
                        <Download size={16} /> Export All
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
                {[
                    { id: 'Dashboard', icon: BarChart3, label: 'Executive Dashboard' },
                    { id: 'Transactions', icon: CreditCard, label: 'Financial Reports' },
                    { id: 'Medical', icon: Activity, label: 'Medical Operations' },
                    { id: 'Inventory', icon: Package, label: 'Inventory' },
                    { id: 'Loyalty', icon: Wallet, label: 'Loyalty & Promo' },
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ReportTab)}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'border-soft-gold text-soft-gold' 
                            : 'border-transparent text-text-muted hover:text-text-dark'
                        }`}
                    >
                        <tab.icon size={18}/> {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'Dashboard' && <ExecutiveDashboard />}
                {activeTab === 'Transactions' && <TransactionReports />}
                {activeTab === 'Medical' && <MedicalReports />}
                {activeTab === 'Inventory' && <InventoryReports />}
                {activeTab === 'Loyalty' && <LoyaltyReports />}
            </div>
        </div>
    );
};

export default Reports;