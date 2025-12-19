
import React, { useState, useEffect } from 'react';
import { X, FileSpreadsheet, FileText, Search, CheckCircle2, Check, XCircle, Clock, User } from 'lucide-react';

interface BlastReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  blastData: {
      id: string;
      name: string;
      date: Date;
      stats: { sent: number; read: number; failed: number };
  } | null;
}

// Mock Recipient Data Structure
interface RecipientLog {
    id: string;
    name: string;
    phone: string;
    status: 'Read' | 'Sent' | 'Failed';
    time: string;
}

const BlastReportModal: React.FC<BlastReportModalProps> = ({ isOpen, onClose, blastData }) => {
  const [logs, setLogs] = useState<RecipientLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Generate mock recipient logs based on selected blast stats
  useEffect(() => {
    if (isOpen && blastData) {
        const total = blastData.stats.sent + blastData.stats.failed;
        const mockLogs: RecipientLog[] = Array.from({ length: Math.min(total, 20) }).map((_, i) => { // Limit to 20 for demo
            const statuses: ('Read' | 'Sent' | 'Failed')[] = ['Read', 'Read', 'Read', 'Sent', 'Failed'];
            const status = statuses[i % statuses.length];
            
            return {
                id: `MSG-${Math.floor(Math.random() * 10000)}`,
                name: ['Emma Wilson', 'Olivia Brown', 'Sophia Miller', 'Isabella Davis', 'John Doe'][i % 5] + ` (${i+1})`,
                phone: `0812${Math.floor(Math.random() * 100000000)}`,
                status: status,
                time: new Date(blastData.date.getTime() + i * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
        });
        setLogs(mockLogs);
    }
  }, [isOpen, blastData]);

  const handleExport = (type: 'Excel' | 'PDF') => {
      alert(`Exporting Campaign Report for "${blastData?.name}" as ${type}...\n(Download will start automatically)`);
  };

  if (!isOpen || !blastData) return null;

  const filteredLogs = logs.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm)
  );

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
                Detailed Campaign Report
            </h2>
            <p className="text-sm text-text-muted mt-1">
                Campaign: <span className="font-bold text-text-dark">{blastData.name}</span> • {blastData.date.toLocaleDateString()}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b border-gray-100">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                </div>
                <div>
                    <div className="text-xs text-text-muted uppercase font-bold">Read Rate</div>
                    <div className="text-xl font-bold text-text-dark">
                        {Math.round((blastData.stats.read / (blastData.stats.sent || 1)) * 100)}%
                    </div>
                    <div className="text-xs text-text-muted">{blastData.stats.read} opened</div>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-sage/20 text-sage flex items-center justify-center">
                    <Check size={20} />
                </div>
                <div>
                    <div className="text-xs text-text-muted uppercase font-bold">Successfully Sent</div>
                    <div className="text-xl font-bold text-text-dark">{blastData.stats.sent}</div>
                    <div className="text-xs text-text-muted">Delivered to device</div>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose/10 text-rose flex items-center justify-center">
                    <XCircle size={20} />
                </div>
                <div>
                    <div className="text-xs text-text-muted uppercase font-bold">Failed</div>
                    <div className="text-xl font-bold text-text-dark">{blastData.stats.failed}</div>
                    <div className="text-xs text-text-muted">Invalid numbers</div>
                </div>
            </div>
        </div>

        {/* Filters & Actions */}
        <div className="px-6 py-4 bg-white flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                <input 
                    type="text" 
                    placeholder="Search recipient name or phone..." 
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
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase sticky top-0">
                        <tr>
                            <th className="px-6 py-3">Recipient Name</th>
                            <th className="px-6 py-3">Phone Number</th>
                            <th className="px-6 py-3 text-center">Status</th>
                            <th className="px-6 py-3 text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-ivory/50 transition-colors">
                                <td className="px-6 py-3">
                                    <div className="font-bold text-text-dark">{log.name}</div>
                                </td>
                                <td className="px-6 py-3 text-text-muted font-mono text-xs">
                                    {log.phone}
                                </td>
                                <td className="px-6 py-3 text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                        log.status === 'Read' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                        log.status === 'Sent' ? 'bg-sage/10 text-sage border-sage/20' :
                                        'bg-rose/10 text-rose border-rose/20'
                                    }`}>
                                        {log.status === 'Read' && <CheckCircle2 size={12}/>}
                                        {log.status === 'Sent' && <Check size={12}/>}
                                        {log.status === 'Failed' && <XCircle size={12}/>}
                                        {log.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-right text-text-muted text-xs flex justify-end items-center gap-1">
                                    <Clock size={12}/> {log.time}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-text-muted italic">
                                    No recipients found matching filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

export default BlastReportModal;
