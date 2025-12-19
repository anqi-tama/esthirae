
import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, 
    Filter, 
    MoreHorizontal, 
    ArrowRightCircle,
    PlayCircle,
    CheckCircle2,
    Clock,
    Calendar,
    ChevronLeft,
    ChevronRight,
    MapPin,
    User,
    Activity
} from 'lucide-react';
import { MOCK_TREATMENTS } from '../constants';
import { Treatment, TreatmentStatus } from '../types';
import TreatmentDetail from '../components/TreatmentDetail';

const Treatments: React.FC = () => {
    const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    // Default to today for better workflow context
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // --- Logic ---
    const handleViewDetail = (treatment: Treatment) => {
        setSelectedTreatment(treatment);
    };

    const handleUpdateTreatment = (updated: Treatment) => {
        // In a real app, update state/backend here
        console.log("Updated treatment:", updated);
        setSelectedTreatment(updated); 
    };

    // Filter Logic
    const filteredTreatments = useMemo(() => {
        return MOCK_TREATMENTS.filter(t => {
            const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
            const matchesSearch = t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  t.type.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Date Filtering
            const treatmentDate = t.date.toISOString().split('T')[0];
            const matchesDate = !selectedDate || treatmentDate === selectedDate;

            return matchesStatus && matchesSearch && matchesDate;
        });
    }, [filterStatus, searchTerm, selectedDate]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, searchTerm, selectedDate]);

    // Pagination Slicing
    const totalPages = Math.ceil(filteredTreatments.length / ITEMS_PER_PAGE);
    const paginatedTreatments = filteredTreatments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getStatusColor = (status: TreatmentStatus) => {
        switch(status) {
            case TreatmentStatus.WAITING: return 'bg-gray-100 text-gray-600 border-gray-200';
            case TreatmentStatus.IN_PROGRESS: return 'bg-soft-gold/10 text-[#b5986a] border-soft-gold/30';
            case TreatmentStatus.COMPLETED: return 'bg-sage/10 text-sage border-sage/30';
            case TreatmentStatus.CANCELLED: return 'bg-rose/10 text-rose border-rose/30';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    const getActionIcon = (status: TreatmentStatus) => {
        switch(status) {
            case TreatmentStatus.WAITING: return <PlayCircle size={18} />;
            case TreatmentStatus.IN_PROGRESS: return <ArrowRightCircle size={18} />;
            case TreatmentStatus.COMPLETED: return <CheckCircle2 size={18} />;
            default: return <MoreHorizontal size={18} />;
        }
    };

    // --- Render Detail View ---
    if (selectedTreatment) {
        return (
            <TreatmentDetail 
                treatment={selectedTreatment} 
                onBack={() => setSelectedTreatment(null)}
                onUpdate={handleUpdateTreatment}
            />
        );
    }

    // --- Render List View ---
    return (
        <div className="space-y-6 animate-fade-in">
             {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-medium text-text-dark">Clinical Treatments</h1>
                    <p className="text-text-muted mt-1">Daily treatment workflow and medical documentation.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-xl shadow-soft flex flex-col xl:flex-row gap-4 xl:items-center">
                
                {/* Status Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
                    {['All', TreatmentStatus.WAITING, TreatmentStatus.IN_PROGRESS, TreatmentStatus.COMPLETED].map(status => (
                         <button 
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all whitespace-nowrap ${
                                filterStatus === status 
                                ? 'bg-text-dark text-white border-text-dark shadow-md' 
                                : 'bg-white text-text-muted border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                
                <div className="flex-1 hidden xl:block"></div>

                {/* Right Side: Date & Search */}
                <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                    {/* Date Picker */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                            type="date" 
                            className="w-full md:w-auto pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-soft-gold text-text-dark font-medium"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                            type="text" 
                            placeholder="Search patient or treatment..." 
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Treatment Data Table */}
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-ivory border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Patient Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Treatment Info</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Schedule</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginatedTreatments.length > 0 ? (
                            paginatedTreatments.map((treatment) => (
                                <tr 
                                    key={treatment.id} 
                                    onClick={() => handleViewDetail(treatment)}
                                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-soft-gold/10 flex items-center justify-center text-soft-gold shrink-0">
                                                <User size={14}/>
                                            </div>
                                            <div>
                                                <div className="font-bold text-text-dark text-sm">{treatment.patientName}</div>
                                                <div className="text-xs text-text-muted font-mono">{treatment.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-text-dark text-sm">{treatment.type}</div>
                                        <div className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                                            <Activity size={12}/> {treatment.doctorName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-text-dark">
                                            <Clock size={14} className="text-text-muted"/>
                                            {treatment.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                                            <MapPin size={12}/> {treatment.room}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(treatment.status)}`}>
                                            {treatment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end">
                                            <button className="p-2 rounded-full bg-ivory text-text-muted group-hover:bg-soft-gold group-hover:text-white transition-colors shadow-sm">
                                                {getActionIcon(treatment.status)}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Calendar size={32} className="opacity-20"/>
                                        <p>No treatments found for this criteria.</p>
                                        <button onClick={() => { setSelectedDate(''); setSearchTerm(''); setFilterStatus('All'); }} className="text-xs text-soft-gold hover:underline">
                                            Clear Filters
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="text-xs text-text-muted">
                        Showing {filteredTreatments.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTreatments.length)} of {filteredTreatments.length} treatments
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

export default Treatments;
