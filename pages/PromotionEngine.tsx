
import React, { useState } from 'react';
import { 
    TicketPercent, 
    Gift, 
    Zap, 
    Plus, 
    Search, 
    CalendarClock, 
    Target, 
    Pause, 
    Play, 
    MoreHorizontal,
    Box,
    ArrowRight,
    MessageCircle,
    Eye,
    Edit2,
    Trash2,
    FileText,
    Copy,
    ChevronLeft,
    ChevronRight,
    Smartphone,
    Image as ImageIcon,
    Link as LinkIcon,
    Send,
    Users,
    Clock,
    UserCheck,
    ListFilter,
    AlertCircle,
    CheckCheck,
    XCircle,
    BarChart2,
    ArrowLeft,
    CalendarDays
} from 'lucide-react';
import { MOCK_PROMOTIONS, MOCK_WHATSAPP_TEMPLATES } from '../constants';
import { Promotion, AutomationRule, WhatsAppTemplate, Patient } from '../types';
import CreatePromoModal from '../components/modals/CreatePromoModal';
import PromoUsageModal from '../components/modals/PromoUsageModal';
import CreateAutomationModal from '../components/modals/CreateAutomationModal';
import CreateTemplateModal from '../components/modals/CreateTemplateModal';
import PatientSelectionModal from '../components/modals/PatientSelectionModal';
import BlastReportModal from '../components/modals/BlastReportModal'; // NEW Import
import { useNavigate } from 'react-router-dom';

type PromoTab = 'Vouchers' | 'Automation' | 'WABlasting';

// --- Mock Data for Blast History (Expanded for Pagination) ---
const MOCK_BLAST_HISTORY = [
    { 
        id: 'BL-001', 
        name: '12.12 Flash Sale Reminder', 
        date: new Date('2023-12-11T10:00:00'), 
        segment: 'All Patients', 
        status: 'Completed',
        recipients: 450,
        stats: { sent: 448, read: 380, failed: 2 }
    },
    { 
        id: 'BL-002', 
        name: 'VIP Exclusive Dinner', 
        date: new Date('2023-11-20T14:00:00'), 
        segment: 'VIP / Whales', 
        status: 'Completed',
        recipients: 45,
        stats: { sent: 45, read: 40, failed: 0 }
    },
    { 
        id: 'BL-003', 
        name: 'New Year Glow Up', 
        date: new Date('2023-12-28T09:00:00'), 
        segment: 'Sleeping Beauty', 
        status: 'Scheduled',
        recipients: 120,
        stats: { sent: 0, read: 0, failed: 0 }
    },
    { 
        id: 'BL-004', 
        name: 'Monthly Newsletter Oct', 
        date: new Date('2023-10-01T09:00:00'), 
        segment: 'All Patients', 
        status: 'Completed',
        recipients: 420,
        stats: { sent: 418, read: 350, failed: 2 }
    },
    { 
        id: 'BL-005', 
        name: 'Botox Promo Alert', 
        date: new Date('2023-09-15T11:30:00'), 
        segment: 'Loyal Regulars', 
        status: 'Completed',
        recipients: 85,
        stats: { sent: 85, read: 70, failed: 0 }
    },
    { 
        id: 'BL-006', 
        name: 'Laser Resurfacing Launch', 
        date: new Date('2023-09-01T10:00:00'), 
        segment: 'VIP / Whales', 
        status: 'Completed',
        recipients: 50,
        stats: { sent: 50, read: 48, failed: 0 }
    },
    { 
        id: 'BL-007', 
        name: 'Birthday September', 
        date: new Date('2023-09-01T08:00:00'), 
        segment: 'Birthday', 
        status: 'Completed',
        recipients: 12,
        stats: { sent: 12, read: 10, failed: 0 }
    },
];

const INITIAL_AUTOMATIONS: AutomationRule[] = [
    {
        id: 'AUTO-1',
        name: 'Sleeping Beauty Re-activation',
        triggerType: 'Inactive Duration',
        triggerValue: '90',
        actionType: 'Send WhatsApp',
        actionValue: '"Hi [Name], we miss you! Come back for a Glow Facial and get 10% off..."',
        status: 'Active'
    },
    {
        id: 'AUTO-2',
        name: 'Birthday Treat',
        triggerType: 'Birthday',
        triggerValue: '7',
        actionType: 'Inject Voucher',
        actionValue: 'Voucher: "BDAY-TREAT" (20% Off)',
        status: 'Active'
    },
    {
        id: 'AUTO-3',
        name: 'Wallet Remainder Nudge',
        triggerType: 'Wallet Balance',
        triggerValue: '1000000',
        actionType: 'Send WhatsApp',
        actionValue: '"Don\'t forget you have balance left! Use it for..."',
        status: 'Paused'
    }
];

const PromotionEngine: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<PromoTab>('Vouchers');
    const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS);
    const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS);
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- Data State for Templates ---
    const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplate[]>(MOCK_WHATSAPP_TEMPLATES);

    // Modal States
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
    const [selectedPromoForDetail, setSelectedPromoForDetail] = useState<Promotion | null>(null);

    // Automation & Template Modal States
    const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false); // NEW
    const [selectedAuto, setSelectedAuto] = useState<AutomationRule | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

    // --- Voucher Handlers ---
    const handleCreatePromo = (newPromo: Promotion) => {
        setPromotions([newPromo, ...promotions]);
    }

    const togglePromoStatus = (id: string) => {
        setPromotions(prev => prev.map(p => {
            if (p.id === id) {
                const newStatus = p.status === 'Active' ? 'Paused' : 'Active';
                return { ...p, status: newStatus };
            }
            return p;
        }));
    };

    const handleViewUsage = (promo: Promotion) => {
        setSelectedPromoForDetail(promo);
        setIsUsageModalOpen(true);
    };

    // --- Automation Handlers ---
    const handleSaveAutomation = (rule: AutomationRule) => {
        if (automations.some(a => a.id === rule.id)) {
            // Edit
            setAutomations(prev => prev.map(a => a.id === rule.id ? rule : a));
        } else {
            // New
            setAutomations([rule, ...automations]);
        }
        setSelectedAuto(null);
    };

    const handleEditAuto = (rule: AutomationRule) => {
        setSelectedAuto(rule);
        setIsAutoModalOpen(true);
        setMenuOpenId(null);
    };

    const handleDeleteAuto = (id: string) => {
        if (window.confirm("Are you sure you want to delete this automation rule?")) {
            setAutomations(prev => prev.filter(a => a.id !== id));
        }
        setMenuOpenId(null);
    };

    const toggleAutoStatus = (id: string) => {
        setAutomations(prev => prev.map(a => {
            if (a.id === id) {
                return { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' };
            }
            return a;
        }));
        setMenuOpenId(null);
    };

    // --- Template Handlers ---
    const handleSaveTemplate = (newTemplate: WhatsAppTemplate) => {
        setWhatsappTemplates(prev => [...prev, newTemplate]);
        // Also update the global mock so other components using it might see it (optional if purely frontend state)
        MOCK_WHATSAPP_TEMPLATES.push(newTemplate);
        alert(`Template "${newTemplate.title}" created successfully!`);
    };

    const handleDeleteTemplate = (id: string) => {
        if (window.confirm("Delete this template?")) {
            setWhatsappTemplates(prev => prev.filter(t => t.id !== id));
        }
    };

    // --- Views ---

    const VouchersView = () => {
        // Pagination state
        const [voucherPage, setVoucherPage] = useState(1);
        const ITEMS_PER_PAGE = 5;

        const filteredPromos = promotions.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

        // Pagination Logic
        const totalVoucherPages = Math.ceil(filteredPromos.length / ITEMS_PER_PAGE);
        const paginatedVouchers = filteredPromos.slice(
            (voucherPage - 1) * ITEMS_PER_PAGE,
            voucherPage * ITEMS_PER_PAGE
        );

        return (
            <div className="space-y-6 animate-fade-in">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                     <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                            type="text" 
                            placeholder="Search promotions..." 
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setVoucherPage(1); // Reset to page 1 on search
                            }}
                        />
                     </div>
                     <button 
                        onClick={() => setIsPromoModalOpen(true)}
                        className="bg-soft-gold text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg hover:bg-[#cbad85] flex items-center gap-2 transition-all w-full md:w-auto justify-center"
                     >
                        <Plus size={18} /> Create Voucher
                     </button>
                 </div>

                 <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                            <tr>
                                <th className="px-6 py-4">Promotion Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Target Tier</th>
                                <th className="px-6 py-4 text-center">Value</th>
                                <th className="px-6 py-4">Valid Until</th>
                                <th className="px-6 py-4 text-center">Redeemed</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedVouchers.map(promo => (
                                <tr key={promo.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-text-dark">{promo.name}</div>
                                        <div className="text-[10px] text-text-muted font-mono">{promo.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                            promo.type === 'Discount' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                                            promo.type === 'Cashback' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                                            'bg-amber/10 text-amber border-amber/20'
                                        }`}>
                                            {promo.type === 'Discount' ? <TicketPercent size={12}/> : promo.type === 'Cashback' ? <WalletIcon size={12}/> : <Gift size={12}/>}
                                            {promo.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-text-dark font-medium">{promo.targetTier}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-text-dark">
                                        {promo.valueType === 'Percent' ? `${promo.value}%` : `Rp ${promo.value.toLocaleString()}`}
                                    </td>
                                    <td className="px-6 py-4 text-text-muted text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarClock size={14}/>
                                            {new Date(promo.endDate).toLocaleDateString('en-GB')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-bold text-text-dark">{promo.usageCount}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => togglePromoStatus(promo.id)}
                                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
                                                promo.status === 'Active' 
                                                ? 'bg-sage/10 text-sage hover:bg-sage/20 border border-sage/20' 
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
                                            }`}
                                        >
                                            {promo.status === 'Active' ? <Play size={10} fill="currentColor"/> : <Pause size={10} fill="currentColor"/>}
                                            {promo.status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleViewUsage(promo)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-text-muted hover:text-soft-gold hover:border-soft-gold transition-all shadow-sm"
                                                title="View Transaction History"
                                            >
                                                <Eye size={14}/> Detail
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPromos.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-text-muted italic">
                                        No promotions found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Voucher Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="text-xs text-text-muted">
                            Showing {(voucherPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(voucherPage * ITEMS_PER_PAGE, filteredPromos.length)} of {filteredPromos.length}
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setVoucherPage(Math.max(1, voucherPage - 1))}
                                disabled={voucherPage === 1}
                                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={16}/>
                            </button>
                            <span className="text-xs font-medium text-text-dark px-2">Page {voucherPage} of {Math.max(1, totalVoucherPages)}</span>
                            <button 
                                onClick={() => setVoucherPage(Math.min(totalVoucherPages, voucherPage + 1))}
                                disabled={voucherPage === totalVoucherPages || totalVoucherPages === 0}
                                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={16}/>
                            </button>
                        </div>
                    </div>
                 </div>
            </div>
        );
    };

    const AutomationView = () => {
        // Pagination state for Automations
        const [autoPage, setAutoPage] = useState(1);
        const [templatePage, setTemplatePage] = useState(1);
        const ITEMS_PER_PAGE = 5;

        // Automation Pagination Logic
        const totalAutoPages = Math.ceil(automations.length / ITEMS_PER_PAGE);
        const paginatedAutomations = automations.slice(
            (autoPage - 1) * ITEMS_PER_PAGE,
            autoPage * ITEMS_PER_PAGE
        );

        // Template Pagination Logic
        const totalTemplatePages = Math.ceil(whatsappTemplates.length / ITEMS_PER_PAGE);
        const paginatedTemplates = whatsappTemplates.slice(
            (templatePage - 1) * ITEMS_PER_PAGE,
            templatePage * ITEMS_PER_PAGE
        );

        return (
            <div className="space-y-8 animate-fade-in">
                <div className="bg-gradient-to-r from-text-dark to-[#434343] rounded-xl p-8 text-white flex flex-col md:flex-row justify-between items-center relative overflow-hidden gap-6 md:gap-0">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">Marketing Automation</h2>
                        <p className="text-white/70 max-w-lg">Set up "If This Then That" rules to engage patients automatically based on their behavior, birthday, or treatment history.</p>
                    </div>
                    <div className="relative z-10 flex gap-3">
                        <button 
                            onClick={() => setIsTemplateModalOpen(true)}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-white/20 flex items-center gap-2 transition-all"
                        >
                            <FileText size={18}/> New Template
                        </button>
                        
                        <button 
                            onClick={() => { setSelectedAuto(null); setIsAutoModalOpen(true); }}
                            className="bg-white text-text-dark px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-50 flex items-center gap-2 transition-all"
                        >
                            <Plus size={18}/> New Automation
                        </button>
                    </div>
                    <Zap size={150} className="absolute -right-10 -bottom-10 text-white/5 rotate-12"/>
                </div>

                {/* --- Automation Rules Table --- */}
                <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-ivory">
                        <h3 className="font-bold text-text-dark flex items-center gap-2">
                            <Zap size={18} className="text-soft-gold" /> Active Campaigns
                        </h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold text-text-muted uppercase">
                            <tr>
                                <th className="px-6 py-4">Automation Name</th>
                                <th className="px-6 py-4">Trigger</th>
                                <th className="px-6 py-4">Action Type</th>
                                <th className="px-6 py-4">Content / Value</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedAutomations.map((auto) => (
                                <tr key={auto.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-text-dark">{auto.name}</span>
                                        <div className="text-[10px] text-text-muted">{auto.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                                                {auto.triggerType}
                                            </span>
                                            <span className="text-sm font-bold text-text-dark">{auto.triggerValue}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-text-muted">{auto.actionType}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-text-muted truncate max-w-[200px] italic">
                                            "{auto.actionValue}"
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => toggleAutoStatus(auto.id)}
                                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
                                                auto.status === 'Active' 
                                                ? 'bg-sage/10 text-sage hover:bg-sage/20 border border-sage/20' 
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
                                            }`}
                                        >
                                            {auto.status === 'Active' ? <Play size={10} fill="currentColor"/> : <Pause size={10} fill="currentColor"/>}
                                            {auto.status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block">
                                            <button 
                                                onClick={() => setMenuOpenId(menuOpenId === auto.id ? null : auto.id)}
                                                className="p-2 text-gray-400 hover:text-text-dark rounded-full hover:bg-gray-100 transition-colors"
                                            >
                                                <MoreHorizontal size={18}/>
                                            </button>
                                            
                                            {/* Dropdown */}
                                            {menuOpenId === auto.id && (
                                                <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-10 overflow-hidden animate-fade-in">
                                                    <button 
                                                        onClick={() => handleEditAuto(auto)}
                                                        className="w-full text-left px-4 py-3 text-sm text-text-dark hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Edit2 size={14}/> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteAuto(auto.id)}
                                                        className="w-full text-left px-4 py-3 text-sm text-rose hover:bg-rose/5 flex items-center gap-2 border-t border-gray-50"
                                                    >
                                                        <Trash2 size={14}/> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {automations.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-text-muted italic">
                                        No automation rules defined.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                    {/* Automation Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="text-xs text-text-muted">
                            Showing {(autoPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(autoPage * ITEMS_PER_PAGE, automations.length)} of {automations.length}
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setAutoPage(Math.max(1, autoPage - 1))}
                                disabled={autoPage === 1}
                                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={16}/>
                            </button>
                            <span className="text-xs font-medium text-text-dark px-2">Page {autoPage} of {Math.max(1, totalAutoPages)}</span>
                            <button 
                                onClick={() => setAutoPage(Math.min(totalAutoPages, autoPage + 1))}
                                disabled={autoPage === totalAutoPages || totalAutoPages === 0}
                                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={16}/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- WhatsApp Templates Table --- */}
                <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-ivory">
                        <h3 className="font-bold text-text-dark flex items-center gap-2">
                            <MessageCircle size={18} className="text-green-600" /> WhatsApp Templates
                        </h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold text-text-muted uppercase">
                            <tr>
                                <th className="px-6 py-4">Template Name</th>
                                <th className="px-6 py-4">Preview Content</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedTemplates.map((template) => (
                                <tr key={template.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 align-top w-1/4">
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-soft-gold"/>
                                            <span className="font-bold text-text-dark">{template.title}</span>
                                        </div>
                                        <div className="text-[10px] text-text-muted ml-6 mt-1">{template.id}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap font-sans">
                                            {template.content}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                className="p-2 text-text-muted hover:text-text-dark hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Copy Text"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(template.content);
                                                    alert("Template copied to clipboard!");
                                                }}
                                            >
                                                <Copy size={16}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTemplate(template.id)}
                                                className="p-2 text-text-muted hover:text-rose hover:bg-rose/10 rounded-lg transition-colors"
                                                title="Delete Template"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {whatsappTemplates.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-10 text-center text-text-muted italic">
                                        No templates created yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Template Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="text-xs text-text-muted">
                            Showing {(templatePage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(templatePage * ITEMS_PER_PAGE, whatsappTemplates.length)} of {whatsappTemplates.length}
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setTemplatePage(Math.max(1, templatePage - 1))}
                                disabled={templatePage === 1}
                                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={16}/>
                            </button>
                            <span className="text-xs font-medium text-text-dark px-2">Page {templatePage} of {Math.max(1, totalTemplatePages)}</span>
                            <button 
                                onClick={() => setTemplatePage(Math.min(totalTemplatePages, templatePage + 1))}
                                disabled={templatePage === totalTemplatePages || totalTemplatePages === 0}
                                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={16}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const WAPromoBlastingView = () => {
        // Toggle between List and Create views
        const [blastViewMode, setBlastViewMode] = useState<'list' | 'create'>('list');

        // Blast Config State
        const [campaignName, setCampaignName] = useState('');
        
        // Target Mode: Segment vs Manual
        const [targetMode, setTargetMode] = useState<'Segment' | 'Manual'>('Segment');
        const [segment, setSegment] = useState('All');
        const [manualSelectedPatients, setManualSelectedPatients] = useState<Patient[]>([]);
        const [isPatientSelectModalOpen, setIsPatientSelectModalOpen] = useState(false);

        // Schedule State
        const [scheduleType, setScheduleType] = useState<'Now' | 'Scheduled'>('Now');
        const [scheduledTime, setScheduledTime] = useState('');

        const [campaignType, setCampaignType] = useState<'Voucher' | 'Flash Sale' | 'Text'>('Voucher');
        const [selectedVoucher, setSelectedVoucher] = useState('');
        const [messageBody, setMessageBody] = useState('');
        const [hasImage, setHasImage] = useState(false);
        const [buttons, setButtons] = useState([{ type: 'Url', text: 'Ambil Voucher' }, { type: 'Reply', text: 'Tanya CS' }]);

        // Report Modal State
        const [isReportModalOpen, setIsReportModalOpen] = useState(false);
        const [selectedBlastReport, setSelectedBlastReport] = useState<typeof MOCK_BLAST_HISTORY[0] | null>(null);

        // Blast Pagination State
        const [blastPage, setBlastPage] = useState(1);
        const BLAST_ITEMS_PER_PAGE = 5;

        // Blast Pagination Logic
        const totalBlastPages = Math.ceil(MOCK_BLAST_HISTORY.length / BLAST_ITEMS_PER_PAGE);
        const paginatedBlastHistory = MOCK_BLAST_HISTORY.slice(
            (blastPage - 1) * BLAST_ITEMS_PER_PAGE,
            blastPage * BLAST_ITEMS_PER_PAGE
        );

        // Helpers
        const activePromos = promotions.filter(p => p.status === 'Active');

        // Insert Variable
        const insertVar = (v: string) => setMessageBody(prev => prev + ` ${v}`);

        // Mock Preview Renderer
        const renderPreviewText = () => {
            let text = messageBody || "Halo {{customer_name}}, ...";
            text = text.replace('{{customer_name}}', 'Sari');
            text = text.replace('{{voucher_code}}', selectedVoucher ? 'GLOW12' : 'CODE123');
            return text;
        };

        const handleManualPatientConfirm = (selected: Patient[]) => {
            setManualSelectedPatients(selected);
        };

        const handleViewReport = (historyItem: typeof MOCK_BLAST_HISTORY[0]) => {
            setSelectedBlastReport(historyItem);
            setIsReportModalOpen(true);
        };

        // Estimate Cost Logic
        const recipientCount = targetMode === 'Manual' ? manualSelectedPatients.length : 120; // 120 is mock for segment
        const estimatedCost = recipientCount * 450;

        // --- Blast List View (History Table) ---
        if (blastViewMode === 'list') {
            return (
                <div className="space-y-6 animate-fade-in">
                    <BlastReportModal 
                        isOpen={isReportModalOpen}
                        onClose={() => setIsReportModalOpen(false)}
                        blastData={selectedBlastReport}
                    />

                    {/* Header */}
                    <div className="bg-gradient-to-r from-text-dark to-[#434343] rounded-xl p-8 text-white flex flex-col md:flex-row justify-between items-center relative overflow-hidden gap-6 md:gap-0">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">WhatsApp Promo Blast</h2>
                            <p className="text-white/70 max-w-lg">Send personalized offers to segmented audiences via official WhatsApp API.</p>
                        </div>
                        <div className="relative z-10 flex gap-3">
                            <button 
                                onClick={() => setBlastViewMode('create')}
                                className="bg-white text-text-dark px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-50 flex items-center gap-2 transition-all"
                            >
                                <Plus size={18}/> Create New Blast
                            </button>
                        </div>
                        <MessageCircle size={150} className="absolute -right-10 -bottom-10 text-white/5 rotate-12"/>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-soft border-l-4 border-sage">
                            <div className="text-xs text-text-muted uppercase tracking-wide">Total Messages Sent</div>
                            <div className="text-2xl font-bold text-text-dark mt-1">1,240</div>
                            <div className="text-xs text-sage mt-1 font-medium">98% Success Rate</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-soft border-l-4 border-blue-400">
                            <div className="text-xs text-text-muted uppercase tracking-wide">Avg. Read Rate</div>
                            <div className="text-2xl font-bold text-text-dark mt-1">82%</div>
                            <div className="text-xs text-blue-500 mt-1 font-medium">Within 2 hours</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-soft border-l-4 border-soft-gold">
                            <div className="text-xs text-text-muted uppercase tracking-wide">Credits Remaining</div>
                            <div className="text-2xl font-bold text-text-dark mt-1">Rp 450.000</div>
                            <div className="text-xs text-soft-gold mt-1 font-medium">~1,000 Messages</div>
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-ivory flex justify-between items-center">
                            <h3 className="font-bold text-text-dark flex items-center gap-2">
                                <BarChart2 size={18} className="text-soft-gold" /> Blast History
                            </h3>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                                <input 
                                    type="text" 
                                    placeholder="Search campaigns..." 
                                    className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-soft-gold"
                                />
                            </div>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs font-semibold text-text-muted uppercase">
                                <tr>
                                    <th className="px-6 py-4">Campaign Name</th>
                                    <th className="px-6 py-4">Target Audience</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Delivery Stats</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedBlastHistory.map((history) => (
                                    <tr key={history.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-text-dark">{history.name}</div>
                                            <div className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                                                <CalendarClock size={10}/> {history.date.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-text-dark">{history.segment}</span>
                                            <div className="text-xs text-text-muted">{history.recipients} Recipients</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                                history.status === 'Completed' ? 'bg-sage/10 text-sage border-sage/20' : 
                                                'bg-amber/10 text-amber border-amber/20'
                                            }`}>
                                                {history.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4 text-xs">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-text-muted flex items-center gap-1"><CheckCheck size={12} className="text-blue-500"/> Read</span>
                                                    <span className="font-bold text-text-dark">{history.stats.read}</span>
                                                </div>
                                                <div className="h-6 w-px bg-gray-200"></div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-text-muted flex items-center gap-1"><Send size={12} className="text-sage"/> Sent</span>
                                                    <span className="font-bold text-text-dark">{history.stats.sent}</span>
                                                </div>
                                                <div className="h-6 w-px bg-gray-200"></div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-text-muted flex items-center gap-1"><XCircle size={12} className="text-rose"/> Fail</span>
                                                    <span className="font-bold text-text-dark">{history.stats.failed}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleViewReport(history)}
                                                className="text-xs text-soft-gold hover:underline font-medium"
                                            >
                                                View Report
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Blast Pagination Controls */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                            <div className="text-xs text-text-muted">
                                Showing {(blastPage - 1) * BLAST_ITEMS_PER_PAGE + 1} to {Math.min(blastPage * BLAST_ITEMS_PER_PAGE, MOCK_BLAST_HISTORY.length)} of {MOCK_BLAST_HISTORY.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setBlastPage(Math.max(1, blastPage - 1))}
                                    disabled={blastPage === 1}
                                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={16}/>
                                </button>
                                <span className="text-xs font-medium text-text-dark px-2">Page {blastPage} of {Math.max(1, totalBlastPages)}</span>
                                <button 
                                    onClick={() => setBlastPage(Math.min(totalBlastPages, blastPage + 1))}
                                    disabled={blastPage === totalBlastPages || totalBlastPages === 0}
                                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={16}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // --- Blast Creation Form ---
        return (
            <div className="flex flex-col gap-6 animate-fade-in h-[calc(100vh-200px)]">
                {/* Nav Back */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setBlastViewMode('list')}
                        className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <ArrowLeft size={20} className="text-text-muted"/>
                    </button>
                    <h2 className="text-xl font-bold text-text-dark">Setup New Campaign</h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
                    {/* Patient Selection Modal */}
                    <PatientSelectionModal 
                        isOpen={isPatientSelectModalOpen}
                        onClose={() => setIsPatientSelectModalOpen(false)}
                        onConfirm={handleManualPatientConfirm}
                        initialSelection={manualSelectedPatients.map(p => p.id)}
                    />

                    {/* Left: Configuration Panel */}
                    <div className="flex-1 bg-white rounded-xl shadow-soft p-6 overflow-y-auto custom-scrollbar">
                        <h3 className="font-bold text-text-dark text-lg mb-6 flex items-center gap-2">
                            <MessageCircle size={20} className="text-green-600"/> Campaign Details
                        </h3>

                        <div className="space-y-6">
                            
                            {/* 1. Targeting */}
                            <div className="space-y-4 border-b border-gray-100 pb-6">
                                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide">1. Target & Type</h4>
                                <div className="grid grid-cols-2 gap-4 mb-2">
                                    <div>
                                        <label className="block text-xs font-medium text-text-dark mb-1.5">Campaign Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                                            placeholder="e.g. 12.12 Flash Sale"
                                            value={campaignName}
                                            onChange={e => setCampaignName(e.target.value)}
                                        />
                                    </div>
                                    
                                    {/* Target Mode Selector */}
                                    <div>
                                        <label className="block text-xs font-medium text-text-dark mb-1.5">Target Audience</label>
                                        <div className="flex bg-gray-100 p-1 rounded-lg">
                                            <button 
                                                onClick={() => setTargetMode('Segment')}
                                                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${targetMode === 'Segment' ? 'bg-white text-text-dark shadow-sm' : 'text-text-muted'}`}
                                            >
                                                By Segment
                                            </button>
                                            <button 
                                                onClick={() => setTargetMode('Manual')}
                                                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${targetMode === 'Manual' ? 'bg-white text-text-dark shadow-sm' : 'text-text-muted'}`}
                                            >
                                                Specific Patients
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Target Input */}
                                <div>
                                    {targetMode === 'Segment' ? (
                                        <select 
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                                            value={segment}
                                            onChange={e => setSegment(e.target.value)}
                                        >
                                            <option value="All">All Patients</option>
                                            <option value="Sleeping Beauty">Sleeping Beauty (Inactive &gt; 3mo)</option>
                                            <option value="VIP">VIP / High Spenders</option>
                                            <option value="Newbies">New Customers</option>
                                        </select>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => setIsPatientSelectModalOpen(true)}
                                                className="px-4 py-2 bg-white border border-gray-200 text-text-dark text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all"
                                            >
                                                <UserCheck size={16}/> {manualSelectedPatients.length > 0 ? 'Modify Selection' : 'Select Patients'}
                                            </button>
                                            
                                            {manualSelectedPatients.length > 0 ? (
                                                <div className="text-xs text-text-muted">
                                                    <span className="font-bold text-text-dark">{manualSelectedPatients.length}</span> patients selected
                                                </div>
                                            ) : (
                                                <div className="text-xs text-rose italic flex items-center gap-1">
                                                    <AlertCircle size={12}/> Please select patients
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Delivery Schedule */}
                                <div>
                                    <label className="block text-xs font-medium text-text-dark mb-1.5">Delivery Schedule</label>
                                    <div className="flex gap-2 mb-2">
                                        <button 
                                            onClick={() => setScheduleType('Now')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${scheduleType === 'Now' ? 'bg-white text-text-dark border-soft-gold shadow-sm' : 'bg-gray-50 text-text-muted border-gray-200 hover:bg-white'}`}
                                        >
                                            Send Now
                                        </button>
                                        <button 
                                            onClick={() => setScheduleType('Scheduled')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${scheduleType === 'Scheduled' ? 'bg-white text-text-dark border-soft-gold shadow-sm' : 'bg-gray-50 text-text-muted border-gray-200 hover:bg-white'}`}
                                        >
                                            Schedule for Later
                                        </button>
                                    </div>
                                    {scheduleType === 'Scheduled' && (
                                        <div className="relative animate-fade-in">
                                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                                            <input 
                                                type="datetime-local" 
                                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                                                value={scheduledTime}
                                                onChange={(e) => setScheduledTime(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Campaign Type Selection */}
                                <div>
                                    <label className="block text-xs font-medium text-text-dark mb-1.5">Option Campaign</label>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setCampaignType('Voucher')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${campaignType === 'Voucher' ? 'bg-soft-gold text-white border-soft-gold' : 'bg-white border-gray-200 text-text-muted hover:bg-gray-50'}`}
                                        >
                                            <TicketPercent size={14} className="inline mr-2"/> Voucher Blast
                                        </button>
                                        <button 
                                            onClick={() => setCampaignType('Flash Sale')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${campaignType === 'Flash Sale' ? 'bg-rose text-white border-rose' : 'bg-white border-gray-200 text-text-muted hover:bg-gray-50'}`}
                                        >
                                            <Zap size={14} className="inline mr-2"/> Flash Sale
                                        </button>
                                        <button 
                                            onClick={() => setCampaignType('Text')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${campaignType === 'Text' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-text-muted hover:bg-gray-50'}`}
                                        >
                                            <MessageCircle size={14} className="inline mr-2"/> General Info
                                        </button>
                                    </div>
                                </div>

                                {/* Dynamic Input based on Type */}
                                {campaignType === 'Voucher' && (
                                    <div>
                                        <label className="block text-xs font-medium text-text-dark mb-1.5">Select Active Voucher</label>
                                        <select 
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                                            value={selectedVoucher}
                                            onChange={e => setSelectedVoucher(e.target.value)}
                                        >
                                            <option value="">Select a promo...</option>
                                            {activePromos.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} ({p.valueType === 'Percent' ? `${p.value}%` : `Rp ${p.value}`})</option>
                                            ))}
                                        </select>
                                        <p className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                                            <LinkIcon size={10}/> Magic Link will be auto-generated.
                                        </p>
                                    </div>
                                )}
                                
                                {campaignType === 'Flash Sale' && (
                                    <div className="p-3 bg-rose/5 border border-rose/10 rounded-lg flex items-start gap-2">
                                        <Clock size={16} className="text-rose mt-0.5"/>
                                        <div>
                                            <div className="text-xs font-bold text-rose">Flash Sale Logic Enabled</div>
                                            <p className="text-[10px] text-text-muted">System will show "Stock Remaining" in message and enable "Remind Me" button.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. Visual & Content */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide">2. Media & Content</h4>
                                
                                {/* Image Upload Mock */}
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setHasImage(!hasImage)}>
                                    {hasImage ? (
                                        <div className="relative h-24 w-full bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                                            <img src="https://picsum.photos/400/200" alt="Banner" className="w-full h-full object-cover opacity-80"/>
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-medium text-sm">Change Banner</div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-text-muted">
                                            <ImageIcon size={24}/>
                                            <span className="text-xs">Click to upload header image (JPG/PNG)</span>
                                        </div>
                                    )}
                                </div>

                                {/* Message Editor */}
                                <div className="relative">
                                    <label className="block text-xs font-medium text-text-dark mb-1.5">Message Body</label>
                                    <textarea 
                                        rows={6}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold resize-none"
                                        placeholder="Halo {{customer_name}}, ..."
                                        value={messageBody}
                                        onChange={e => setMessageBody(e.target.value)}
                                    ></textarea>
                                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                                        <button onClick={() => insertVar('{{customer_name}}')} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-50">+ Name</button>
                                        <button onClick={() => insertVar('{{voucher_code}}')} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-50">+ Code</button>
                                        <button onClick={() => insertVar('{{promo_link}}')} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-50">+ Magic Link</button>
                                    </div>
                                </div>

                                {/* Buttons Config */}
                                <div>
                                    <label className="block text-xs font-medium text-text-dark mb-1.5">Interactive Buttons</label>
                                    <div className="space-y-2">
                                        {buttons.map((btn, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <span className="text-xs bg-gray-100 px-2 py-2 rounded text-text-muted w-16 text-center">{btn.type}</span>
                                                <input 
                                                    type="text" 
                                                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                                                    value={btn.text}
                                                    onChange={(e) => {
                                                        const newBtns = [...buttons];
                                                        newBtns[idx].text = e.target.value;
                                                        setButtons(newBtns);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                        {/* Action Bar */}
                        <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <div className="text-xs text-text-muted">
                                <span className="font-bold text-text-dark">Est. Cost:</span> Rp {estimatedCost.toLocaleString()} ({recipientCount} * 450)
                            </div>
                            <button 
                                className={`px-6 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all ${
                                    scheduleType === 'Scheduled' 
                                    ? 'bg-soft-gold text-white hover:bg-[#cbad85]' 
                                    : 'bg-green-600 text-white hover:bg-green-700 shadow-green-600/20'
                                }`}
                            >
                                {scheduleType === 'Scheduled' ? <CalendarClock size={16}/> : <Send size={16}/>}
                                {scheduleType === 'Scheduled' ? 'Schedule Campaign' : 'Blast Now'}
                            </button>
                        </div>
                    </div>

                    {/* Right: Phone Preview */}
                    <div className="w-full lg:w-[350px] flex items-center justify-center bg-gray-100 rounded-xl p-8 border border-gray-200">
                        <div className="w-[300px] h-[580px] bg-white rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden relative flex flex-col">
                            {/* Phone Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-800 rounded-b-xl z-20"></div>
                            
                            {/* WA Header */}
                            <div className="bg-[#075e54] h-16 w-full flex items-center px-4 pt-4 shrink-0 z-10">
                                <ChevronLeft className="text-white mr-1" size={20}/>
                                <div className="w-8 h-8 rounded-full bg-white mr-2 overflow-hidden">
                                    {/* Clinic Logo Placeholder */}
                                    <div className="w-full h-full bg-soft-gold flex items-center justify-center text-[10px] font-bold">E</div>
                                </div>
                                <div>
                                    <div className="text-white text-sm font-bold">Esthirae Clinic</div>
                                    <div className="text-white/70 text-[10px]">Official Business Account</div>
                                </div>
                            </div>

                            {/* WA Body */}
                            <div className="flex-1 bg-[#efe7dd] p-3 overflow-y-auto" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', opacity: 0.9 }}>
                                <div className="bg-white rounded-lg p-1 shadow-sm max-w-[85%] ml-auto relative">
                                    {/* Banner Image */}
                                    {hasImage && (
                                        <div className="w-full h-32 bg-gray-200 rounded-t-lg mb-1 overflow-hidden">
                                            <img src="https://picsum.photos/400/200" alt="Promo" className="w-full h-full object-cover"/>
                                        </div>
                                    )}
                                    
                                    {/* Text */}
                                    <div className="px-2 pb-4 pt-1 text-sm text-gray-800 whitespace-pre-line leading-snug">
                                        {renderPreviewText()}
                                    </div>

                                    {/* Timestamp */}
                                    <div className="absolute bottom-1 right-2 text-[9px] text-gray-400">12:05 PM</div>
                                </div>

                                {/* Buttons */}
                                <div className="mt-2 max-w-[85%] ml-auto space-y-1">
                                    {buttons.map((btn, i) => (
                                        <div key={i} className="bg-white rounded-lg p-2.5 text-center text-blue-500 font-medium text-sm shadow-sm cursor-pointer hover:bg-gray-50">
                                            {btn.type === 'Url' ? <LinkIcon size={12} className="inline mr-1"/> : <MessageCircle size={12} className="inline mr-1"/>}
                                            {btn.text}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Phone Footer */}
                            <div className="h-12 bg-gray-100 flex items-center justify-center">
                                <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in" onClick={() => setMenuOpenId(null)}>
            <CreatePromoModal 
                isOpen={isPromoModalOpen}
                onClose={() => setIsPromoModalOpen(false)}
                onSave={handleCreatePromo}
            />
            
            <PromoUsageModal 
                isOpen={isUsageModalOpen}
                onClose={() => setIsUsageModalOpen(false)}
                promo={selectedPromoForDetail}
            />

            <CreateAutomationModal 
                isOpen={isAutoModalOpen}
                onClose={() => setIsAutoModalOpen(false)}
                onSave={handleSaveAutomation}
                ruleToEdit={selectedAuto}
                availableTemplates={whatsappTemplates}
            />

            <CreateTemplateModal 
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSave={handleSaveTemplate}
            />

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-medium text-text-dark">Promotion Engine</h1>
                    <p className="text-text-muted mt-1">"Smart Triggers" - Tools to drive revenue and retention.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200">
                {[
                    { id: 'Vouchers', label: 'Voucher Generator', icon: TicketPercent },
                    { id: 'Automation', label: 'Automation Campaigns', icon: Zap },
                    { id: 'WABlasting', label: 'WA Promo Blasting', icon: MessageCircle },
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={(e) => { e.stopPropagation(); setActiveTab(tab.id as PromoTab); }}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
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
                {activeTab === 'Vouchers' && <VouchersView />}
                {activeTab === 'Automation' && <AutomationView />}
                {activeTab === 'WABlasting' && <WAPromoBlastingView />}
            </div>
        </div>
    );
};

// Simple icon for Wallet in this context
const WalletIcon = ({ size, className }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
        <path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/>
        <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/>
    </svg>
)

export default PromotionEngine;
