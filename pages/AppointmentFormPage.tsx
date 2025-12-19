
import React, { useState, useEffect, useMemo } from 'react';
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    User, 
    Stethoscope, 
    MapPin, 
    CheckCircle2, 
    Wallet, 
    Box, 
    AlertCircle, 
    MessageSquare,
    Sparkles,
    Tag,
    XCircle,
    ArrowRight
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MOCK_PATIENTS, MOCK_PROCEDURES, ROOMS, TODAY_APPOINTMENTS } from '../constants';
import { Patient, AppointmentStatus, PackageMaster, ServiceWalletItem } from '../types';
import PackageListModal from '../components/modals/PackageListModal';
import BookingSuccessModal from '../components/modals/BookingSuccessModal';

const AppointmentFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // For Edit Mode
    const [searchParams] = useSearchParams();

    // --- State ---
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [patientSearch, setPatientSearch] = useState('');
    const [showPatientDropdown, setShowPatientDropdown] = useState(false);
    
    // Modal States
    const [isPackageListOpen, setIsPackageListOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    
    // New Package Selection State (For purchasing a NEW package this session)
    const [selectedUpsellPackage, setSelectedUpsellPackage] = useState<PackageMaster | null>(null);

    // Form Data
    const [formData, setFormData] = useState({
        doctor: searchParams.get('doctor') || 'Dr. Sarah',
        date: searchParams.get('date') ? searchParams.get('date')!.split('T')[0] : new Date().toISOString().split('T')[0],
        time: searchParams.get('time') || '09:00',
        treatment: '', // Will be populated
        room: '',
        status: AppointmentStatus.CONFIRMED,
        notes: '',
        usePackage: false // User decision for EXISTING package
    });

    // --- Load Data if Edit Mode ---
    useEffect(() => {
        if (id) {
            const apt = TODAY_APPOINTMENTS.find(a => a.id === id);
            if (apt) {
                const patient = MOCK_PATIENTS.find(p => p.id === apt.patientId);
                if (patient) {
                    setSelectedPatient(patient);
                    setPatientSearch(patient.name);
                } else {
                    setPatientSearch(apt.patientName);
                }
                
                setFormData({
                    doctor: apt.doctor,
                    date: new Date(apt.date).toISOString().split('T')[0],
                    time: apt.time.split(' ')[0], // Simplify time format
                    treatment: apt.treatment,
                    room: apt.room || '',
                    status: apt.status,
                    notes: apt.notes || '',
                    usePackage: false
                });
            }
        }
    }, [id]);

    // --- Smart Logic: Asset Validation ---
    
    // 1. Find if patient has a package for the selected treatment
    const matchingPackage = useMemo(() => {
        if (!selectedPatient || !formData.treatment) return null;
        
        // Simple string matching. In real app, match by Procedure ID.
        return selectedPatient.serviceWallet?.find(
            pkg => pkg.status === 'Active' && 
                   pkg.remainingUnits > 0 && 
                   (pkg.procedureName === formData.treatment || pkg.packageName.includes(formData.treatment))
        );
    }, [selectedPatient, formData.treatment]);

    // NEW LOGIC: Auto-select 'usePackage' if matching package found
    useEffect(() => {
        if (matchingPackage) {
            setFormData(prev => ({ ...prev, usePackage: true }));
        }
    }, [matchingPackage]);

    // 2. Find estimated cost
    const estimatedCost = useMemo(() => {
        // Priority 1: Buying a NEW Package
        if (selectedUpsellPackage) {
            return selectedUpsellPackage.totalPrice;
        }

        // Priority 2: Redeeming EXISTING Package
        if (matchingPackage && formData.usePackage) return 0; // Covered by package unit
        
        // Priority 3: Pay per Treatment
        const procedure = MOCK_PROCEDURES.find(p => p.name === formData.treatment);
        return procedure ? procedure.finalPrice : 0;
    }, [formData.treatment, matchingPackage, formData.usePackage, selectedUpsellPackage]);

    // 3. Wallet Calculation
    const walletCoverage = useMemo(() => {
        if (!selectedPatient) return { status: 'none', remainingPay: estimatedCost };
        
        const balance = selectedPatient.walletBalance || 0;
        
        if (estimatedCost === 0) return { status: 'covered', remainingPay: 0 }; // Covered by package or free

        if (balance >= estimatedCost) {
            return { status: 'full_deposit', remainingPay: 0, balanceAfter: balance - estimatedCost };
        } else {
            return { status: 'partial_deposit', remainingPay: estimatedCost - balance, balanceAfter: 0 };
        }
    }, [selectedPatient, estimatedCost]);

    // --- Handlers ---

    const handlePatientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPatientSearch(e.target.value);
        setShowPatientDropdown(true);
        if (e.target.value === '') setSelectedPatient(null);
    };

    const selectPatient = (p: Patient) => {
        setSelectedPatient(p);
        setPatientSearch(p.name);
        setShowPatientDropdown(false);
    };

    const handleSelectUpsellPackage = (pkg: PackageMaster) => {
        // 1. Extract the primary procedure from the package (First item)
        const primaryProcedure = pkg.items.length > 0 ? pkg.items[0].procedureName : '';

        // 2. Set the Upsell Package as selected
        setSelectedUpsellPackage(pkg);

        setFormData(prev => ({
            ...prev,
            // 3. Automatically populate the treatment field
            treatment: primaryProcedure || prev.treatment,
            // 4. Ensure we are NOT using an old package (we are buying a new one)
            usePackage: false,
            // 5. Add intention note
            notes: (prev.notes ? prev.notes + '\n' : '') + `[INTENT] Purchasing New Package: ${pkg.name}`
        }));
    };

    // Handler to use an existing package from the sidebar list
    const handleUseExistingPackage = (walletItem: ServiceWalletItem) => {
        setFormData(prev => ({
            ...prev,
            treatment: walletItem.procedureName,
            usePackage: true // Auto check "Use Package"
        }));
        setSelectedUpsellPackage(null); // Clear upsell selection if switching to existing package
    };

    const handleTreatmentChange = (val: string) => {
        setFormData(prev => ({
            ...prev, 
            treatment: val, 
            usePackage: false // Reset existing package flag when treatment changes
        }));
        // Reset upsell package selection if user manually changes treatment
        setSelectedUpsellPackage(null); 
    };

    const handleSave = () => {
        if (!selectedPatient || !formData.treatment) {
            alert("Please select a patient and a treatment.");
            return;
        }

        const payload = {
            ...formData,
            patientId: selectedPatient.id,
            redeemPackageId: (formData.usePackage && matchingPackage && !selectedUpsellPackage) ? matchingPackage.id : null,
            newPackagePurchaseId: selectedUpsellPackage ? selectedUpsellPackage.id : null,
            estimatedRevenue: estimatedCost
        };

        // Generate Mock Queue Number based on Doctor
        const doctorInit = formData.doctor.split(' ')[1]?.charAt(0) || 'A';
        const queueNo = `${doctorInit}-${Math.floor(Math.random() * 20) + 1}`;

        // Prepare Success Modal Data
        setSuccessData({
            patient: selectedPatient,
            treatment: formData.treatment,
            doctor: formData.doctor,
            date: formData.date,
            time: formData.time,
            queueNo: queueNo
        });

        // Show Modal instead of immediate navigation
        setShowSuccessModal(true);
    };

    const treatmentOptions = MOCK_PROCEDURES.map(p => p.name);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 animate-fade-in">
            
            <PackageListModal 
                isOpen={isPackageListOpen}
                onClose={() => setIsPackageListOpen(false)}
                filterTreatment={formData.treatment}
                onSelectOfInterest={handleSelectUpsellPackage}
            />

            <BookingSuccessModal 
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigate('/agenda');
                }}
                data={successData}
            />

            {/* LEFT COLUMN: Booking Form */}
            <div className="flex-1 bg-white rounded-2xl shadow-soft flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 bg-ivory flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/agenda')}
                            className="p-2 -ml-2 hover:bg-white rounded-full text-text-muted hover:text-text-dark transition-colors"
                        >
                            <ArrowLeft size={20}/>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-text-dark">
                                {id ? 'Edit Appointment' : 'New Reservation'}
                            </h1>
                            <p className="text-xs text-text-muted mt-1">Smart Booking System</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div className="space-y-8 max-w-2xl">
                        
                        {/* 1. Identification */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-text-dark border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-text-dark text-white flex items-center justify-center text-xs">1</span>
                                Patient Identification
                            </h3>
                            
                            <div className="relative">
                                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Patient Name / ID</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text"
                                        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-sm font-medium focus:outline-none focus:border-soft-gold transition-all ${selectedPatient ? 'border-sage/50 bg-sage/5' : 'border-gray-200'}`}
                                        placeholder="Search by name or phone..."
                                        value={patientSearch}
                                        onChange={handlePatientSearch}
                                        onFocus={() => setShowPatientDropdown(true)}
                                    />
                                    {selectedPatient && (
                                        <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-sage" />
                                    )}
                                </div>

                                {/* Dropdown */}
                                {showPatientDropdown && patientSearch && !selectedPatient && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                                        {MOCK_PATIENTS.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase())).map(p => (
                                            <div 
                                                key={p.id}
                                                onClick={() => selectPatient(p)}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex justify-between items-center group"
                                            >
                                                <div>
                                                    <div className="font-bold text-text-dark text-sm group-hover:text-soft-gold transition-colors">{p.name}</div>
                                                    <div className="text-xs text-text-muted">{p.phone} • {p.tier}</div>
                                                </div>
                                                <div className="text-xs font-mono text-gray-300">{p.id}</div>
                                            </div>
                                        ))}
                                        {/* Create New Option */}
                                        <div className="px-4 py-3 bg-ivory text-soft-gold text-sm font-medium hover:bg-soft-gold/10 cursor-pointer flex items-center gap-2">
                                            <PlusIcon /> Create New Patient Profile
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Treatment Selection */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-text-dark border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-text-dark text-white flex items-center justify-center text-xs">2</span>
                                Treatment & Resource
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Treatment</label>
                                    <div className="relative">
                                        <Sparkles size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select 
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-soft-gold appearance-none"
                                            value={formData.treatment}
                                            onChange={(e) => handleTreatmentChange(e.target.value)}
                                        >
                                            <option value="">Select Service...</option>
                                            {treatmentOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Doctor / Therapist</label>
                                    <div className="relative">
                                        <Stethoscope size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select 
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-soft-gold appearance-none"
                                            value={formData.doctor}
                                            onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                                        >
                                            <option>Dr. Sarah</option>
                                            <option>Dr. James</option>
                                            <option>Dr. A. Wijaya</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* SMART LOGIC PROMPTS (Inline) */}
                            {selectedPatient && formData.treatment && (
                                <div className="animate-fade-in space-y-3">
                                    
                                    {/* SCENARIO A: Buying NEW Package (Upsell Selected) */}
                                    {selectedUpsellPackage ? (
                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 relative">
                                            <div className="mt-0.5 p-1 rounded-full bg-blue-100 text-blue-600">
                                                <Tag size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm text-blue-800">Purchasing New Package</h4>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    <strong>{selectedUpsellPackage.name}</strong> will be added to invoice.
                                                </p>
                                                <div className="mt-2 text-xs font-medium">
                                                    Total Cost: Rp {selectedUpsellPackage.totalPrice.toLocaleString()}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setSelectedUpsellPackage(null)} 
                                                className="absolute top-2 right-2 text-blue-400 hover:text-blue-600"
                                            >
                                                <XCircle size={16}/>
                                            </button>
                                        </div>
                                    ) : matchingPackage ? (
                                    /* SCENARIO B: Existing Package Found */
                                        <div className={`p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${formData.usePackage ? 'bg-sage/10 border-sage' : 'bg-white border-gray-200'}`}>
                                            <div className={`mt-0.5 p-1 rounded-full ${formData.usePackage ? 'bg-sage text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                <Box size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm text-text-dark">Package Available</h4>
                                                <p className="text-xs text-text-muted mt-1">
                                                    Patient has <strong>{matchingPackage.remainingUnits}x</strong> remaining for <strong>{matchingPackage.procedureName}</strong>.
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => setFormData({...formData, usePackage: !formData.usePackage})}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                                                    formData.usePackage ? 'bg-sage text-white shadow-md' : 'bg-gray-100 text-text-muted hover:bg-gray-200'
                                                }`}
                                            >
                                                {formData.usePackage ? 'Redeem Selected' : 'Use Package'}
                                            </button>
                                        </div>
                                    ) : (
                                        /* SCENARIO C: No Package / Deposit Check */
                                        <div className="p-4 bg-amber/5 border border-amber/20 rounded-xl flex items-start gap-3">
                                            <AlertCircle size={20} className="text-amber mt-0.5" />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm text-text-dark">No Active Package</h4>
                                                <p className="text-xs text-text-muted mt-1 mb-2">
                                                    Estimated Cost: <strong>Rp {estimatedCost.toLocaleString()}</strong>
                                                </p>
                                                
                                                <div className="bg-white/60 p-2 rounded-lg border border-amber/10 text-xs">
                                                    {walletCoverage.status === 'full_deposit' ? (
                                                        <span className="text-sage font-bold flex items-center gap-1">
                                                            <CheckCircle2 size={12}/> Covered by Deposit (Rem: Rp {walletCoverage.balanceAfter.toLocaleString()})
                                                        </span>
                                                    ) : (
                                                        <span className="text-text-dark flex items-center gap-1">
                                                            <Wallet size={12} className="text-text-muted"/> 
                                                            Deposit: Rp {(selectedPatient.walletBalance || 0).toLocaleString()} 
                                                            <span className="mx-1 text-gray-300">|</span> 
                                                            Pay Remaining: <strong className="text-rose">Rp {walletCoverage.remainingPay.toLocaleString()}</strong>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 3. Scheduling */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-text-dark border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-text-dark text-white flex items-center justify-center text-xs">3</span>
                                Schedule Slot
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Date</label>
                                    <div className="relative">
                                        <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="date"
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-soft-gold"
                                            value={formData.date}
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Time</label>
                                    <div className="relative">
                                        <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="time"
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-soft-gold"
                                            value={formData.time}
                                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Room</label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select 
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-soft-gold appearance-none"
                                            value={formData.room}
                                            onChange={(e) => setFormData({...formData, room: e.target.value})}
                                        >
                                            <option value="">Auto-Assign</option>
                                            {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Internal Notes</label>
                                <div className="relative">
                                    <MessageSquare size={18} className="absolute left-4 top-4 text-gray-400" />
                                    <textarea 
                                        rows={2}
                                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-soft-gold resize-none"
                                        placeholder="Special requests, allergies, or reception notes..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Action */}
                <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-between items-center">
                    <div className="text-xs text-text-muted italic">
                        * Confirmation message will be sent to patient automatically.
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => navigate('/agenda')}
                            className="px-6 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-8 py-2.5 bg-soft-gold text-white text-sm font-bold rounded-xl shadow-lg hover:bg-[#cbad85] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            <CheckCircle2 size={18} /> Confirm Booking
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Context & Snapshot (Sticky) */}
            <div className="w-full md:w-80 flex flex-col gap-6">
                
                {/* Patient Snapshot Card */}
                {selectedPatient ? (
                    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden animate-fade-in">
                        <div className="bg-ivory p-6 border-b border-gray-100 flex flex-col items-center text-center">
                            <img 
                                src={selectedPatient.avatarUrl} 
                                alt={selectedPatient.name} 
                                className="w-20 h-20 rounded-full border-4 border-white shadow-sm mb-3 object-cover"
                            />
                            <h3 className="font-serif font-bold text-lg text-text-dark">{selectedPatient.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-soft-gold/20 text-text-dark text-xs font-bold rounded-full border border-soft-gold/30">
                                    {selectedPatient.tier}
                                </span>
                                <span className="text-xs text-text-muted">{selectedPatient.id}</span>
                            </div>
                        </div>
                        
                        <div className="p-5 space-y-5">
                            {/* Wallet Info */}
                            <div>
                                <div className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <Wallet size={12}/> Cash Deposit
                                </div>
                                <div className="text-xl font-bold text-soft-gold">
                                    Rp {(selectedPatient.walletBalance || 0).toLocaleString()}
                                </div>
                            </div>

                            {/* Active Packages (INTERACTIVE) */}
                            <div>
                                <div className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <Box size={12}/> Active Packages
                                </div>
                                {selectedPatient.serviceWallet && selectedPatient.serviceWallet.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedPatient.serviceWallet.map(pkg => (
                                            <div 
                                                key={pkg.id} 
                                                onClick={() => handleUseExistingPackage(pkg)}
                                                className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm cursor-pointer hover:border-soft-gold hover:bg-soft-gold/5 transition-all group relative"
                                            >
                                                <div className="font-bold text-text-dark pr-6">{pkg.procedureName}</div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-text-muted">{pkg.packageName}</span>
                                                    <span className="text-xs font-bold bg-white border border-gray-200 px-1.5 py-0.5 rounded text-sage group-hover:border-soft-gold group-hover:text-soft-gold transition-colors">
                                                        {pkg.remainingUnits}x Left
                                                    </span>
                                                </div>
                                                {/* Visual Indicator for Action */}
                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-soft-gold">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-text-muted italic bg-gray-50 p-3 rounded-lg text-center">
                                        No active packages.
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-xs text-text-muted mb-1">
                                    <span>Last Visit</span>
                                    <span>{new Date(selectedPatient.lastVisit).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-xs text-text-muted">
                                    <span>Last Doctor</span>
                                    <span>{selectedPatient.lastDoctor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-2xl shadow-soft border border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center h-64 text-text-muted">
                        <User size={32} className="opacity-20 mb-3"/>
                        <p className="text-sm">Select a patient to view their wallet snapshot and package details.</p>
                    </div>
                )}

                {/* Additional Info / Marketing Prompt */}
                {selectedPatient && !matchingPackage && !selectedUpsellPackage && (
                    <div className="bg-gradient-to-br from-soft-gold/20 to-ivory rounded-2xl p-5 border border-soft-gold/20 text-center animate-fade-in">
                        <Sparkles size={24} className="text-soft-gold mx-auto mb-2"/>
                        <h4 className="font-bold text-text-dark text-sm">Upsell Opportunity</h4>
                        <p className="text-xs text-text-dark/70 mt-1 mb-3">
                            This patient doesn't have a package for <strong>{formData.treatment || 'this service'}</strong>. Offer the 5x Bundle to save 15%.
                        </p>
                        <button 
                            onClick={() => setIsPackageListOpen(true)}
                            className="w-full py-2 bg-white text-soft-gold text-xs font-bold rounded-lg shadow-sm hover:bg-soft-gold hover:text-white transition-colors"
                        >
                            View Packages
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

// Simple Icon component for the dropdown
const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)

export default AppointmentFormPage;
