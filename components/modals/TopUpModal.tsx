import React, { useState } from 'react';
import { X, Wallet, ArrowUpCircle, Banknote, CreditCard, QrCode } from 'lucide-react';
import { PaymentMethodType, WalletLog } from '../../types';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  currentBalance: number;
  onSuccess: (transaction: WalletLog) => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, patientName, patientId, currentBalance, onSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<PaymentMethodType>(PaymentMethodType.TRANSFER);
  const [notes, setNotes] = useState('');

  const PRESET_AMOUNTS = [500000, 1000000, 2000000, 5000000];

  const handleTopUp = () => {
    const val = parseFloat(amount.replace(/,/g, ''));
    if (!val || val <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (window.confirm(`Confirm Top Up of Rp ${val.toLocaleString()} for ${patientName}?`)) {
      const newTransaction: WalletLog = {
        id: `WLT-${Date.now()}`,
        date: new Date(),
        patientId,
        patientName,
        type: 'Top Up',
        amount: val,
        balanceAfter: currentBalance + val,
        paymentMethod: method,
        performedBy: 'Dr. A. Wijaya', // Mock user
        notes: notes || 'Manual Top Up',
      };
      
      onSuccess(newTransaction);
      onClose();
      // Reset
      setAmount('');
      setMethod(PaymentMethodType.TRANSFER);
      setNotes('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <div>
             <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
                <Wallet size={18} className="text-soft-gold"/> Top Up Wallet
             </h2>
             <p className="text-xs text-text-muted mt-0.5">Deposit funds for {patientName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
            <div className="bg-soft-gold/10 p-4 rounded-xl text-center border border-soft-gold/20">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wide">Current Balance</div>
                <div className="text-2xl font-bold text-soft-gold">Rp {currentBalance.toLocaleString()}</div>
            </div>

            <div>
                <label className="block text-xs font-bold text-text-muted mb-2">Select Amount</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    {PRESET_AMOUNTS.map(amt => (
                        <button 
                            key={amt}
                            onClick={() => setAmount(amt.toString())}
                            className="py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-soft-gold transition-all"
                        >
                            Rp {amt.toLocaleString()}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm">Rp</span>
                    <input 
                        type="number"
                        className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-text-dark focus:outline-none focus:border-soft-gold"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
            </div>

            <div>
                 <label className="block text-xs font-bold text-text-muted mb-2">Payment Method</label>
                 <select 
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-soft-gold"
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PaymentMethodType)}
                 >
                    <option value={PaymentMethodType.TRANSFER}>Bank Transfer</option>
                    <option value={PaymentMethodType.CASH}>Cash</option>
                    <option value={PaymentMethodType.QRIS}>QRIS</option>
                    <option value={PaymentMethodType.DEBIT}>Debit Card</option>
                    <option value={PaymentMethodType.CREDIT}>Credit Card</option>
                 </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-text-muted mb-2">Notes (Optional)</label>
                <input 
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                    placeholder="e.g. Promo Bundle October"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-text-muted hover:text-text-dark transition-colors">Cancel</button>
            <button 
                onClick={handleTopUp} 
                disabled={!amount || parseFloat(amount) <= 0}
                className="px-6 py-2 bg-text-dark text-white text-sm font-bold rounded-lg shadow-md hover:bg-black transition-colors flex items-center gap-2 disabled:bg-gray-300 disabled:shadow-none"
            >
                <ArrowUpCircle size={16}/> Confirm Top Up
            </button>
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;