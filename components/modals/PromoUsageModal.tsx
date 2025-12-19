
import React, { useState, useEffect } from 'react';
import { X, Download, FileSpreadsheet, FileText, Search, Calendar, User, Receipt } from 'lucide-react';
import { Promotion } from '../../types';

interface PromoUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  promo: Promotion | null;
}

// Mock Transaction Data Structure for Demo
interface PromoTransaction {
    id: string;
    date: Date;
    invoiceId: string;
    patientName: string;
    patientId: string;
    treatmentName: string;
    originalPrice: number;
    discountAmount: number;
}

const PromoUsageModal: React.FC<PromoUsageModalProps> = ({ isOpen, onClose, promo }) => {
  const [transactions, setTransactions] = useState<PromoTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Generate mock usage data based on the selected promo
  useEffect(() => {
    if (isOpen && promo) {
        // Simulating data fetch
        const mockData: PromoTransaction[] = Array.from({ length: promo.usageCount || 5 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days
            
            return {
                id: `TX-${Math.floor(Math.random() * 10000)}`,
                date: date,
                invoiceId: `INV-2023-${100 + i}`,
                patientName: ['Emma Wilson', 'Sophia Miller', 'Olivia Brown', 'John Doe', 'Linda K'][i % 5],
                patientId: `P-00${(i % 5) + 1}`,
                treatmentName: ['Laser Rejuvenation', 'Korean Glow Facial', 'Botox Injection', 'Slimming Drip'][i % 4],
                originalPrice: 1500000,
                discountAmount: promo.valueType === 'Percent' ? (1500000 * promo.value / 100) : promo.value
            };
        }).sort((a, b) => b.date.getTime() - a.date.getTime());

        setTransactions(mockData);
    }
  }, [isOpen, promo]);

  const handleExport = (type: 'Excel' | 'PDF') => {
      alert(`Exporting Usage Report for ${promo?.name} as ${type}...\n(Download will start automatically)`);
  };

  if (!isOpen || !promo) return null;

  const filteredTransactions = transactions.filter(t => 
      t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDiscountGiven = filteredTransactions.reduce((sum, t) => sum + t.discountAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-ivory flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
                <FileText size={20} className="text-soft-gold"/> Usage Report
            </h2>
            <p className="text-sm text-text-muted mt-1">
                Details for: <span className="font-bold text-text-dark">{promo.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Filters & Actions */}
        <div className="p-6 border-b border-gray-100 bg-white flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                <input 
                    type="text" 
                    placeholder="Search patient or invoice..." 
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={() => handleExport('Excel')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                >
                    <FileSpreadsheet size={16}/> Export Excel
                </button>
                <button 
                    onClick={() => handleExport('PDF')}
                    className="flex items-center gap-2 px-4 py-2 bg-rose/5 border border-rose/20 text-rose rounded-lg text-sm font-medium hover:bg-rose/10 transition-colors"
                >
                    <FileText size={16}/> Export PDF
                </button>
            </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50/30">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs font-semibold text-text-muted uppercase">
                        <tr>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Treatment / Item</th>
                            <th className="px-6 py-4 text-center">Invoice Ref</th>
                            <th className="px-6 py-4 text-right">Discount Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
                            <tr key={t.id} className="hover:bg-ivory/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-text-dark">
                                        <Calendar size={14} className="text-text-muted"/>
                                        {t.date.toLocaleDateString('en-GB')}
                                    </div>
                                    <div className="text-[10px] text-text-muted pl-6 mt-0.5">
                                        {t.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-text-dark">{t.patientName}</div>
                                    <div className="text-[10px] text-text-muted flex items-center gap-1">
                                        <User size={10}/> {t.patientId}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-text-dark">
                                    {t.treatmentName}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-gray-100 text-text-muted px-2 py-1 rounded text-xs font-mono border border-gray-200">
                                        {t.invoiceId}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-rose">
                                    - Rp {t.discountAmount.toLocaleString()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-text-muted italic">
                                    No transactions found for this promotion.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {/* Footer Summary */}
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                        <tr>
                            <td colSpan={4} className="px-6 py-4 text-right font-bold text-text-dark">Total Discount Given</td>
                            <td className="px-6 py-4 text-right font-bold text-rose text-lg">
                                Rp {totalDiscountGiven.toLocaleString()}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

export default PromoUsageModal;
