import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Plus, 
    FileText, 
    ArrowUpRight,
    AlertTriangle,
    CheckCircle2,
    MoreHorizontal,
    ArrowLeft,
    Calendar,
    User,
    ChevronRight,
    ChevronLeft,
    Save,
    UploadCloud,
    Download,
    FileSpreadsheet,
    XCircle,
    AlertCircle,
    ClipboardCheck,
    Layers,
    Truck,
    Package,
    History,
    TrendingUp,
    DollarSign,
    Box
} from 'lucide-react';
import { MOCK_INVENTORY_ITEMS, MOCK_STOCK_LOGS, MOCK_PURCHASE_ORDERS } from '../constants';
import { InventoryItem, StockMovement, PurchaseOrder, StockOpnameSession } from '../types';
import InventoryModal from '../components/modals/InventoryModal';
import CreatePOModal from '../components/modals/CreatePOModal';

// Define the allowed view types corresponding to routes
type InventoryViewType = 'catalog' | 'purchasing' | 'stock' | 'opname' | 'logs';

interface InventoryProps {
    view?: InventoryViewType;
}

// Mock Data for Opname Sessions
const MOCK_OPNAME_SESSIONS: StockOpnameSession[] = [
    {
        id: 'SO-2023-10-01',
        date: new Date('2023-10-01'),
        status: 'Completed',
        performedBy: 'Admin Gudang',
        notes: 'Monthly regular audit',
        items: []
    }
];

const Inventory: React.FC<InventoryProps> = ({ view = 'catalog' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    // Data State
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(MOCK_INVENTORY_ITEMS);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
    
    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPOCreationOpen, setIsPOCreationOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Reset pagination when filter or view changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, view]);

    // Handlers
    const handleSaveNewProduct = (newItem: InventoryItem) => {
        setInventoryItems([newItem, ...inventoryItems]);
        alert(`Product "${newItem.name}" added successfully!`);
    };

    const handleSavePO = (newPO: PurchaseOrder) => {
        setPurchaseOrders([newPO, ...purchaseOrders]);
        alert(`Purchase Order ${newPO.id} created as ${newPO.status}!`);
    };

    // --- Sub-Components (Views) ---

    // 1. Catalog View (Master Data)
    const CatalogView = () => {
        const filteredItems = inventoryItems.filter(i => 
            i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
        const paginatedItems = filteredItems.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );

        return (
            <div className="bg-white rounded-xl shadow-soft overflow-hidden animate-fade-in">
                 <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-text-dark">Product Master Data</h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 bg-soft-gold text-white text-sm font-medium rounded-lg hover:bg-[#cbad85] flex items-center gap-2 transition-colors"
                        >
                            <Plus size={16}/> Add Product
                        </button>
                    </div>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                        <tr>
                            <th className="px-6 py-4">SKU / Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Supplier</th>
                            <th className="px-6 py-4 text-right">Cost (HPP)</th>
                            <th className="px-6 py-4 text-right">Price (Sell)</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginatedItems.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-text-dark">{item.name}</div>
                                    <div className="text-xs text-text-muted">{item.sku}</div>
                                </td>
                                <td className="px-6 py-4 text-text-muted">{item.category}</td>
                                <td className="px-6 py-4 text-text-muted">{item.supplierName}</td>
                                <td className="px-6 py-4 text-right">Rp {item.buyPrice.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">Rp {item.sellPrice.toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${item.status === 'Active' ? 'bg-sage/10 text-sage border-sage/30' : 'bg-gray-100 text-gray-500'}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-text-dark"><MoreHorizontal size={16}/></button>
                                </td>
                            </tr>
                        ))}
                        {paginatedItems.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-text-muted">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <FileText size={32} className="opacity-20"/>
                                        <p>No products found matching your search.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="text-xs text-text-muted">
                        Showing {filteredItems.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} entries
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
        );
    };

    // --- Product Detail Sub-Component ---
    const ProductDetailView = ({ item, onBack }: { item: InventoryItem; onBack: () => void }) => {
        // Pagination State for Detail View
        const [batchPage, setBatchPage] = useState(1);
        const [historyPage, setHistoryPage] = useState(1);
        const DETAIL_ITEMS_PER_PAGE = 5;

        // Mock Logs for this specific item
        const itemLogs = MOCK_STOCK_LOGS.filter(log => log.itemId === item.id || log.itemName === item.name);
        
        // Mock Batches (Simulated) - Expanded for demo
        const mockBatches = [
            { id: 'B001', batchNo: 'BATCH-2023-A', expiry: new Date('2025-10-01'), qty: Math.floor(item.currentStock * 0.4), cost: item.buyPrice, purchaseDate: new Date('2023-01-15') },
            { id: 'B002', batchNo: 'BATCH-2023-B', expiry: new Date('2026-02-15'), qty: Math.ceil(item.currentStock * 0.3), cost: item.buyPrice * 1.05, purchaseDate: new Date('2023-06-20') },
            { id: 'B003', batchNo: 'BATCH-2023-C', expiry: new Date('2026-05-20'), qty: Math.floor(item.currentStock * 0.2), cost: item.buyPrice * 1.10, purchaseDate: new Date('2023-09-10') },
            { id: 'B004', batchNo: 'BATCH-2023-D', expiry: new Date('2026-08-05'), qty: Math.ceil(item.currentStock * 0.1), cost: item.buyPrice * 1.02, purchaseDate: new Date('2023-11-01') },
            { id: 'B005', batchNo: 'BATCH-2024-A', expiry: new Date('2027-01-12'), qty: 0, cost: item.buyPrice * 1.15, purchaseDate: new Date('2024-01-05') }, // History batch
            { id: 'B006', batchNo: 'BATCH-2024-B', expiry: new Date('2027-03-30'), qty: 0, cost: item.buyPrice * 1.12, purchaseDate: new Date('2024-02-20') },
        ];

        // Pagination Logic
        const totalBatchPages = Math.ceil(mockBatches.length / DETAIL_ITEMS_PER_PAGE);
        const paginatedBatches = mockBatches.slice(
            (batchPage - 1) * DETAIL_ITEMS_PER_PAGE,
            batchPage * DETAIL_ITEMS_PER_PAGE
        );

        const totalHistoryPages = Math.ceil(itemLogs.length / DETAIL_ITEMS_PER_PAGE);
        const paginatedHistory = itemLogs.slice(
            (historyPage - 1) * DETAIL_ITEMS_PER_PAGE,
            historyPage * DETAIL_ITEMS_PER_PAGE
        );

        return (
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-text-muted hover:text-text-dark transition-colors">
                            <ArrowLeft size={20}/>
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-text-dark uppercase">{item.name}</h2>
                            <p className="text-sm text-text-muted">SKU: {item.sku} • {item.category}</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-soft-gold text-white text-sm font-bold rounded-lg shadow-md hover:bg-[#cbad85] transition-all flex items-center gap-2">
                        <DollarSign size={16}/> Update Price
                    </button>
                </div>

                {/* Stock Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <div className="text-sm text-text-muted font-bold uppercase tracking-wide">Total Stock</div>
                            <div className="text-4xl font-bold text-text-dark mt-2">{item.currentStock} <span className="text-lg font-medium text-text-muted">{item.unit}</span></div>
                        </div>
                        <div className="w-16 h-16 bg-soft-gold/10 rounded-full flex items-center justify-center text-soft-gold">
                            <Package size={32}/>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <div className="text-sm text-text-muted font-bold uppercase tracking-wide">Minimum Stock Alert</div>
                            <div className="text-4xl font-bold text-rose mt-2">{item.minStock} <span className="text-lg font-medium text-text-muted">{item.unit}</span></div>
                        </div>
                        <div className="w-16 h-16 bg-rose/10 rounded-full flex items-center justify-center text-rose">
                            <AlertTriangle size={32}/>
                        </div>
                    </div>
                </div>

                {/* Pricing Details */}
                <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
                    <h3 className="font-bold text-text-dark mb-4 border-b border-gray-100 pb-2">Price Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                        <div>
                            <div className="text-xs text-text-muted uppercase">Selling Price</div>
                            <div className="text-xl font-bold text-text-dark mt-1">Rp {item.sellPrice.toLocaleString()}</div>
                        </div>
                        <div className="border-l border-gray-100 pl-8">
                            <div className="text-xs text-text-muted uppercase">Cost Price (HPP)</div>
                            <div className="text-xl font-bold text-text-muted mt-1">Rp {item.buyPrice.toLocaleString()}</div>
                        </div>
                        <div className="border-l border-gray-100 pl-8">
                            <div className="text-xs text-text-muted uppercase">Estimated Margin</div>
                            <div className="text-xl font-bold text-sage mt-1">
                                Rp {(item.sellPrice - item.buyPrice).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Batches Table */}
                <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-text-dark flex items-center gap-2">
                            <Box size={16} className="text-soft-gold"/> Batch In Stock ({item.unit})
                        </h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                            <tr>
                                <th className="px-6 py-3">Batch No</th>
                                <th className="px-6 py-3 text-center">Stock</th>
                                <th className="px-6 py-3">Expiry Date</th>
                                <th className="px-6 py-3 text-right">Cost (HPP)</th>
                                <th className="px-6 py-3 text-right">Purchase Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedBatches.map(batch => (
                                <tr key={batch.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-mono font-medium text-text-dark">{batch.batchNo}</td>
                                    <td className="px-6 py-3 text-center font-bold">{batch.qty}</td>
                                    <td className="px-6 py-3 text-text-dark">{batch.expiry.toLocaleDateString()}</td>
                                    <td className="px-6 py-3 text-right">Rp {batch.cost.toLocaleString()}</td>
                                    <td className="px-6 py-3 text-right text-text-muted">{batch.purchaseDate.toLocaleDateString()}</td>
                                
                                </tr>
                            ))}
                            {paginatedBatches.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-text-muted">No batch information available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                    {/* Batch Pagination */}
                    {totalBatchPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                            <div className="text-xs text-text-muted">
                                Showing {(batchPage - 1) * DETAIL_ITEMS_PER_PAGE + 1} to {Math.min(batchPage * DETAIL_ITEMS_PER_PAGE, mockBatches.length)} of {mockBatches.length} entries
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setBatchPage(prev => Math.max(prev - 1, 1))}
                                    disabled={batchPage === 1}
                                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-text-dark"
                                >
                                    <ChevronLeft size={16}/>
                                </button>
                                <span className="text-xs font-medium text-text-dark px-2">
                                    Page {batchPage} of {totalBatchPages}
                                </span>
                                <button 
                                    onClick={() => setBatchPage(prev => Math.min(prev + 1, totalBatchPages))}
                                    disabled={batchPage === totalBatchPages}
                                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-text-dark"
                                >
                                    <ChevronRight size={16}/>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* History Logs */}
                <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-text-dark flex items-center gap-2">
                            <History size={16} className="text-soft-gold"/> Stock History ({item.unit})
                        </h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                            <tr>
                                <th className="px-6 py-3">Activity</th>
                                <th className="px-6 py-3">Performed By</th>
                                <th className="px-6 py-3 text-center">In</th>
                                <th className="px-6 py-3 text-center">Out</th>
                                <th className="px-6 py-3 text-center">Balance</th>
                                <th className="px-6 py-3 text-right">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedHistory.length > 0 ? paginatedHistory.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-medium text-text-dark">{log.reason}</td>
                                    <td className="px-6 py-3 text-text-muted">{log.actor}</td>
                                    <td className="px-6 py-3 text-center text-sage font-bold">
                                        {log.type === 'IN' ? log.qty : 0}
                                    </td>
                                    <td className="px-6 py-3 text-center text-rose font-bold">
                                        {log.type === 'OUT' ? Math.abs(log.qty) : 0}
                                    </td>
                                    <td className="px-6 py-3 text-center font-bold text-text-dark">
                                        {/* Mock Calculation for demo */}
                                        {item.currentStock}
                                    </td>
                                    <td className="px-6 py-3 text-right text-text-muted">
                                        {log.date.toLocaleDateString()} {log.date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="text-center py-6 text-text-muted">No history logs found.</td></tr>
                            )}
                        </tbody>
                    </table>

                    {/* History Pagination */}
                    {totalHistoryPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                            <div className="text-xs text-text-muted">
                                Showing {(historyPage - 1) * DETAIL_ITEMS_PER_PAGE + 1} to {Math.min(historyPage * DETAIL_ITEMS_PER_PAGE, itemLogs.length)} of {itemLogs.length} entries
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setHistoryPage(prev => Math.max(prev - 1, 1))}
                                    disabled={historyPage === 1}
                                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-text-dark"
                                >
                                    <ChevronLeft size={16}/>
                                </button>
                                <span className="text-xs font-medium text-text-dark px-2">
                                    Page {historyPage} of {totalHistoryPages}
                                </span>
                                <button 
                                    onClick={() => setHistoryPage(prev => Math.min(prev + 1, totalHistoryPages))}
                                    disabled={historyPage === totalHistoryPages}
                                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-text-dark"
                                >
                                    <ChevronRight size={16}/>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // 2. Stock Levels View (Live Info) - Updated with Detail Switch
    const StockLevelsView = () => {
        const [selectedItemForDetail, setSelectedItemForDetail] = useState<InventoryItem | null>(null);

        // If an item is selected, show detail view instead of table
        if (selectedItemForDetail) {
            return <ProductDetailView item={selectedItemForDetail} onBack={() => setSelectedItemForDetail(null)} />;
        }

        const filteredItems = inventoryItems.filter(i => 
            i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
        const paginatedItems = filteredItems.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );

        return (
            <div className="bg-white rounded-xl shadow-soft overflow-hidden animate-fade-in">
                 <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-text-dark">Current Stock Levels</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-200 text-text-dark text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2">
                            <ArrowUpRight size={16} className="text-rose"/> Manual Issue
                        </button>
                    </div>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                        <tr>
                            <th className="px-6 py-4">Item</th>
                            <th className="px-6 py-4 text-center">Min. Stock</th>
                            <th className="px-6 py-4 text-center">Current Stock</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4">Unit</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginatedItems.map(item => {
                             let statusColor = 'bg-sage/10 text-sage border-sage/30';
                             let statusText = 'Safe';
                             
                             if (item.currentStock === 0) {
                                 statusColor = 'bg-rose/10 text-rose border-rose/30';
                                 statusText = 'Out of Stock';
                             } else if (item.currentStock <= item.minStock) {
                                 statusColor = 'bg-amber/10 text-amber border-amber/30';
                                 statusText = 'Low Stock';
                             }

                             return (
                                <tr key={item.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-text-dark">{item.name}</div>
                                        <div className="text-xs text-text-muted">{item.category}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-text-muted">{item.minStock}</td>
                                    <td className="px-6 py-4 text-center font-bold text-text-dark">{item.currentStock}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                                            {statusText}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text-muted">{item.unit}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setSelectedItemForDetail(item)}
                                            className="text-xs font-medium text-soft-gold hover:text-[#cbad85] border border-soft-gold/30 hover:bg-soft-gold/5 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            View Detail
                                        </button>
                                    </td>
                                </tr>
                             );
                        })}
                        {paginatedItems.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-text-muted">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Layers size={32} className="opacity-20"/>
                                        <p>No stock information found matching your search.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="text-xs text-text-muted">
                        Showing {filteredItems.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} entries
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
        );
    };

    // 3. Purchasing View (Received)
    const PurchasingView = () => (
         <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-soft border border-soft-gold/10">
                    <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">Draft PO Value</h3>
                    <div className="text-2xl font-bold text-text-dark mt-1">Rp 12,500,000</div>
                    <div className="text-xs text-amber mt-1 flex items-center gap-1"><AlertTriangle size={12}/> 1 Order Pending Approval</div>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-soft border border-sage/10">
                    <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">Received This Month</h3>
                    <div className="text-2xl font-bold text-text-dark mt-1">Rp 45,200,000</div>
                    <div className="text-xs text-sage mt-1 flex items-center gap-1"><CheckCircle2 size={12}/> 8 Orders Completed</div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                 <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-text-dark">Purchase Orders</h3>
                    <button 
                        onClick={() => setIsPOCreationOpen(true)}
                        className="px-4 py-2 bg-text-dark text-white text-sm font-medium rounded-lg hover:bg-black flex items-center gap-2 transition-colors"
                    >
                        <Plus size={16}/> Create PO
                    </button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                        <tr>
                            <th className="px-6 py-4">PO Number</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Supplier</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4 text-right">Total Amount</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {purchaseOrders.map(po => (
                            <tr key={po.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-medium text-text-dark">{po.id}</td>
                                <td className="px-6 py-4 text-text-muted">{po.date.toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-text-dark">{po.supplier}</td>
                                <td className="px-6 py-4 text-text-muted">{po.itemsCount} Items</td>
                                <td className="px-6 py-4 text-right font-medium">Rp {po.totalAmount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                        po.status === 'Received' ? 'bg-sage/10 text-sage border-sage/30' : 
                                        po.status === 'Ordered' ? 'bg-blue-100 text-blue-600 border-blue-200' :
                                        'bg-amber/10 text-amber border-amber/30'
                                    }`}>
                                        {po.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-soft-gold hover:text-[#cbad85] text-xs font-medium">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
    );

    // 4. Stock Opname (Updated with Bulk Upload)
    const StockOpnameView = () => {
        const [viewMode, setViewMode] = useState<'list' | 'detail' | 'bulk_upload' | 'mode_select'>('list');
        const [sessions, setSessions] = useState<StockOpnameSession[]>(MOCK_OPNAME_SESSIONS);
        const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

        // Bulk Upload States
        const [hasDownloadedTemplate, setHasDownloadedTemplate] = useState(false);
        const [bulkData, setBulkData] = useState<any[]>([]);
        const [bulkErrors, setBulkErrors] = useState<string[]>([]);

        // Active Session Data (Derived from ID)
        const selectedSession = sessions.find(s => s.id === selectedSessionId);

        // --- Manual Flow ---
        const handleCreateManualSession = () => {
            if (sessions.some(s => s.status === 'In Progress')) {
                alert("Cannot create new Stock Opname. Please complete the pending session first.");
                return;
            }
            const newSession: StockOpnameSession = {
                id: `SO-${new Date().toISOString().split('T')[0]}-${Math.floor(Math.random() * 100)}`,
                date: new Date(),
                status: 'In Progress',
                performedBy: 'Dr. A. Wijaya', 
                notes: 'Manual Count',
                items: inventoryItems.map(inv => ({
                    itemId: inv.id,
                    itemName: inv.name,
                    systemStock: inv.currentStock,
                    physicalStock: inv.currentStock, 
                    unit: inv.unit,
                    reason: ''
                }))
            };
            setSessions([newSession, ...sessions]);
            setSelectedSessionId(newSession.id);
            setViewMode('detail');
        };

        // --- Bulk Flow ---
        
        const generateTemplate = () => {
            // Simulate CSV generation
            const headers = "ItemID,ItemName,CurrentSystemStock,PhysicalStock,Unit\n";
            const rows = inventoryItems.map(i => `${i.id},${i.name},${i.currentStock},0,${i.unit}`).join("\n");
            const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
            
            // Trigger download
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Opname_Template_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setHasDownloadedTemplate(true);
        };

        const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Simulate parsing CSV (Mocking logic for demo)
            // In real app: use FileReader and parse text/csv
            const reader = new FileReader();
            reader.onload = (evt) => {
                const text = evt.target?.result as string;
                if (!text) return;

                const lines = text.split("\n");
                const parsedItems: any[] = [];
                const errors: string[] = [];

                // Skip header, process rows
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    const cols = line.split(",");
                    // Mock CSV structure: ItemID, ItemName, System, Physical, Unit
                    const itemId = cols[0];
                    const physicalStr = cols[3]; // Assuming 4th column is physical input

                    // Validation
                    const masterItem = inventoryItems.find(inv => inv.id === itemId);
                    
                    if (!masterItem) {
                        errors.push(`Row ${i+1}: Item ID ${itemId} not found in system.`);
                        continue;
                    }

                    const physicalQty = parseFloat(physicalStr);
                    if (isNaN(physicalQty)) {
                        errors.push(`Row ${i+1}: Invalid physical stock number for ${masterItem.name}.`);
                        continue;
                    }

                    parsedItems.push({
                        itemId: masterItem.id,
                        itemName: masterItem.name,
                        systemStock: masterItem.currentStock,
                        physicalStock: physicalQty,
                        unit: masterItem.unit,
                        reason: 'Bulk Upload'
                    });
                }

                setBulkData(parsedItems);
                setBulkErrors(errors);
            };
            reader.readAsText(file);
        };

        const saveBulkOpname = () => {
            if (bulkErrors.length > 0) {
                alert("Please fix errors in the file before saving.");
                return;
            }
            if (bulkData.length === 0) {
                alert("No data found.");
                return;
            }

            const newSession: StockOpnameSession = {
                id: `SO-BULK-${new Date().toISOString().split('T')[0]}-${Math.floor(Math.random() * 100)}`,
                date: new Date(),
                status: 'Completed', // Bulk upload usually implies finished count
                performedBy: 'Dr. A. Wijaya', 
                notes: 'Bulk Upload Import',
                items: bulkData
            };

            setSessions([newSession, ...sessions]);
            setViewMode('list');
            setHasDownloadedTemplate(false);
            setBulkData([]);
            setBulkErrors([]);
        };

        // --- Common Handlers ---
        
        const handlePhysicalChange = (itemId: string, val: number) => {
            if (!selectedSessionId) return;
            setSessions(prev => prev.map(s => s.id === selectedSessionId ? { ...s, items: s.items.map(i => i.itemId === itemId ? { ...i, physicalStock: val } : i) } : s));
        };

        const handleReasonChange = (itemId: string, val: string) => {
             if (!selectedSessionId) return;
             setSessions(prev => prev.map(s => s.id === selectedSessionId ? { ...s, items: s.items.map(i => i.itemId === itemId ? { ...i, reason: val } : i) } : s));
        }

        const handleFinalizeManual = () => {
            if (!selectedSession) return;
            if (window.confirm("Finalize this Stock Opname? Inventory levels will be adjusted.")) {
                setSessions(prev => prev.map(s => s.id === selectedSessionId ? { ...s, status: 'Completed' as const } : s));
                alert("Stock Opname Finalized.");
                setViewMode('list');
            }
        }

        // --- Views ---

        if (viewMode === 'mode_select') {
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 text-center relative">
                        <button onClick={() => setViewMode('list')} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><XCircle size={20} className="text-gray-400"/></button>
                        <h2 className="text-xl font-bold text-text-dark mb-2">New Opname Session</h2>
                        <p className="text-text-muted mb-8">Choose how you want to input stock data.</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={handleCreateManualSession}
                                className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-soft-gold hover:bg-soft-gold/5 transition-all group"
                            >
                                <div className="w-12 h-12 bg-ivory rounded-full flex items-center justify-center mb-3 group-hover:bg-white group-hover:shadow-md">
                                    <ClipboardCheck size={24} className="text-soft-gold"/>
                                </div>
                                <h3 className="font-bold text-text-dark">Manual Count</h3>
                                <p className="text-xs text-text-muted mt-1">Input data directly in app</p>
                            </button>

                            <button 
                                onClick={() => setViewMode('bulk_upload')}
                                className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-soft-gold hover:bg-soft-gold/5 transition-all group"
                            >
                                <div className="w-12 h-12 bg-ivory rounded-full flex items-center justify-center mb-3 group-hover:bg-white group-hover:shadow-md">
                                    <FileSpreadsheet size={24} className="text-soft-gold"/>
                                </div>
                                <h3 className="font-bold text-text-dark">Bulk Upload</h3>
                                <p className="text-xs text-text-muted mt-1">Import via Excel/CSV</p>
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (viewMode === 'bulk_upload') {
            return (
                <div className="bg-white rounded-xl shadow-soft overflow-hidden animate-fade-in flex flex-col h-full min-h-[500px]">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setViewMode('list')} className="p-2 -ml-2 hover:bg-white rounded-full text-text-muted hover:text-text-dark transition-colors">
                                <ArrowLeft size={20}/>
                            </button>
                            <div>
                                <h3 className="font-bold text-text-dark">Bulk Upload Opname</h3>
                                <p className="text-xs text-text-muted">Import stock data from spreadsheet.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full">
                        {/* Step 1: Download Template */}
                        <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">1</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-text-dark">Download Template</h4>
                                <p className="text-sm text-text-muted mb-3">You must download the latest stock snapshot to ensure IDs match.</p>
                                <button 
                                    onClick={generateTemplate}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center gap-2 transition-colors"
                                >
                                    <Download size={16}/> Download Latest Stock (.CSV)
                                </button>
                            </div>
                        </div>

                        {/* Step 2: Upload File */}
                        <div className={`flex items-start gap-4 p-4 border rounded-xl transition-all ${hasDownloadedTemplate ? 'border-gray-200 bg-gray-50' : 'border-gray-100 bg-gray-50/50 opacity-50'}`}>
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold shrink-0">2</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-text-dark">Upload Filled Data</h4>
                                <p className="text-sm text-text-muted mb-3">Upload the file after filling in the "PhysicalStock" column.</p>
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        accept=".csv,.xls,.xlsx"
                                        disabled={!hasDownloadedTemplate}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label 
                                        htmlFor="file-upload"
                                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                                            hasDownloadedTemplate ? 'border-gray-300 hover:border-soft-gold hover:bg-white' : 'border-gray-200 cursor-not-allowed'
                                        }`}
                                    >
                                        <UploadCloud size={32} className="text-gray-400 mb-2"/>
                                        <span className="text-sm text-text-muted">Click to upload or drag file here</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Validation & Save */}
                        {bulkData.length > 0 && (
                            <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm animate-fade-in">
                                <div className="w-10 h-10 rounded-full bg-soft-gold text-white flex items-center justify-center font-bold shrink-0">3</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-text-dark mb-2">Validation Result</h4>
                                    
                                    {bulkErrors.length > 0 ? (
                                        <div className="bg-rose/10 border border-rose/20 rounded-lg p-4 mb-4">
                                            <div className="flex items-center gap-2 text-rose font-bold text-sm mb-2">
                                                <AlertCircle size={16}/> Data Mismatch Found ({bulkErrors.length})
                                            </div>
                                            <ul className="list-disc list-inside text-xs text-rose/80 space-y-1 max-h-32 overflow-y-auto">
                                                {bulkErrors.map((err, i) => <li key={i}>{err}</li>)}
                                            </ul>
                                            <p className="text-xs font-medium text-rose mt-2">Please fix the file and re-upload.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-sage/10 border border-sage/20 rounded-lg p-4 flex items-center gap-2 text-sage text-sm font-bold">
                                                <CheckCircle2 size={16}/> All {bulkData.length} items are valid and ready to import.
                                            </div>
                                            
                                            {/* Preview Table Mini */}
                                            <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-lg">
                                                <table className="w-full text-xs text-left">
                                                    <thead className="bg-gray-50 text-text-muted sticky top-0">
                                                        <tr>
                                                            <th className="p-2">Item</th>
                                                            <th className="p-2 text-center">System</th>
                                                            <th className="p-2 text-center">Physical</th>
                                                            <th className="p-2 text-center">Diff</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {bulkData.slice(0, 10).map((row, i) => (
                                                            <tr key={i}>
                                                                <td className="p-2">{row.itemName}</td>
                                                                <td className="p-2 text-center">{row.systemStock}</td>
                                                                <td className="p-2 text-center">{row.physicalStock}</td>
                                                                <td className={`p-2 text-center font-bold ${row.physicalStock - row.systemStock !== 0 ? 'text-amber' : 'text-gray-400'}`}>
                                                                    {row.physicalStock - row.systemStock}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {bulkData.length > 10 && <tr><td colSpan={4} className="p-2 text-center text-text-muted">...and {bulkData.length - 10} more</td></tr>}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="flex justify-end">
                                                <button 
                                                    onClick={saveBulkOpname}
                                                    className="px-6 py-2 bg-soft-gold text-white text-sm font-bold rounded-lg shadow-md hover:bg-[#cbad85] transition-colors flex items-center gap-2"
                                                >
                                                    <Save size={16}/> Save & Finalize Opname
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (viewMode === 'detail' && selectedSession) {
            return (
                <div className="bg-white rounded-xl shadow-soft overflow-hidden animate-fade-in flex flex-col h-[calc(100vh-250px)]">
                     {/* Detail Header */}
                     <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setViewMode('list')}
                                className="p-2 -ml-2 hover:bg-white rounded-full text-text-muted hover:text-text-dark transition-colors"
                            >
                                <ArrowLeft size={20}/>
                            </button>
                            <div>
                                <h3 className="font-bold text-text-dark flex items-center gap-2">
                                    {selectedSession.id}
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                        selectedSession.status === 'Completed' ? 'bg-sage/10 text-sage border-sage/30' : 'bg-amber/10 text-amber border-amber/30'
                                    }`}>
                                        {selectedSession.status.toUpperCase()}
                                    </span>
                                </h3>
                                <div className="flex gap-4 mt-1 text-xs text-text-muted">
                                    <span className="flex items-center gap-1"><Calendar size={12}/> {selectedSession.date.toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><User size={12}/> {selectedSession.performedBy}</span>
                                </div>
                            </div>
                        </div>
                        
                        {selectedSession.status === 'In Progress' && (
                             <button 
                                onClick={handleFinalizeManual}
                                className="px-4 py-2 bg-text-dark text-white text-sm font-medium rounded-lg hover:bg-black flex items-center gap-2 transition-colors"
                            >
                                <CheckCircle2 size={16}/> Finalize & Adjust
                            </button>
                        )}
                    </div>

                    {/* Counting Table */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 border-b border-gray-100 bg-ivory">Item Name</th>
                                    <th className="px-6 py-3 border-b border-gray-100 bg-ivory text-center">System Stock</th>
                                    <th className="px-6 py-3 border-b border-gray-100 bg-ivory text-center w-32">Physical Stock</th>
                                    <th className="px-6 py-3 border-b border-gray-100 bg-ivory text-center">Diff</th>
                                    <th className="px-6 py-3 border-b border-gray-100 bg-ivory">Note / Reason</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {selectedSession.items.map(item => {
                                    const diff = item.physicalStock - item.systemStock;
                                    const isEditable = selectedSession.status === 'In Progress';

                                    return (
                                        <tr key={item.itemId} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-3 font-medium text-text-dark">{item.itemName}</td>
                                            <td className="px-6 py-3 text-center text-text-muted">{item.systemStock}</td>
                                            <td className="px-6 py-3 text-center">
                                                {isEditable ? (
                                                    <input 
                                                        type="number"
                                                        min="0"
                                                        className="w-24 px-3 py-1.5 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-lg text-center text-sm font-medium focus:bg-white focus:outline-none focus:border-soft-gold focus:shadow-sm transition-all"
                                                        value={item.physicalStock}
                                                        onChange={(e) => handlePhysicalChange(item.itemId, parseInt(e.target.value) || 0)}
                                                    />
                                                ) : (
                                                    <span className="font-medium">{item.physicalStock}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3 text-center font-bold">
                                                <span className={diff < 0 ? 'text-rose' : diff > 0 ? 'text-sage' : 'text-gray-300'}>
                                                    {diff > 0 ? `+${diff}` : diff}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                 {isEditable ? (
                                                    <input 
                                                        type="text"
                                                        placeholder={diff !== 0 ? "Reason required..." : "Optional note"}
                                                        className={`w-full text-xs px-2 py-1.5 rounded border ${diff !== 0 && !item.reason ? 'border-rose/50 bg-rose/5' : 'border-transparent bg-transparent hover:bg-white hover:border-gray-200'} focus:outline-none focus:border-soft-gold focus:bg-white transition-all`}
                                                        value={item.reason || ''}
                                                        onChange={(e) => handleReasonChange(item.itemId, e.target.value)}
                                                    />
                                                 ) : (
                                                     <span className="text-xs text-text-muted">{item.reason || '-'}</span>
                                                 )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        // List View
        return (
            <div className="bg-white rounded-xl shadow-soft overflow-hidden animate-fade-in">
                 <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="font-bold text-text-dark">Stock Opname History</h3>
                        <p className="text-xs text-text-muted">Manage stock adjustment sessions.</p>
                    </div>
                    <button 
                        onClick={() => setViewMode('mode_select')}
                        className={`px-4 py-2 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                            sessions.some(s => s.status === 'In Progress') 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-soft-gold hover:bg-[#cbad85]'
                        }`}
                        disabled={sessions.some(s => s.status === 'In Progress')}
                    >
                        <Plus size={16}/> New Opname Session
                    </button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                        <tr>
                            <th className="px-6 py-4">Session ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Performed By</th>
                            <th className="px-6 py-4 text-center">Items Checked</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {sessions.map(session => (
                            <tr 
                                key={session.id} 
                                className="hover:bg-gray-50/50 cursor-pointer group"
                                onClick={() => { setSelectedSessionId(session.id); setViewMode('detail'); }}
                            >
                                <td className="px-6 py-4 font-medium text-text-dark">{session.id}</td>
                                <td className="px-6 py-4 text-text-muted">{session.date.toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                        session.status === 'Completed' ? 'bg-sage/10 text-sage border-sage/30' : 'bg-amber/10 text-amber border-amber/30'
                                    }`}>
                                        {session.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-text-dark">{session.performedBy}</td>
                                <td className="px-6 py-4 text-center text-text-muted">{session.items.length || '-'}</td>
                                <td className="px-6 py-4 text-right">
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-soft-gold"/>
                                </td>
                            </tr>
                        ))}
                         {sessions.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-text-muted">
                                    No stock opname sessions found. Start a new one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    // 5. Logs View (History)
    const LogsView = () => (
        <div className="bg-white rounded-xl shadow-soft overflow-hidden animate-fade-in">
             <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-text-dark">Inventory Activity Log</h3>
                <button className="text-xs text-soft-gold hover:underline">Export CSV</button>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                    <tr>
                        <th className="px-6 py-4">Date & Time</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Item</th>
                        <th className="px-6 py-4 text-right">Qty</th>
                        <th className="px-6 py-4">Reason / Reference</th>
                        <th className="px-6 py-4">User</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {MOCK_STOCK_LOGS.map(log => (
                        <tr key={log.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 text-text-muted">
                                {log.date.toLocaleDateString()} <span className="text-[10px] ml-1">{log.date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                    log.type === 'IN' ? 'bg-sage/10 text-sage' :
                                    log.type === 'OUT' ? 'bg-rose/10 text-rose' :
                                    'bg-amber/10 text-amber'
                                }`}>
                                    {log.type}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-text-dark">{log.itemName}</td>
                            <td className="px-6 py-4 text-right font-medium">{Math.abs(log.qty)}</td>
                            <td className="px-6 py-4 text-text-muted text-xs">{log.reason}</td>
                            <td className="px-6 py-4 text-text-muted text-xs">{log.actor}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // --- Main Render Switch ---
    const renderContent = () => {
        switch (view) {
            case 'catalog': return <CatalogView />;
            case 'stock': return <StockLevelsView />;
            case 'purchasing': return <PurchasingView />;
            case 'opname': return <StockOpnameView />;
            case 'logs': return <LogsView />;
            default: return <CatalogView />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <InventoryModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSave={handleSaveNewProduct} 
             />
             <CreatePOModal 
                isOpen={isPOCreationOpen}
                onClose={() => setIsPOCreationOpen(false)}
                onSave={handleSavePO}
                catalogItems={inventoryItems}
             />

             {/* Header */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-medium text-text-dark">
                        {view === 'catalog' && 'Inventory Catalog'}
                        {view === 'stock' && 'Stock Info Levels'}
                        {view === 'purchasing' && 'Purchasing Orders'}
                        {view === 'opname' && 'Stock Opname Session'}
                        {view === 'logs' && 'Inventory Logs'}
                    </h1>
                    <p className="text-text-muted mt-1">
                        {view === 'catalog' && 'Manage product master data and SKU list.'}
                        {view === 'stock' && 'Monitor current stock quantity and alerts.'}
                        {view === 'purchasing' && 'Create and track purchase orders to suppliers.'}
                        {view === 'opname' && 'Perform manual or bulk stock auditing.'}
                        {view === 'logs' && 'View audit trail of all inventory movements.'}
                    </p>
                </div>
                
                {/* Search Bar - Global for the page context */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                    <input 
                        type="text" 
                        placeholder="Search SKU or Product Name..." 
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default Inventory;