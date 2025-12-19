
import React, { useState, useEffect } from 'react';
import { 
    Settings as SettingsIcon, 
    MessageCircle, 
    Building2, 
    Upload, 
    Save, 
    Plus, 
    Trash2, 
    Edit2, 
    RefreshCw, 
    CheckCircle2, 
    XCircle,
    Smartphone,
    Globe,
    Phone,
    Mail,
    MapPin,
    Clock,
    QrCode
} from 'lucide-react';
import { ClinicProfile, Branch } from '../types';
import BranchModal from '../components/modals/BranchModal';

type SettingsTab = 'Profile' | 'WhatsApp' | 'Branches';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('Profile');
    
    // --- Clinic Profile State ---
    const [profile, setProfile] = useState<ClinicProfile>({
        name: 'Esthirae Aesthetic & Wellness',
        tagline: 'Where Aesthetics Meets Intelligence',
        address: 'Jl. Kesehatan No. 88, Jakarta Barat, 11470',
        phone: '0812-3456-7890',
        email: 'info@esthirae.clinic',
        logo: 'https://ui-avatars.com/api/?name=Esthirae&background=d6b98c&color=fff&bold=true&size=128',
        businessHours: 'Mon - Sun, 09:00 - 21:00'
    });

    // --- WhatsApp Integration State ---
    const [waStatus, setWaStatus] = useState<'Disconnected' | 'Connecting' | 'Connected'>('Disconnected');
    const [isRefreshingQr, setIsRefreshingQr] = useState(false);

    // --- Branch State ---
    const [branches, setBranches] = useState<Branch[]>([
        { id: 'BR-1', code: 'JKT01', name: 'Esthirae Central Park', address: 'Central Park Mall, Lt. 2, Jakarta', phone: '021-500600', status: 'Active' },
        { id: 'BR-2', code: 'BDG01', name: 'Esthirae Paris Van Java', address: 'PVJ Mall, Glamour Level, Bandung', phone: '022-700800', status: 'Active' }
    ]);
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    // --- Handlers ---

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Clinic profile updated successfully!");
    };

    const handleConnectWa = () => {
        setWaStatus('Connecting');
        setIsRefreshingQr(true);
        // Simulate QR loading
        setTimeout(() => setIsRefreshingQr(false), 2000);
    };

    const handleDisconnectWa = () => {
        if (window.confirm("Are you sure you want to disconnect WhatsApp integration? Automations will stop working.")) {
            setWaStatus('Disconnected');
        }
    };

    const handleSaveBranch = (branch: Branch) => {
        if (branches.some(b => b.id === branch.id)) {
            setBranches(branches.map(b => b.id === branch.id ? branch : b));
        } else {
            setBranches([...branches, branch]);
        }
        setEditingBranch(null);
    };

    const handleEditBranch = (branch: Branch) => {
        setEditingBranch(branch);
        setIsBranchModalOpen(true);
    };

    const handleDeleteBranch = (id: string) => {
        if (window.confirm("Deactivate this branch? It will no longer be available for scheduling.")) {
            setBranches(branches.map(b => b.id === id ? { ...b, status: 'Inactive' } : b));
        }
    };

    // --- Tab Views ---

    const ClinicProfileView = () => (
        <div className="bg-white rounded-2xl shadow-soft p-8 animate-fade-in">
            <form onSubmit={handleSaveProfile} className="max-w-4xl space-y-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Logo Section */}
                    <div className="w-full md:w-48 flex flex-col items-center gap-4">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Clinic Logo</label>
                        <div className="relative group w-40 h-40">
                            <img 
                                src={profile.logo} 
                                alt="Clinic Logo" 
                                className="w-full h-full rounded-3xl object-cover shadow-md border-4 border-white"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center cursor-pointer">
                                <Upload className="text-white" size={24}/>
                            </div>
                        </div>
                        <p className="text-[10px] text-text-muted text-center italic">Best size: 512x512px (PNG/JPG)</p>
                    </div>

                    {/* Data Fields */}
                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Clinic Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                                    <input 
                                        type="text" 
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                        value={profile.name}
                                        onChange={e => setProfile({...profile, name: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Tagline / Motto</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                    value={profile.tagline}
                                    onChange={e => setProfile({...profile, tagline: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Primary Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                                    <input 
                                        type="tel" 
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                        value={profile.phone}
                                        onChange={e => setProfile({...profile, phone: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Public Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                                    <input 
                                        type="email" 
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                        value={profile.email}
                                        onChange={e => setProfile({...profile, email: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Headquarters Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={16}/>
                                <textarea 
                                    rows={2}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-soft-gold resize-none"
                                    value={profile.address}
                                    onChange={e => setProfile({...profile, address: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Business Hours</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                    value={profile.businessHours}
                                    onChange={e => setProfile({...profile, businessHours: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-end">
                    <button type="submit" className="px-8 py-3 bg-text-dark text-white rounded-xl font-bold shadow-lg hover:bg-black transition-all flex items-center gap-2">
                        <Save size={18}/> Update Profile
                    </button>
                </div>
            </form>
        </div>
    );

    const WhatsAppIntegrationView = () => (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden animate-fade-in">
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Integration Info */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center">
                                <MessageCircle size={24}/>
                            </div>
                            <h3 className="text-xl font-bold text-text-dark">WhatsApp Gateway</h3>
                        </div>
                        <p className="text-text-muted">Link your clinical business account to enable automated appointment reminders, promo blasts, and patient follow-ups.</p>
                    </div>

                    <div className="space-y-4">
                        <div className={`p-4 rounded-2xl border flex items-center justify-between ${waStatus === 'Connected' ? 'bg-sage/10 border-sage' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${waStatus === 'Connected' ? 'bg-sage animate-pulse' : 'bg-gray-300'}`}></div>
                                <div>
                                    <div className="text-sm font-bold text-text-dark">Connection Status</div>
                                    <div className="text-xs text-text-muted">{waStatus}</div>
                                </div>
                            </div>
                            {waStatus === 'Connected' && (
                                <button 
                                    onClick={handleDisconnectWa}
                                    className="text-xs font-bold text-rose hover:underline"
                                >
                                    Disconnect
                                </button>
                            )}
                        </div>

                        {waStatus === 'Connected' && (
                            <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted">Device Name</span>
                                    <span className="font-medium text-text-dark">Receptionist iPad (Esthirae)</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted">Official Number</span>
                                    <span className="font-medium text-text-dark">+62 812-3456-7890</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted">Daily Limit</span>
                                    <span className="font-medium text-sage">Unlimited</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-text-dark uppercase tracking-wider">Instructions</h4>
                        <ol className="text-sm text-text-muted space-y-3">
                            <li className="flex gap-3">
                                <span className="w-5 h-5 rounded-full bg-gray-100 text-text-dark flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                                <span>Open WhatsApp on your phone.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-5 h-5 rounded-full bg-gray-100 text-text-dark flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                                <span>Tap Menu or Settings and select Linked Devices.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-5 h-5 rounded-full bg-gray-100 text-text-dark flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                                <span>Tap on Link a Device.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-5 h-5 rounded-full bg-gray-100 text-text-dark flex items-center justify-center text-[10px] font-bold shrink-0">4</span>
                                <span>Point your phone to this screen to capture the code.</span>
                            </li>
                        </ol>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-gray-100 p-8 text-center min-h-[400px]">
                    {waStatus === 'Connected' ? (
                        <div className="animate-fade-in flex flex-col items-center">
                            <div className="w-24 h-24 bg-sage/10 text-sage rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={64} />
                            </div>
                            <h3 className="text-2xl font-bold text-text-dark mb-2">Device Linked</h3>
                            <p className="text-text-muted max-w-xs mb-8">System is now able to send automated messages via your WhatsApp account.</p>
                            <button className="flex items-center gap-2 text-sm font-bold text-soft-gold hover:underline">
                                <RefreshCw size={16}/> Sync Session
                            </button>
                        </div>
                    ) : waStatus === 'Connecting' ? (
                        <div className="animate-fade-in flex flex-col items-center w-full">
                            <div className="relative w-64 h-64 bg-white p-4 rounded-3xl shadow-xl border border-gray-200 mb-8 flex items-center justify-center">
                                {isRefreshingQr ? (
                                    <div className="flex flex-col items-center">
                                        <RefreshCw size={40} className="text-soft-gold animate-spin mb-4"/>
                                        <span className="text-xs font-bold text-text-muted">Generating code...</span>
                                    </div>
                                ) : (
                                    <img 
                                        src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ESTHIRAE_WA_GATEWAY_MOCK_SESSION" 
                                        alt="WhatsApp QR Code"
                                        className="w-full h-full object-contain cursor-pointer"
                                        onClick={() => setWaStatus('Connected')}
                                    />
                                )}
                                {/* Expire countdown overlay example */}
                                {!isRefreshingQr && (
                                    <div className="absolute -bottom-3 bg-text-dark text-white px-3 py-1 rounded-full text-[10px] font-bold">
                                        REFRESH IN 45s
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-text-muted">Scan this QR code with your phone.<br/>Or <button onClick={() => setWaStatus('Disconnected')} className="text-rose font-bold">Cancel</button></p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
                                <Smartphone size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-text-dark mb-2">Ready to Connect?</h3>
                            <p className="text-sm text-text-muted mb-8">Click button below to generate a new QR code.</p>
                            <button 
                                onClick={handleConnectWa}
                                className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
                            >
                                <QrCode size={18}/> Generate QR Code
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );

    const BranchManagementView = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-text-dark">Clinic Branches</h3>
                    <p className="text-sm text-text-muted">Manage your multiple clinic locations.</p>
                </div>
                <button 
                    onClick={() => { setEditingBranch(null); setIsBranchModalOpen(true); }}
                    className="bg-soft-gold text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-[#cbad85] flex items-center gap-2 transition-all"
                >
                    <Plus size={18} /> Add Branch
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map(branch => (
                    <div key={branch.id} className={`bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-all group ${branch.status === 'Inactive' ? 'opacity-60 grayscale' : ''}`}>
                        <div className="p-5 border-b border-gray-50 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-text-dark">{branch.name}</h4>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-text-muted uppercase">{branch.code}</span>
                                </div>
                                <div className={`mt-1 text-[10px] font-bold uppercase tracking-widest ${branch.status === 'Active' ? 'text-sage' : 'text-rose'}`}>
                                    {branch.status}
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditBranch(branch)} className="p-1.5 text-gray-400 hover:text-soft-gold hover:bg-gray-50 rounded-lg"><Edit2 size={14}/></button>
                                <button onClick={() => handleDeleteBranch(branch.id)} className="p-1.5 text-gray-400 hover:text-rose hover:bg-gray-50 rounded-lg"><Trash2 size={14}/></button>
                            </div>
                        </div>
                        <div className="p-5 space-y-3 flex-1">
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-soft-gold shrink-0 mt-0.5"/>
                                <span className="text-xs text-text-muted leading-relaxed">{branch.address}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-soft-gold shrink-0"/>
                                <span className="text-xs text-text-muted">{branch.phone}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 text-center">
                            <button className="text-[10px] font-bold text-soft-gold hover:underline flex items-center gap-1 mx-auto">
                                <Globe size={10}/> View Branch Dashboard
                            </button>
                        </div>
                    </div>
                ))}
                
                {/* Empty State Mock */}
                {branches.length === 0 && (
                    <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-text-muted">
                        <Building2 size={48} className="opacity-20 mb-4"/>
                        <p>No branches configured. Add your first location.</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <BranchModal 
                isOpen={isBranchModalOpen}
                onClose={() => setIsBranchModalOpen(false)}
                onSave={handleSaveBranch}
                branchToEdit={editingBranch}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-medium text-text-dark">Clinic Settings</h1>
                    <p className="text-text-muted mt-1">Configure your clinical identity and operational integrations.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
                {[
                    { id: 'Profile', label: 'Clinic Profile', icon: Building2 },
                    { id: 'WhatsApp', label: 'WhatsApp Integration', icon: MessageCircle },
                    { id: 'Branches', label: 'Branch Management', icon: Globe },
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as SettingsTab)}
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
                {activeTab === 'Profile' && <ClinicProfileView />}
                {activeTab === 'WhatsApp' && <WhatsAppIntegrationView />}
                {activeTab === 'Branches' && <BranchManagementView />}
            </div>
        </div>
    );
};

export default Settings;
