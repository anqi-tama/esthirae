import React, { useState } from 'react';
import { 
    Search, 
    CreditCard, 
    Wallet, 
    Printer, 
    Send,
    Receipt,
    Trash2,
    TicketPercent,
    Check,
    X,
    ChevronDown
} from 'lucide-react';
import { MOCK_INVOICES, MOCK_PATIENTS } from '../constants';
import { Invoice, InvoiceStatus, PaymentMethodType, PaymentRecord } from '../types';

const TAX_RATE = 0.11; // 11% VAT

const Cashier: React.FC = () => {
    const [view, setView] = useState<'queue' | 'history'>('queue');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Active Invoice State
    const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
    const [splitPayments, setSplitPayments] = useState<PaymentRecord[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethodType.CASH);
    const [paymentAmount, setPaymentAmount] = useState<string>('');
    
    // Discount State for Active Invoice Item
    const [editingDiscountId, setEditingDiscountId] = useState<string | null>(null);
    const [itemDiscType, setItemDiscType] = useState<'Percent' | 'Nominal'>('Percent');
    
    // Global Discount State
    const [isEditingGlobalDisc, setIsEditingGlobalDisc] = useState(false);
    const [globalDiscType, setGlobalDiscType] = useState<'Percent' | 'Nominal'>('Percent');
    const [globalDiscValue, setGlobalDiscValue] = useState<string>('');

    // Filtered Lists
    const queueInvoices = MOCK_INVOICES.filter(inv => inv.status !== InvoiceStatus.PAID && inv.status !== InvoiceStatus.CANCELLED);
    const historyInvoices = MOCK_INVOICES.filter(inv => inv.status === InvoiceStatus.PAID || inv.status === InvoiceStatus.CANCELLED);
    
    // Select Invoice Handler
    const handleSelectInvoice = (inv: Invoice) => {
        setActiveInvoice({...inv}); // Clone to avoid mutation of mock directly
        setSplitPayments(inv.payments || []);
        setPaymentAmount('');
        // Reset Discount States
        setEditingDiscountId(null);
        setIsEditingGlobalDisc(false);
    };

    // --- Calculation Logic ---

    const calculateTotals = (invoice: Invoice) => {
        // 1. Calculate Items Subtotal (After Item Discounts)
        const itemsSubtotal = invoice.items.reduce((sum, item) => sum + item.subtotal, 0);
        
        // 2. Apply Global Invoice Discount
        let globalDiscountAmount = 0;
        if (invoice.globalDiscountType === 'Percent') {
            globalDiscountAmount = itemsSubtotal * ((invoice.globalDiscountValue || 0) / 100);
        } else if (invoice.globalDiscountType === 'Nominal') {
            globalDiscountAmount = invoice.globalDiscountValue || 0;
        }

        const subtotalAfterGlobalDisc = Math.max(0, itemsSubtotal - globalDiscountAmount);
        const tax = subtotalAfterGlobalDisc * TAX_RATE;
        const total = subtotalAfterGlobalDisc + tax;

        const paid = splitPayments.reduce((sum, p) => sum + p.amount, 0);

        return {
            itemsSubtotal,
            globalDiscountAmount,
            tax,
            total,
            paid,
            remaining: Math.max(0, total - paid)
        };
    };

    // --- Action Handlers ---

    const handleApplyItemDiscount = (itemId: string, type: 'Percent' | 'Nominal', value: number) => {
        if (!activeInvoice) return;
        
        const updatedItems = activeInvoice.items.map(item => {
            if (item.id === itemId) {
                let discountAmount = 0;
                if (type === 'Percent') {
                    discountAmount = (item.quantity * item.unitPrice) * (value / 100);
                } else {
                    discountAmount = value;
                }
                return {
                    ...item,
                    discountType: type,
                    discountValue: value,
                    subtotal: (item.quantity * item.unitPrice) - discountAmount
                };
            }
            return item;
        });

        setActiveInvoice({ ...activeInvoice, items: updatedItems });
        setEditingDiscountId(null);
    };

    const handleSaveGlobalDiscount = () => {
        if (!activeInvoice) return;
        const val = parseFloat(globalDiscValue) || 0;
        
        setActiveInvoice({
            ...activeInvoice,
            globalDiscountType: globalDiscType,
            globalDiscountValue: val
        });
        setIsEditingGlobalDisc(false);
    };

    const handleAddPayment = () => {
        if (!activeInvoice) return;
        const amount = parseFloat(paymentAmount.replace(/,/g, ''));
        if (isNaN(amount) || amount <= 0) return;

        const totals = calculateTotals(activeInvoice);
        
        if (amount > totals.remaining) {
            alert(`Amount exceeds remaining balance of Rp ${totals.remaining.toLocaleString()}`);
            return;
        }
        
        // Check Wallet Balance if Loyalty Payment
        if (paymentMethod === PaymentMethodType.WALLET) {
            const patient = MOCK_PATIENTS.find(p => p.id === activeInvoice.patientId);
            if (patient && (patient.walletBalance || 0) < amount) {
                alert(`Insufficient wallet balance. Available: Rp ${(patient.walletBalance || 0).toLocaleString()}`);
                return;
            }
        }

        const newPayment: PaymentRecord = {
            method: paymentMethod,
            amount: amount,
            referenceId: `REF-${Date.now().toString().slice(-4)}`
        };

        setSplitPayments([...splitPayments, newPayment]);
        setPaymentAmount('');
    };

    const handleRemovePayment = (index: number) => {
        const newPayments = [...splitPayments];
        newPayments.splice(index, 1);
        setSplitPayments(newPayments);
    };

    const handleProcessPayment = () => {
        if (!activeInvoice) return;
        const totals = calculateTotals(activeInvoice);
        
        if (totals.remaining > 0) {
            alert("Payment incomplete. Please settle the remaining balance.");
            return;
        }

        if (window.confirm("Finalize payment and close invoice?")) {
            console.log("Processing Payment...", { invoiceId: activeInvoice.id, payments: splitPayments });
            setActiveInvoice(null);
            setSplitPayments([]);
            alert("Transaction Successful!");
            setView('history');
        }
    };

    const totals = activeInvoice ? calculateTotals(activeInvoice) : null;
    const activePatient = activeInvoice ? MOCK_PATIENTS.find(p => p.id === activeInvoice.patientId) : null;

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 animate-fade-in">
            
            {/* Left Panel: Queue & List */}
            <div className="w-1/3 bg-white rounded-2xl shadow-soft flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-xl font-medium text-text-dark mb-4">Cashier Queue</h2>
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                        <button 
                            onClick={() => setView('queue')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${view === 'queue' ? 'bg-white text-text-dark shadow-sm' : 'text-text-muted hover:text-text-dark'}`}
                        >
                            Unpaid ({queueInvoices.length})
                        </button>
                        <button 
                            onClick={() => setView('history')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${view === 'history' ? 'bg-white text-text-dark shadow-sm' : 'text-text-muted hover:text-text-dark'}`}
                        >
                            History
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                            type="text" 
                            placeholder="Search invoice or patient..." 
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {(view === 'queue' ? queueInvoices : historyInvoices).map(inv => (
                        <div 
                            key={inv.id}
                            onClick={() => handleSelectInvoice(inv)}
                            className={`p-4 rounded-xl border mb-2 cursor-pointer transition-all ${activeInvoice?.id === inv.id ? 'bg-soft-gold/5 border-soft-gold' : 'bg-white border-gray-100 hover:border-gray-300'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-text-dark">{inv.patientName}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                    inv.status === InvoiceStatus.PAID ? 'bg-sage/10 text-sage border-sage/30' :
                                    inv.status === InvoiceStatus.UNPAID ? 'bg-amber/10 text-amber border-amber/30' :
                                    'bg-gray-100 text-gray-500'
                                }`}>{inv.status}</span>
                            </div>
                            <div className="flex justify-between text-xs text-text-muted">
                                <span>{inv.id}</span>
                                <span>{inv.date.toLocaleDateString()}</span>
                            </div>
                            <div className="mt-2 text-sm font-medium text-text-dark text-right">
                                Rp {inv.totalAmount.toLocaleString()}
                            </div>
                        </div>
                    ))}
                    {(view === 'queue' ? queueInvoices : historyInvoices).length === 0 && (
                        <div className="text-center py-10 text-text-muted text-sm">No invoices found.</div>
                    )}
                </div>
            </div>

            {/* Right Panel: Active POS / Checkout */}
            <div className="flex-1 bg-white rounded-2xl shadow-soft flex flex-col overflow-hidden relative">
                {activeInvoice ? (
                    <>
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-ivory flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
                                    {activeInvoice.patientName}
                                    <span className="text-xs font-normal bg-soft-gold/20 text-text-dark px-2 py-0.5 rounded-full border border-soft-gold/30">
                                        {activeInvoice.patientTier} Member
                                    </span>
                                </h2>
                                <p className="text-xs text-text-muted mt-1">Invoice: {activeInvoice.id} • Dr. {activeInvoice.doctorName}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-text-muted uppercase tracking-wide">Status</div>
                                <div className={`font-bold ${activeInvoice.status === InvoiceStatus.UNPAID ? 'text-amber' : 'text-sage'}`}>
                                    {activeInvoice.status.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                            
                            {/* Item List (Scrollable) */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 border-r border-gray-50">
                                <table className="w-full text-left">
                                    <thead className="text-xs text-text-muted uppercase border-b border-gray-100">
                                        <tr>
                                            <th className="py-2">Item</th>
                                            <th className="py-2 text-center">Qty</th>
                                            <th className="py-2 text-right">Price</th>
                                            <th className="py-2 text-right">Discount</th>
                                            <th className="py-2 text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {activeInvoice.items.map((item) => (
                                            <tr key={item.id} className="group">
                                                <td className="py-3 pr-2">
                                                    <div className="font-medium text-sm text-text-dark">{item.name}</div>
                                                    <div className="text-[10px] text-text-muted">{item.type}</div>
                                                </td>
                                                <td className="py-3 text-center text-sm">{item.quantity}</td>
                                                <td className="py-3 text-right text-sm text-text-muted">{item.unitPrice.toLocaleString()}</td>
                                                <td className="py-3 text-right">
                                                    {editingDiscountId === item.id ? (
                                                        <div className="flex items-center justify-end gap-1 bg-white border border-soft-gold/50 rounded-lg p-1 shadow-sm">
                                                            <select 
                                                                className="text-xs border-r border-gray-200 pr-1 bg-transparent focus:outline-none cursor-pointer"
                                                                value={itemDiscType}
                                                                onChange={(e) => setItemDiscType(e.target.value as any)}
                                                            >
                                                                <option value="Percent">%</option>
                                                                <option value="Nominal">Rp</option>
                                                            </select>
                                                            <input 
                                                                autoFocus
                                                                className="w-16 text-xs text-right focus:outline-none"
                                                                placeholder="0"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleApplyItemDiscount(item.id, itemDiscType, parseFloat((e.target as HTMLInputElement).value) || 0)
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div 
                                                            onClick={() => {
                                                                if(activeInvoice.status !== InvoiceStatus.PAID) {
                                                                    setEditingDiscountId(item.id);
                                                                    setItemDiscType(item.discountType || 'Percent');
                                                                }
                                                            }}
                                                            className={`text-xs cursor-pointer ${item.discountValue ? 'text-rose font-medium bg-rose/5 px-2 py-1 rounded' : 'text-gray-300 hover:text-soft-gold'}`}
                                                        >
                                                            {item.discountValue ? (item.discountType === 'Percent' ? `${item.discountValue}%` : `- ${item.discountValue.toLocaleString()}`) : (activeInvoice.status !== InvoiceStatus.PAID ? 'Add Disc' : '-')}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 text-right text-sm font-medium text-text-dark">
                                                    {item.subtotal.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                {/* Totals Section */}
                                <div className="mt-8 space-y-2 border-t border-gray-100 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-muted">Subtotal</span>
                                        <span className="font-medium">{totals?.itemsSubtotal.toLocaleString()}</span>
                                    </div>
                                    
                                    {/* Global Invoice Discount Input */}
                                    <div className="flex justify-between items-center text-sm min-h-[28px]">
                                        <div className="flex items-center gap-1 text-text-muted">
                                            <TicketPercent size={14}/> 
                                            <span>Invoice Discount</span>
                                        </div>
                                        
                                        {isEditingGlobalDisc ? (
                                            <div className="flex items-center gap-1 animate-fade-in">
                                                <div className="flex items-center bg-white border border-soft-gold rounded-lg shadow-sm p-0.5">
                                                    <select 
                                                        className="text-xs bg-transparent border-r border-gray-200 px-1 py-1 focus:outline-none cursor-pointer"
                                                        value={globalDiscType}
                                                        onChange={(e) => setGlobalDiscType(e.target.value as any)}
                                                    >
                                                        <option value="Percent">%</option>
                                                        <option value="Nominal">Rp</option>
                                                    </select>
                                                    <input 
                                                        type="number"
                                                        className="w-20 px-2 py-1 text-xs text-right focus:outline-none"
                                                        placeholder="Value"
                                                        value={globalDiscValue}
                                                        onChange={(e) => setGlobalDiscValue(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                                <button onClick={handleSaveGlobalDiscount} className="p-1 bg-sage text-white rounded hover:bg-sage/80"><Check size={14}/></button>
                                                <button onClick={() => setIsEditingGlobalDisc(false)} className="p-1 bg-gray-200 text-gray-500 rounded hover:bg-gray-300"><X size={14}/></button>
                                            </div>
                                        ) : (
                                            <div 
                                                onClick={() => {
                                                    if(activeInvoice.status !== InvoiceStatus.PAID) {
                                                        setIsEditingGlobalDisc(true);
                                                        setGlobalDiscType(activeInvoice.globalDiscountType || 'Percent');
                                                        setGlobalDiscValue(activeInvoice.globalDiscountValue?.toString() || '');
                                                    }
                                                }}
                                                className={`cursor-pointer font-medium flex items-center gap-1 ${totals?.globalDiscountAmount ? 'text-rose' : 'text-gray-300 hover:text-soft-gold'}`}
                                            >
                                                {totals?.globalDiscountAmount 
                                                    ? `- ${totals.globalDiscountAmount.toLocaleString()}` 
                                                    : (activeInvoice.status !== InvoiceStatus.PAID ? <span className="text-xs flex items-center gap-1">Add <ChevronDown size={10}/></span> : '-')
                                                }
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-muted">Tax (11%)</span>
                                        <span className="font-medium">{totals?.tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                                        <span className="text-text-dark">Total Amount</span>
                                        <span className="text-soft-gold">Rp {totals?.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section (Fixed Right) */}
                            <div className="w-80 bg-gray-50 p-6 flex flex-col border-l border-gray-100">
                                
                                {activeInvoice.status === InvoiceStatus.PAID ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-sage/20 text-sage rounded-full flex items-center justify-center mb-4">
                                            <Receipt size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-text-dark">Paid in Full</h3>
                                        <p className="text-text-muted text-sm mt-1">
                                            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                                        </p>
                                        <div className="mt-8 w-full space-y-3">
                                             <button className="w-full py-3 bg-white border border-gray-200 text-text-dark font-medium rounded-xl shadow-sm hover:bg-gray-100 flex items-center justify-center gap-2">
                                                <Printer size={18} /> Print Invoice
                                            </button>
                                            <button className="w-full py-3 bg-white border border-gray-200 text-text-dark font-medium rounded-xl shadow-sm hover:bg-gray-100 flex items-center justify-center gap-2">
                                                <Send size={18} /> Send via WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="font-bold text-text-dark mb-4">Payment Method</h3>
                                        
                                        {/* Loyalty Info */}
                                        {activePatient && (
                                            <div className="bg-ivory border border-soft-gold/30 rounded-lg p-3 mb-4">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-text-dark uppercase flex items-center gap-1">
                                                        <Wallet size={12}/> Wallet Balance
                                                    </span>
                                                    <span className="text-sm font-bold text-soft-gold">
                                                        Rp {(activePatient.walletBalance || 0).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Input Payment */}
                                        <div className="space-y-3 mb-6">
                                            <select 
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
                                            >
                                                <option value={PaymentMethodType.CASH}>Cash</option>
                                                <option value={PaymentMethodType.QRIS}>QRIS</option>
                                                <option value={PaymentMethodType.DEBIT}>Debit Card</option>
                                                <option value={PaymentMethodType.CREDIT}>Credit Card</option>
                                                <option value={PaymentMethodType.TRANSFER}>Bank Transfer</option>
                                                <option value={PaymentMethodType.WALLET}>Deposit Wallet</option>
                                            </select>
                                            
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">Rp</span>
                                                <input 
                                                    type="number"
                                                    placeholder="0"
                                                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-soft-gold"
                                                    value={paymentAmount}
                                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddPayment()}
                                                />
                                            </div>

                                            <button 
                                                onClick={handleAddPayment}
                                                disabled={!paymentAmount}
                                                className="w-full py-2 bg-text-dark text-white text-sm font-medium rounded-lg hover:bg-black transition-colors disabled:bg-gray-300"
                                            >
                                                Add Payment
                                            </button>
                                        </div>

                                        {/* Split Payment List */}
                                        <div className="flex-1 overflow-y-auto mb-4 border-t border-b border-gray-100 py-2 space-y-2">
                                            {splitPayments.length > 0 ? splitPayments.map((p, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => handleRemovePayment(idx)} className="text-gray-300 hover:text-rose"><Trash2 size={14}/></button>
                                                        <span className="text-text-muted">{p.method}</span>
                                                    </div>
                                                    <span className="font-medium">Rp {p.amount.toLocaleString()}</span>
                                                </div>
                                            )) : (
                                                <div className="text-center text-xs text-text-muted italic py-2">No payments added yet.</div>
                                            )}
                                        </div>

                                        {/* Remaining */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-text-muted">Total Paid</span>
                                                <span className="font-medium text-sage">{totals?.paid.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-bold">
                                                <span className="text-text-dark">Remaining</span>
                                                <span className={`${(totals?.remaining || 0) > 0 ? 'text-rose' : 'text-sage'}`}>
                                                    {(totals?.remaining || 0).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Process Button */}
                                        <button 
                                            onClick={handleProcessPayment}
                                            disabled={(totals?.remaining || 0) > 0}
                                            className="w-full py-3.5 bg-soft-gold text-white font-bold rounded-xl shadow-lg hover:bg-[#cbad85] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none flex items-center justify-center gap-2"
                                        >
                                            <Receipt size={18}/> Process Payment
                                        </button>
                                    </>
                                )}
                            </div>

                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
                        <CreditCard size={48} className="mb-4 opacity-20"/>
                        <p>Select an unpaid invoice to process payment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cashier;