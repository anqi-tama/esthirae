import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, 
    Plus, 
    Filter, 
    MoreHorizontal, 
    Edit2, 
    Trash2, 
    ClipboardList, 
    Tag,
    DollarSign,
    Package,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Procedure, ProcedureCategory } from '../types';
import { MOCK_PROCEDURES } from '../constants';
import ProcedureModal from '../components/modals/ProcedureModal';

const Procedures: React.FC = () => {
    const [procedures, setProcedures] = useState<Procedure[]>(MOCK_PROCEDURES);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // --- Logic ---

    const handleSave = (procedure: Procedure) => {
        if (procedures.some(p => p.id === procedure.id)) {
            // Edit
            setProcedures(prev => prev.map(p => p.id === procedure.id ? procedure : p));
        } else {
            // Add
            setProcedures(prev => [procedure, ...prev]);
        }
        setEditingProcedure(null);
    };

    const handleEdit = (proc: Procedure) => {
        setEditingProcedure(proc);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure? This service will be deactivated.")) {
            // Soft delete or status update preferred in real app
            setProcedures(prev => prev.map(p => p.id === id ? { ...p, status: 'Inactive' } : p));
        }
    };

    const handleCreateNew = () => {
        setEditingProcedure(null);
        setIsModalOpen(true);
    };

    // Dynamic Categories based on table data
    const categories = useMemo(() => {
        const uniqueCats = Array.from(new Set(procedures.map(p => p.category)));
        return ['All', ...uniqueCats];
    }, [procedures]);

    const filteredProcedures = useMemo(() => {
        return procedures.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                p.code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
            return matchSearch && matchCat;
        });
    }, [procedures, searchTerm, selectedCategory]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    // Pagination Slicing
    const totalPages = Math.ceil(filteredProcedures.length / ITEMS_PER_PAGE);
    const paginatedProcedures = filteredProcedures.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <ProcedureModal 
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingProcedure(null); }}
                onSave={handleSave}
                procedureToEdit={editingProcedure}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-medium text-text-dark">Service Management</h1>
                    <p className="text-text-muted mt-1">Manage clinical treatments, BOM, and pricing structure.</p>
                </div>
                <button 
                    onClick={handleCreateNew}
                    className="bg-soft-gold text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg hover:bg-[#cbad85] flex items-center gap-2 transition-all"
                >
                    <Plus size={18} /> New Service
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-xl shadow-soft space-y-4 md:space-y-0 md:flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                    <input 
                        type="text" 
                        placeholder="Search service code or name..." 
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all whitespace-nowrap ${
                                selectedCategory === cat 
                                ? 'bg-text-dark text-white border-text-dark' 
                                : 'bg-white text-text-muted border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Grid */}
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-ivory border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Code / Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Cost (HPP)</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Price</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">Margin</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginatedProcedures.map(proc => (
                            <tr key={proc.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-soft-gold/10 flex items-center justify-center text-soft-gold">
                                            <ClipboardList size={16}/>
                                        </div>
                                        <div>
                                            <div className="font-medium text-text-dark">{proc.name}</div>
                                            <div className="text-xs text-text-muted font-mono">{proc.code}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-text-muted flex items-center gap-1">
                                        <Tag size={12}/> {proc.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="text-sm text-text-muted">Rp {proc.totalCost.toLocaleString()}</div>
                                    {proc.items.length > 0 && (
                                        <div className="text-[10px] text-gray-400 flex items-center justify-end gap-1">
                                            <Package size={10}/> {proc.items.length} items
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="text-sm font-bold text-text-dark">Rp {proc.finalPrice.toLocaleString()}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        proc.marginPercent >= 100 ? 'bg-sage/10 text-sage' : 
                                        proc.marginPercent >= 50 ? 'bg-blue-50 text-blue-600' :
                                        'bg-amber/10 text-amber'
                                    }`}>
                                        {proc.marginPercent.toFixed(0)}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                        proc.status === 'Active' ? 'bg-white border-gray-200 text-text-dark' : 'bg-gray-100 border-gray-200 text-gray-400'
                                    }`}>
                                        {proc.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(proc)}
                                            className="p-1.5 rounded-lg text-text-muted hover:text-soft-gold hover:bg-soft-gold/10 transition-all"
                                            title="Edit Service"
                                        >
                                            <Edit2 size={16}/>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(proc.id)}
                                            className="p-1.5 rounded-lg text-text-muted hover:text-rose hover:bg-rose/10 transition-all"
                                            title="Deactivate"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {paginatedProcedures.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-text-muted">
                                    No services found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="text-xs text-text-muted">
                        Showing {filteredProcedures.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProcedures.length)} of {filteredProcedures.length} entries
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

export default Procedures;