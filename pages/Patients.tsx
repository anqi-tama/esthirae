import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, 
    Plus, 
    FileText, 
    UserCog,
    ArrowUpDown,
    ArrowDownAZ,
    ArrowUpAZ,
    Wallet,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { MOCK_PATIENTS } from '../constants';
import { Patient } from '../types';
import PatientDetail from '../components/PatientDetail';
import PatientForm from '../components/PatientForm';

type SortOption = 'newest' | 'name_asc' | 'name_desc';
type ViewState = 'list' | 'profile_form' | 'emr';

const Patients: React.FC = () => {
    // View State
    const [view, setView] = useState<ViewState>('list');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [detailInitialTab, setDetailInitialTab] = useState<'EMR' | 'Wallet'>('EMR');

    // Filter States
    const [filters, setFilters] = useState({
        name: '',
        phone: ''
    });
    const [sortBy, setSortBy] = useState<SortOption>('newest');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // --- Logic ---

    const handleAction = (action: 'detail' | 'emr' | 'wallet', patient: Patient) => {
        setSelectedPatient(patient);
        if (action === 'detail') {
            setView('profile_form');
        } else if (action === 'wallet') {
            setDetailInitialTab('Wallet');
            setView('emr');
        } else {
            setDetailInitialTab('EMR');
            setView('emr');
        }
    };

    const handleAddNew = () => {
        setSelectedPatient(null);
        setView('profile_form');
    }

    const handleBackToList = () => {
        setView('list');
        setSelectedPatient(null);
    }

    const handleSaveForm = (data: any) => {
        console.log("Saving patient data:", data);
        // Here you would implement update/create logic
        handleBackToList();
    }

    const filteredAndSortedPatients = useMemo(() => {
        // 1. Filter
        let result = MOCK_PATIENTS.filter(p => {
            const matchName = p.name.toLowerCase().includes(filters.name.toLowerCase());
            const matchPhone = p.phone.includes(filters.phone);
            return matchName && matchPhone;
        });

        // 2. Sort
        result.sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
            } else if (sortBy === 'name_asc') {
                return a.name.localeCompare(b.name);
            } else if (sortBy === 'name_desc') {
                return b.name.localeCompare(a.name);
            }
            return 0;
        });

        return result;
    }, [filters, sortBy]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortBy]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredAndSortedPatients.length / ITEMS_PER_PAGE);
    const paginatedPatients = filteredAndSortedPatients.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // --- Render Detail (Form) View ---
    if (view === 'profile_form') {
        return (
            <div className="h-[calc(100vh-140px)]">
                <PatientForm 
                    initialData={selectedPatient}
                    onCancel={handleBackToList}
                    onSave={handleSaveForm}
                />
            </div>
        );
    }

    // --- Render EMR View ---
    if (view === 'emr' && selectedPatient) {
        return (
            <PatientDetail 
                patient={selectedPatient} 
                onBack={handleBackToList} 
                initialTab={detailInitialTab}
            />
        );
    }

    // --- Render List View ---
    return (
        <div className="space-y-6 animate-fade-in">
             {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-medium text-text-dark">Patients & EMR</h1>
                    <p className="text-text-muted mt-1">Manage patient records and medical history.</p>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="bg-soft-gold text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg shadow-soft-gold/20 hover:bg-[#cbad85] flex items-center gap-2 transition-all"
                >
                    <Plus size={18} /> Add New Patient
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-xl shadow-soft space-y-4 md:space-y-0 md:flex items-end gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Name</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                            <input 
                                type="text" 
                                placeholder="Search by name..." 
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                                value={filters.name}
                                onChange={(e) => setFilters({...filters, name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                         <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Phone No</label>
                        <input 
                            type="text" 
                            placeholder="08..." 
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                             value={filters.phone}
                             onChange={(e) => setFilters({...filters, phone: e.target.value})}
                        />
                    </div>
                </div>
                
                <div className="min-w-[160px]">
                     <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Sort By</label>
                     <div className="relative">
                        <select 
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold appearance-none cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                        >
                            <option value="newest">Last Visit (Newest)</option>
                            <option value="name_asc">Name (A-Z)</option>
                            <option value="name_desc">Name (Z-A)</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                            {sortBy === 'newest' && <ArrowUpDown size={14} />}
                            {sortBy === 'name_asc' && <ArrowDownAZ size={14} />}
                            {sortBy === 'name_desc' && <ArrowUpAZ size={14} />}
                        </div>
                     </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-soft overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-ivory border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Patient Info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Age / Gender</th>
                                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Last Visit</th>
                                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Last Doctor</th>
                                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Loyalty</th>
                                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedPatients.map((patient) => {
                                 const age = patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : 'N/A';
                                 return (
                                    <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={patient.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"/>
                                                <div>
                                                    <div className="font-medium text-text-dark">{patient.name}</div>
                                                    <div className="text-xs text-text-muted">ID: {patient.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-text-dark">{age} Years</div>
                                            <div className="text-xs text-text-muted">{patient.gender}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-text-dark font-medium">
                                                {patient.lastVisit.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-muted">
                                            {patient.lastDoctor}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                patient.tier === 'Platinum' ? 'bg-[#e5e4e2] border-gray-300 text-gray-700' : 
                                                patient.tier === 'Gold' ? 'bg-soft-gold/20 border-soft-gold/30 text-[#b5986a]' :
                                                'bg-gray-100 border-gray-200 text-gray-500'
                                            }`}>
                                                {patient.tier}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    title="Wallet & Finance"
                                                    onClick={(e) => { e.stopPropagation(); handleAction('wallet', patient); }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-text-muted hover:text-soft-gold hover:border-soft-gold transition-all shadow-sm text-xs font-medium"
                                                >
                                                    <Wallet size={14} /> Wallet
                                                </button>
                                                <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
                                                <button 
                                                    title="View Details"
                                                    onClick={(e) => { e.stopPropagation(); handleAction('detail', patient); }}
                                                    className="p-1.5 rounded-lg text-text-muted hover:text-text-dark hover:bg-gray-100 transition-all"
                                                >
                                                    <UserCog size={16} />
                                                </button>
                                                <button 
                                                    title="Medical Records"
                                                    onClick={(e) => { e.stopPropagation(); handleAction('emr', patient); }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-soft-gold text-white shadow-md hover:bg-[#cbad85] transition-colors text-xs font-medium"
                                                >
                                                    <FileText size={14} /> RM
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                 );
                            })}
                            {paginatedPatients.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                                        No patients found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="text-xs text-text-muted">
                        Showing {filteredAndSortedPatients.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedPatients.length)} of {filteredAndSortedPatients.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-text-dark"
                        >
                            <ChevronLeft size={16}/>
                        </button>
                        <span className="text-xs font-medium text-text-dark px-2">
                            Page {currentPage} of {Math.max(1, totalPages)}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage >= totalPages || totalPages === 0}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-text-dark"
                        >
                            <ChevronRight size={16}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Patients;