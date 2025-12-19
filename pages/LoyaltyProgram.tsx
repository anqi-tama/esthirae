
import React, { useState } from 'react';
import { 
    LayoutDashboard, 
    Crown, 
    Wallet, 
    Users, 
    TrendingUp, 
    ArrowUpCircle, 
    ArrowDownCircle, 
    Settings,
    Plus,
    MoreHorizontal,
    Check,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { MOCK_LOYALTY_TIERS, MOCK_WALLET_LOGS } from '../constants';
import { LoyaltyTier, PointRule, WalletRuleConfig } from '../types';
import MasterTiersModal from '../components/modals/MasterTiersModal';
import WalletRulesModal from '../components/modals/WalletRulesModal';
import CreatePointRuleModal from '../components/modals/CreatePointRuleModal';

type LoyaltyTab = 'Dashboard' | 'Tiers' | 'Finance' | 'Referral';

const LoyaltyProgram: React.FC = () => {
    const [activeTab, setActiveTab] = useState<LoyaltyTab>('Dashboard');
    
    // Data States (Migrated from old CRM page)
    const [tiers, setTiers] = useState<LoyaltyTier[]>(MOCK_LOYALTY_TIERS);
    const [pointRules, setPointRules] = useState<PointRule[]>([
        { id: 'PR-001', name: 'Standard Earn', type: 'Spend', conditionItem: 'Every Rp 10.000', points: 1, status: 'Active' },
        { id: 'PR-002', name: 'New Member Bonus', type: 'Spend', conditionItem: 'First Transaction', points: 50, status: 'Active' }
    ]);
    const [walletConfig, setWalletConfig] = useState<WalletRuleConfig>({
        enableExpiry: false,
        expiryMonths: 12,
        allowRefund: false,
        refundAdminFeePercent: 10
    });

    // Modal States
    const [isMasterTiersOpen, setIsMasterTiersOpen] = useState(false);
    const [isWalletRulesOpen, setIsWalletRulesOpen] = useState(false);
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);

    // --- Sub-components ---

    const LoyaltyDashboardView = () => (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-soft-gold">
                    <div className="text-xs text-text-muted uppercase tracking-wide">Total Outstanding Points</div>
                    <div className="text-2xl font-bold text-text-dark mt-1">85,400</div>
                    <div className="text-xs text-text-muted mt-1">Value: ~Rp 8.5M</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-sage">
                    <div className="text-xs text-text-muted uppercase tracking-wide">Redemption Rate</div>
                    <div className="text-2xl font-bold text-text-dark mt-1">36%</div>
                    <div className="text-xs text-sage mt-1 flex items-center gap-1"><TrendingUp size={12}/> Healthy</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-lavender">
                    <div className="text-xs text-text-muted uppercase tracking-wide">Active Members</div>
                    <div className="text-2xl font-bold text-text-dark mt-1">1,245</div>
                    <div className="text-xs text-text-muted mt-1">Silver+ Tiers</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tier Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-soft">
                    <h3 className="font-bold text-text-dark mb-4">Tier Distribution</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 text-sm font-bold text-gray-500">Silver</div>
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gray-400 w-[60%]"></div>
                            </div>
                            <div className="text-sm font-medium">750</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 text-sm font-bold text-[#b5986a]">Gold</div>
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-soft-gold w-[30%]"></div>
                            </div>
                            <div className="text-sm font-medium">375</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 text-sm font-bold text-gray-700">Plat</div>
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gray-700 w-[10%]"></div>
                            </div>
                            <div className="text-sm font-medium">120</div>
                        </div>
                    </div>
                </div>

                {/* Point Rules Preview */}
                <div className="bg-white p-6 rounded-xl shadow-soft">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-text-dark">Earning Rules</h3>
                        <button onClick={() => setActiveTab('Tiers')} className="text-xs text-soft-gold hover:underline">Manage</button>
                    </div>
                    <div className="space-y-3">
                        {pointRules.map(rule => (
                            <div key={rule.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    <div className="text-sm font-medium text-text-dark">{rule.name}</div>
                                    <div className="text-xs text-text-muted">{rule.conditionItem}</div>
                                </div>
                                <div className="text-xs font-bold bg-soft-gold/10 text-soft-gold px-2 py-1 rounded">
                                    {rule.points} pts
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const TiersAndRulesView = () => (
        <div className="space-y-8 animate-fade-in">
            {/* Tiers Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-text-dark">Membership Tiers</h3>
                        <p className="text-sm text-text-muted">Visual overview of loyalty levels.</p>
                    </div>
                    <button 
                        onClick={() => setIsMasterTiersOpen(true)}
                        className="bg-white border border-gray-200 text-text-dark px-5 py-2 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-all"
                    >
                        <Settings size={18} className="text-text-muted" /> Config Tiers
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tiers.map(tier => (
                        <div key={tier.id} className={`rounded-xl p-6 border ${tier.color.replace('text-', 'border-').replace('bg-', 'bg-opacity-20 ')} relative overflow-hidden group hover:shadow-lg transition-all`}>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Crown size={80} className="transform rotate-12" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown className={tier.color.split(' ')[2]} size={24} />
                                    <h3 className={`text-lg font-bold ${tier.color.split(' ')[2]}`}>{tier.name}</h3>
                                </div>
                                <p className="text-sm text-text-muted mb-4">Min. Spend: Rp {tier.minSpend.toLocaleString()}</p>
                                <ul className="text-sm space-y-1 bg-white/60 p-3 rounded-lg backdrop-blur-sm">
                                    {tier.benefits.map((b, i) => (
                                        <li key={i} className="flex items-start gap-2 text-text-dark/80">
                                            <span className="mt-1.5 w-1 h-1 rounded-full bg-soft-gold shrink-0"></span>{b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-gray-100"/>

            {/* Point Rules Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-text-dark">Point Logic</h3>
                        <p className="text-sm text-text-muted">How customers earn points.</p>
                    </div>
                    <button 
                        onClick={() => setIsRuleModalOpen(true)}
                        className="bg-soft-gold text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg hover:bg-[#cbad85] flex items-center gap-2 transition-all"
                    >
                        <Plus size={18} /> Add Rule
                    </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                            <tr>
                                <th className="px-6 py-4">Rule Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Condition</th>
                                <th className="px-6 py-4 text-center">Points</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {pointRules.map(rule => (
                                <tr key={rule.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-medium">{rule.name}</td>
                                    <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{rule.type}</span></td>
                                    <td className="px-6 py-4 text-text-muted">{rule.conditionItem || '-'}</td>
                                    <td className="px-6 py-4 text-center font-bold text-soft-gold">{rule.points}</td>
                                    <td className="px-6 py-4 text-center"><span className="bg-sage/10 text-sage px-2 py-1 rounded text-xs">{rule.status}</span></td>
                                    <td className="px-6 py-4 text-right"><MoreHorizontal size={16} className="text-gray-400"/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const FinanceWalletView = () => {
        const [walletPage, setWalletPage] = useState(1);
        const ITEMS_PER_PAGE = 5;

        // Pagination Logic
        const totalWalletPages = Math.ceil(MOCK_WALLET_LOGS.length / ITEMS_PER_PAGE);
        const paginatedLogs = MOCK_WALLET_LOGS.slice(
            (walletPage - 1) * ITEMS_PER_PAGE,
            walletPage * ITEMS_PER_PAGE
        );

        return (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                     <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h3 className="font-bold text-text-dark flex items-center gap-2"><Wallet size={16} className="text-soft-gold"/> Deposit & Wallet </h3>
                            <p className="text-xs text-text-muted">Manage patient deposits and mutation history.</p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsWalletRulesOpen(true)}
                                className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-1"
                            >
                                <Settings size={12}/> Rules & Policy
                            </button>
                        </div>
                    </div>
                    
                    {/* Wallet Liability Dashboard */}
                    <div className="grid grid-cols-2 gap-4 p-6 border-b border-gray-100">
                        <div className="bg-soft-gold/5 rounded-xl p-4 border border-soft-gold/10">
                            <div className="text-xs text-text-muted uppercase tracking-wide">Total Deposit Liability</div>
                            <div className="text-2xl font-bold text-soft-gold mt-1">Rp 42.500.000</div>
                            <div className="text-xs text-text-muted mt-2">Held by clinic on behalf of patients</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="text-xs text-text-muted uppercase tracking-wide">Monthly Usage (Burn Rate)</div>
                            <div className="text-2xl font-bold text-text-dark mt-1">Rp 8.200.000</div>
                        </div>
                    </div>

                    <div className="p-6">
                        <h4 className="font-bold text-text-dark mb-4">Recent Wallet Transactions</h4>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Patient</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3 text-right">Amount</th>
                                    <th className="px-4 py-3 text-right">Balance</th>
                                    <th className="px-4 py-3">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3 text-text-muted">{log.date.toLocaleDateString()}</td>
                                        <td className="px-4 py-3 font-medium text-text-dark">{log.patientName}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${
                                                log.type === 'Top Up' ? 'bg-sage/10 text-sage' : 
                                                log.type === 'Payment' ? 'bg-rose/10 text-rose' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {log.type === 'Top Up' ? <ArrowUpCircle size={10}/> : <ArrowDownCircle size={10}/>}
                                                {log.type}
                                            </span>
                                        </td>
                                        <td className={`px-4 py-3 text-right font-medium ${log.amount > 0 ? 'text-sage' : 'text-text-dark'}`}>
                                            {log.amount > 0 ? '+' : ''}{log.amount.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right text-text-muted">
                                            {log.balanceAfter.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-text-muted italic">{log.notes}</td>
                                    </tr>
                                ))}
                                {MOCK_WALLET_LOGS.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-text-muted italic">
                                            No wallet activity recorded.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                            <div className="text-xs text-text-muted">
                                Showing {(walletPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(walletPage * ITEMS_PER_PAGE, MOCK_WALLET_LOGS.length)} of {MOCK_WALLET_LOGS.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setWalletPage(Math.max(1, walletPage - 1))}
                                    disabled={walletPage === 1}
                                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={16}/>
                                </button>
                                <span className="text-xs font-medium text-text-dark px-2">Page {walletPage} of {Math.max(1, totalWalletPages)}</span>
                                <button 
                                    onClick={() => setWalletPage(Math.min(totalWalletPages, walletPage + 1))}
                                    disabled={walletPage === totalWalletPages || totalWalletPages === 0}
                                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={16}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ReferralSystemView = () => (
        <div className="bg-white rounded-xl shadow-soft p-8 text-center animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-soft-gold/10 rounded-full flex items-center justify-center mb-6 text-soft-gold">
                <Users size={40} />
            </div>
            <h2 className="text-2xl font-bold text-text-dark mb-2">Member Get Member</h2>
            <p className="text-text-muted max-w-md mx-auto mb-8">
                Incentivize existing patients to bring their friends. Configure referral rewards here.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl text-left">
                <div className="border border-gray-200 rounded-xl p-5 hover:border-soft-gold transition-colors">
                    <h4 className="font-bold text-text-dark mb-2">Referrer Reward</h4>
                    <p className="text-xs text-text-muted mb-3">Reward for the person inviting.</p>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg font-medium text-sm">
                        <Wallet size={16} className="text-sage"/>
                        Rp 50.000 Wallet Credit
                    </div>
                </div>
                <div className="border border-gray-200 rounded-xl p-5 hover:border-soft-gold transition-colors">
                    <h4 className="font-bold text-text-dark mb-2">Referee Reward</h4>
                    <p className="text-xs text-text-muted mb-3">Reward for the new friend.</p>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg font-medium text-sm">
                        <Check size={16} className="text-sage"/>
                        10% Discount on First Tx
                    </div>
                </div>
            </div>
            
            <button className="mt-8 px-6 py-2.5 bg-text-dark text-white rounded-xl font-bold shadow-lg hover:bg-black transition-all">
                Configure Logic
            </button>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <MasterTiersModal 
                isOpen={isMasterTiersOpen}
                onClose={() => setIsMasterTiersOpen(false)}
                tiers={tiers}
                onUpdate={setTiers}
            />
            <WalletRulesModal
                isOpen={isWalletRulesOpen}
                onClose={() => setIsWalletRulesOpen(false)}
                config={walletConfig}
                onSave={setWalletConfig}
            />
            <CreatePointRuleModal 
                isOpen={isRuleModalOpen}
                onClose={() => setIsRuleModalOpen(false)}
                onSave={(newRule) => setPointRules([...pointRules, newRule])}
            />

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-medium text-text-dark">Loyalty Program</h1>
                    <p className="text-text-muted mt-1">"The Golden Handcuffs" - Retention Strategy.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200">
                {[
                    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'Tiers', label: 'Tiers & Rules', icon: Crown },
                    { id: 'Finance', label: 'Finance & Wallet', icon: Wallet },
                    { id: 'Referral', label: 'Referral System', icon: Users },
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as LoyaltyTab)}
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
                {activeTab === 'Dashboard' && <LoyaltyDashboardView />}
                {activeTab === 'Tiers' && <TiersAndRulesView />}
                {activeTab === 'Finance' && <FinanceWalletView />}
                {activeTab === 'Referral' && <ReferralSystemView />}
            </div>
        </div>
    );
};

export default LoyaltyProgram;
