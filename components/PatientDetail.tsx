
import React, { useState } from 'react';
import { User, AlertCircle, Calendar, Camera, Pill, Clock, ArrowLeft, Plus, FileText, Wallet, ArrowUpCircle, ArrowDownCircle, History, Banknote } from 'lucide-react';
import { Patient, WalletLog } from '../types';
import { MOCK_MEDICAL_RECORDS, MOCK_WALLET_LOGS } from '../constants';
import TopUpModal from './modals/TopUpModal';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  initialTab?: 'EMR' | 'Wallet';
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack, initialTab = 'EMR' }) => {
  const [activeTab, setActiveTab] = useState<'EMR' | 'Wallet'>(initialTab);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  
  // Local state for wallet to reflect instant updates
  const [walletBalance, setWalletBalance] = useState(patient.walletBalance || 0);
  const [walletLogs, setWalletLogs] = useState<WalletLog[]>(
      MOCK_WALLET_LOGS.filter(l => l.patientId === patient.id).sort((a,b) => b.date.getTime() - a.date.getTime())
  );

  const records = MOCK_MEDICAL_RECORDS.filter(r => r.patientId === patient.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate age safely
  const age = patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : 'N/A';

  const handleTopUpSuccess = (newTransaction: WalletLog) => {
      setWalletBalance(newTransaction.balanceAfter);
      setWalletLogs([newTransaction, ...walletLogs]);
      alert("Top Up Successful!");
  };

  const WalletView = () => (
      <div className="p-8 space-y-8 animate-fade-in bg-gray-50/50 min-h-full">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Balance Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Wallet size={120} />
                </div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">Deposit Balance</h3>
                <div className="text-4xl font-serif font-bold text-soft-gold mb-6">
                    Rp {walletBalance.toLocaleString()}
                </div>
                <div className="flex gap-3 relative z-10">
                    <button 
                        onClick={() => setIsTopUpOpen(true)}
                        className="flex-1 py-2.5 bg-text-dark text-white rounded-xl font-medium shadow-md hover:bg-black transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowUpCircle size={18} /> Top Up
                    </button>
                    {/* Placeholder for future features like Transfer or Withdraw */}
                    <button className="flex-1 py-2.5 bg-white border border-gray-200 text-text-dark rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 opacity-60 cursor-not-allowed">
                         <History size={18} /> Statement
                    </button>
                </div>
                 {patient.walletExpiryDate && (
                    <div className="mt-4 text-xs text-rose flex items-center gap-1 bg-rose/5 p-2 rounded-lg w-fit">
                        <Clock size={12}/> Balance expires on {patient.walletExpiryDate.toLocaleDateString()}
                    </div>
                )}
            </div>

            {/* Quick Stats / Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center gap-4">
                 <div className="flex items-center gap-4 p-4 rounded-xl bg-ivory border border-soft-gold/20">
                    <div className="w-10 h-10 rounded-full bg-soft-gold/20 flex items-center justify-center text-soft-gold">
                        <Banknote size={20}/>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-text-dark">Total Deposit (Lifetime)</div>
                        <div className="text-xs text-text-muted">Rp 12,500,000</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 p-4 rounded-xl bg-ivory border border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <History size={20}/>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-text-dark">Last Transaction</div>
                        <div className="text-xs text-text-muted">
                            {walletLogs.length > 0 ? walletLogs[0].date.toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                 </div>
            </div>
         </div>

         {/* Transaction History */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-ivory/50">
                <h3 className="font-bold text-text-dark">Transaction History</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-xs text-text-muted uppercase border-b border-gray-100 bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Reference / Notes</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                            <th className="px-6 py-3 text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {walletLogs.length > 0 ? walletLogs.map(log => (
                            <tr key={log.id} className="hover:bg-ivory/50">
                                <td className="px-6 py-3 text-text-muted">
                                    {log.date.toLocaleDateString()} <span className="text-[10px] opacity-70">{log.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex w-fit items-center gap-1 ${
                                        log.type === 'Top Up' || log.type === 'Correction' ? 'bg-sage/10 text-sage' : 
                                        'bg-rose/10 text-rose'
                                    }`}>
                                        {log.type === 'Top Up' ? <ArrowUpCircle size={10}/> : <ArrowDownCircle size={10}/>}
                                        {log.type}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <div className="text-text-dark">{log.notes || '-'}</div>
                                    {log.paymentMethod && (
                                        <div className="text-[10px] text-text-muted">via {log.paymentMethod} • by {log.performedBy}</div>
                                    )}
                                </td>
                                <td className={`px-6 py-3 text-right font-medium ${log.amount > 0 ? 'text-sage' : 'text-text-dark'}`}>
                                    {log.amount > 0 ? '+' : ''}{log.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-3 text-right font-bold text-text-dark">
                                    {log.balanceAfter.toLocaleString()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-text-muted italic">
                                    No wallet activity recorded.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
         </div>
      </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-soft h-[calc(100vh-140px)] flex flex-col overflow-hidden animate-fade-in">
      
      <TopUpModal 
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        patientId={patient.id}
        patientName={patient.name}
        currentBalance={walletBalance}
        onSuccess={handleTopUpSuccess}
      />

      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-ivory flex justify-between items-start">
        <div className="flex gap-5 items-center">
            <button 
                onClick={onBack}
                className="p-2 -ml-2 hover:bg-white rounded-full text-text-muted hover:text-text-dark transition-colors"
            >
                <ArrowLeft size={20}/>
            </button>
          <img
            src={patient.avatarUrl}
            alt={patient.name}
            className="w-20 h-20 rounded-2xl object-cover shadow-sm border-2 border-white"
          />
          <div>
            <h2 className="text-2xl font-serif font-bold text-text-dark">{patient.name}</h2>
            <div className="flex gap-4 mt-2 text-sm text-text-muted">
              <span className="flex items-center gap-1">
                <User size={14} /> {patient.gender}, {age} yo
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-soft-gold/10 text-text-dark font-medium text-xs">
                {patient.tier} Member
              </span>
              <span className="text-xs text-text-muted">ID: {patient.id}</span>
            </div>
          </div>
        </div>
        
        {/* Toggle Tabs */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
             <button 
                onClick={() => setActiveTab('EMR')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'EMR' ? 'bg-text-dark text-white shadow-sm' : 'text-text-muted hover:text-text-dark'
                }`}
             >
                <FileText size={16}/> Medical Record
             </button>
             <button 
                onClick={() => setActiveTab('Wallet')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'Wallet' ? 'bg-soft-gold text-white shadow-sm' : 'text-text-muted hover:text-text-dark'
                }`}
             >
                <Wallet size={16}/> Wallet & Finance
             </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'Wallet' ? <WalletView /> : (
             <div className="p-8 space-y-8 bg-gray-50/50 min-h-full">
                 {/* Existing Timeline Code */}
                 {records.length > 0 ? (
                  <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pl-8 pb-8">
                    {records.map((record) => (
                      <div key={record.id} className="relative group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-white bg-soft-gold shadow-sm"></div>

                        {/* Record Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          {/* Record Header */}
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                            <div>
                              <h3 className="text-lg font-bold text-text-dark">
                                {record.treatmentType}
                              </h3>
                              <p className="text-sm text-text-muted flex items-center gap-2 mt-1">
                                <span className="font-medium text-soft-gold">
                                  {record.doctorName}
                                </span>
                                <span>•</span>
                                <span>{record.id}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-text-muted bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                              <Calendar size={14} />
                              {new Date(record.date).toLocaleDateString('en-US', {day: 'numeric', month: 'long', year: 'numeric'})}
                            </div>
                          </div>

                          {/* Diagnosis & Notes */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                                Diagnosis
                              </label>
                              <p className="text-sm text-text-dark bg-ivory p-3 rounded-xl border border-gray-100">
                                {record.diagnosis}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                                Clinical Notes
                              </label>
                              <p className="text-sm text-text-dark/80 leading-relaxed p-1">
                                {record.clinicalNotes}
                              </p>
                            </div>
                          </div>

                          {/* Photos (Before/After) */}
                          {record.photos && record.photos.length > 0 && (
                            <div className="mb-6">
                              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-2 mb-3">
                                <Camera size={14} /> Visual Progress
                              </label>
                              <div className="flex gap-4 overflow-x-auto pb-2">
                                {record.photos.map((photo, idx) => (
                                  <div key={idx} className="flex gap-2">
                                    <div className="relative group/img">
                                      <img
                                        src={photo.before}
                                        alt="Before"
                                        className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                                      />
                                      <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                                        Before
                                      </span>
                                    </div>
                                    <div className="relative group/img">
                                      <img
                                        src={photo.after}
                                        alt="After"
                                        className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                                      />
                                      <span className="absolute bottom-2 left-2 bg-soft-gold/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                                        After
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Prescriptions */}
                          {record.prescriptions && record.prescriptions.length > 0 && (
                            <div className="pt-4 border-t border-gray-50">
                              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-2 mb-2">
                                <Pill size={14} /> Prescriptions / Products
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {record.prescriptions.map((item, i) => (
                                  <span
                                    key={i}
                                    className="text-xs font-medium text-text-dark bg-lavender/30 border border-lavender/50 px-2.5 py-1 rounded-lg"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-text-muted">
                    <Clock size={48} className="mb-4 opacity-20" />
                    <p>No medical history found for this patient.</p>
                  </div>
                )}
             </div>
          )}
      </div>
    </div>
  );
};

export default PatientDetail;
