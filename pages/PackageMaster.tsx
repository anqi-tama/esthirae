import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, 
    Plus, 
    Box, 
    MoreHorizontal, 
    Edit2, 
    Trash2, 
    Clock, 
    Tag, 
    Layers, 
    DollarSign, 
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react';
import { PackageMaster } from '../types';
import { MOCK_PACKAGES } from '../constants';
import PackageModal from '../components/modals/PackageModal';

const PackageMasterPage: React.FC = () => {
    const [packages, setPackages] = useState<PackageMaster[]>(MOCK_PACKAGES);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<PackageMaster | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // --- Logic ---

    const handleSave = (pkg: PackageMaster) => {
        if (packages.some(p => p.id === pkg.id)) {
            // Edit
            setPackages(prev => prev.map(p => p.id === pkg.id ? pkg : p));
        } else {
            // Add
            setPackages(prev => [pkg, ...prev]);
        }
        setEditingPackage(null);
    };

    const handleEdit = (pkg: PackageMaster) => {
        setEditingPackage(pkg);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure? This package will be deactivated.")) {
            setPackages(prev => prev.map(p => p.id === id ? { ...p, status: 'Inactive' } : p));
        }
    };

    const handleCreateNew = () => {
        setEditingPackage(null);
        setIsModalOpen(true);
    };

    const filteredPackages = useMemo(() => {
        return packages.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                p.code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = filterStatus === 'All' || p.status === filterStatus;
            return matchSearch && matchStatus;
        });
    }, [packages, searchTerm, filterStatus]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);

    // Pagination Slicing
    const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
    const paginatedPackages = filteredPackages.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <PackageModal 
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingPackage(null); }}
                onSave={handleSave}
                packageToEdit={editingPackage}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-medium text-text-dark">Package Treatment</h1>
                    <p className="text-text-muted mt-1">Manage bundled services and treatment packages.</p>
                </div>
                <button 
                    onClick={handleCreateNew}
                    className="bg-soft-gold text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg hover:bg-[#cbad85] flex items-center gap-2 transition-all"
                >
                    <Plus size={18} /> New Package
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-xl shadow-soft space-y-4 md:space-y-0 md:flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                    <input 
                        type="text" 
                        placeholder="Search package code or name..." 
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'Active', 'Inactive'].map(status => (
                        <button 
                            key={status}
                            onClick={() => setFilterStatus(status as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all whitespace-nowrap ${
                                filterStatus === status 
                                ? 'bg-text-dark text-white border-text-dark' 
                                : 'bg-white text-text-muted border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-ivory border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Package Info</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Contents</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Validity</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Price</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginatedPackages.map(pkg => {
                            const totalUnits = pkg.items.reduce((sum, i) => sum + i.unitCount, 0);
                            return (
                                <tr key={pkg.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-soft-gold/10 flex items-center justify-center text-soft-gold shrink-0">
                                                <Box size={20}/>
                                            </div>
                                            <div>
                                                <div className="font-bold text-text-dark">{pkg.name}</div>
                                                <div className="text-xs text-text-muted font-mono">{pkg.code}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium text-text-dark flex items-center gap-1">
                                                <Layers size={14} className="text-text-muted"/> {totalUnits} Units
                                            </div>
                                            <p className="text-xs text-text-muted line-clamp-1 max-w-[200px]">
                                                {pkg.items.map(i => `${i.unitCount}x ${i.procedureName}`).join(', ')}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-text-dark flex items-center gap-1">
                                            <Clock size={14} className="text-text-muted"/> {pkg.validityDays} Days
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-sm font-bold text-soft-gold">Rp {pkg.totalPrice.toLocaleString()}</div>
                                        {pkg.savingsPercent && (
                                            <div className="text-[10px] text-sage font-medium">
                                                Save {pkg.savingsPercent}%
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                            pkg.status === 'Active' ? 'bg-sage/10 text-sage border-sage/30' : 'bg-gray-100 text-gray-500 border-gray-200'
                                        }`}>
                                            {pkg.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(pkg)}
                                                className="p-1.5 rounded-lg text-text-muted hover:text-soft-gold hover:bg-soft-gold/10 transition-all"
                                                title="Edit Package"
                                            >
                                                <Edit2 size={16}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(pkg.id)}
                                                className="p-1.5 rounded-lg text-text-muted hover:text-rose hover:bg-rose/10 transition-all"
                                                title="Deactivate"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {paginatedPackages.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Box size={32} className="opacity-20"/>
                                        <p>No packages found matching your criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="text-xs text-text-muted">
                        Showing {filteredPackages.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredPackages.length)} of {filteredPackages.length} entries
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

export default PackageMasterPage;