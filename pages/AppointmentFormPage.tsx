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
    XCircle
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MOCK_PATIENTS, MOCK_PROCEDURES, ROOMS, TODAY_APPOINTMENTS } from '../constants.ts';
import { Patient, AppointmentStatus, PackageMaster, ServiceWalletItem } from '../types.ts';
import PackageListModal from '../components/modals/PackageListModal.tsx';
import BookingSuccessModal from '../components/modals/BookingSuccessModal.tsx';

const AppointmentFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [patientSearch, setPatientSearch] = useState('');
    const [showPatientDropdown, setShowPatientDropdown] = useState(false);
    
    const [isPackageListOpen, setIsPackageListOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    
    const [selectedUpsellPackage, setSelectedUpsellPackage] = useState<PackageMaster | null>(null);

    const [formData, setFormData] = useState({
        doctor: searchParams.get('doctor') || 'Dr. Sarah',
        date: searchParams.get('date') ? searchParams.get('date')!.split('T')[0] : new Date().toISOString().split('T')[0],
        time: searchParams.get('time') || '09:00',
        treatment: '',
        room: '',
        status: AppointmentStatus.CONFIRMED,
        notes: '',
        usePackage: false
    });

    useEffect(() => {
        if (id) {
            const apt = TODAY_APPOINTMENTS.find(a => a.id === id);
            if (apt) {
                const patient = MOCK_PATIENTS.find(p => p.id === apt.patientId);
                if (patient) {
                    setSelectedPatient(patient);
                    setPatientSearch(patient.name);
                }
                setFormData({
                    doctor: apt.doctor,
                    date: new Date(apt.date).toISOString().split('T')[0],
                    time: apt.time,
                    treatment: apt.treatment,
                    room: apt.room || '',
                    status: apt.status,
                    notes: apt.notes || '',
                    usePackage: false
                });
            }
        }
    }, [id]);

    const matchingPackage = useMemo(() => {
        if (!selectedPatient || !formData.treatment) return null;
        return selectedPatient.serviceWallet?.find(
            pkg => pkg.status === 'Active' && 
                   pkg.remainingUnits > 0 && 
                   (pkg.procedureName === formData.treatment || pkg.packageName.includes(formData.treatment))
        );
    }, [selectedPatient, formData.treatment]);

    useEffect(() => {
        if (matchingPackage) setFormData(prev => ({ ...prev, usePackage: true }));
    }, [matchingPackage]);

    const estimatedCost = useMemo(() => {
        if (selectedUpsellPackage) return selectedUpsellPackage.totalPrice;
        if (matchingPackage && formData.usePackage) return 0;
        const procedure = MOCK_PROCEDURES.find(p => p.name === formData.treatment);
        return procedure ? procedure.finalPrice : 0;
    }, [formData.treatment, matchingPackage, formData.usePackage, selectedUpsellPackage]);

    const walletCoverage = useMemo(() => {
        if (!selectedPatient) return { status: 'none', remainingPay: estimatedCost };
        const balance = selectedPatient.walletBalance || 0;
        if (estimatedCost === 0) return { status: 'covered', remainingPay: 0 };
        if (balance >= estimatedCost) return { status: 'full_deposit', remainingPay: 0, balanceAfter: balance - estimatedCost };
        return { status: 'partial_deposit', remainingPay: estimatedCost - balance, balanceAfter: 0 };
    }, [selectedPatient, estimatedCost]);

    const handleSave = () => {
        if (!selectedPatient || !formData.treatment) {
            alert("Please select a patient and a treatment.");
            return;
        }
        const doctorInit = formData.doctor.split(' ')[1]?.charAt(0) || 'A';
        const queueNo = `${doctorInit}-${Math.floor(Math.random() * 20) + 1}`;
        setSuccessData({
            patient: selectedPatient,
            treatment: formData.treatment,
            doctor: formData.doctor,
            date: formData.date,
            time: formData.time,
            queueNo: queueNo
        });
        setShowSuccessModal(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <PackageListModal 
                isOpen={isPackageListOpen}
                onClose={() => setIsPackageListOpen(false)}
                filterTreatment={formData.treatment}
                onSelectOfInterest={(pkg) => setSelectedUpsellPackage(pkg)}
            />
            <BookingSuccessModal isOpen={showSuccessModal} onClose={() => navigate('/agenda')} data={successData} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/agenda')} className="p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-all">
                        <ArrowLeft size={20}/>
                    </button>
                    <h1 className="text-2xl font-bold text-text-dark">{id ? 'Edit' : 'New'} Reservation</h1>
                </div>
                <button onClick={handleSave} className="bg-soft-gold text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#cbad85] transition-all flex items-center gap-2">
                    <CheckCircle2 size={18}/> Confirm Booking
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-6">Reservation Details</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-text-dark mb-2">Select Patient</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                        placeholder="Search patient name..."
                                        value={patientSearch}
                                        onChange={(e) => { setPatientSearch(e.target.value); setShowPatientDropdown(true); }}
                                    />
                                    {showPatientDropdown && patientSearch && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                                            {MOCK_PATIENTS.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase())).map(p => (
                                                <div key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(p.name); setShowPatientDropdown(false); }} className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0">
                                                    <div className="font-bold text-sm">{p.name}</div>
                                                    <div className="text-xs text-text-muted">{p.phone}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-text-dark mb-2">Treatment</label>
                                    <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none" value={formData.treatment} onChange={(e) => setFormData({...formData, treatment: e.target.value})}>
                                        <option value="">Select Service...</option>
                                        {MOCK_PROCEDURES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-dark mb-2">Doctor</label>
                                    <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none" value={formData.doctor} onChange={(e) => setFormData({...formData, doctor: e.target.value})}>
                                        <option>Dr. Sarah</option>
                                        <option>Dr. James</option>
                                        <option>Dr. A. Wijaya</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-text-dark mb-2">Date</label>
                                    <input type="date" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-dark mb-2">Time</label>
                                    <input type="time" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-dark mb-2">Room</label>
                                    <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})}>
                                        <option value="">Auto</option>
                                        {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-text-dark text-white p-6 rounded-2xl shadow-xl">
                        <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Financial Overview</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm opacity-70">Estimated Cost</span>
                                <span className="font-bold">Rp {estimatedCost.toLocaleString()}</span>
                            </div>
                            {selectedPatient && (
                                <div className="flex justify-between items-center text-soft-gold border-t border-white/10 pt-4">
                                    <span className="text-sm">Wallet Balance</span>
                                    <span className="font-bold">Rp {(selectedPatient.walletBalance || 0).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="bg-white/10 p-3 rounded-lg mt-4">
                                {walletCoverage.status === 'full_deposit' ? (
                                    <p className="text-xs text-sage font-bold flex items-center gap-2">
                                        <CheckCircle2 size={14}/> Paid with Deposit
                                    </p>
                                ) : (
                                    <p className="text-xs text-white/80">
                                        Remaining Payment: <span className="text-rose font-bold">Rp {walletCoverage.remainingPay.toLocaleString()}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentFormPage;