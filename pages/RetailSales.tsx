import React, { useState, useMemo } from 'react';
import { 
    Search, 
    ShoppingBag, 
    Trash2, 
    Plus, 
    Minus, 
    CreditCard, 
    User, 
    X,
    Receipt,
    Wallet,
    TicketPercent,
    ChevronDown
} from 'lucide-react';
import { MOCK_RETAIL_PRODUCTS, MOCK_PATIENTS } from '../constants';
import { CartItem, RetailProduct, Patient, PaymentMethodType, PaymentRecord } from '../types';

const TAX_RATE = 0.11; // 11%

const RetailSales: React.FC = () => {
    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [cart, setCart] = useState<CartItem[]>([]);
    
    // Discount State
    const [discountType, setDiscountType] = useState<'Percent' | 'Nominal'>('Percent');
    const [discountValue, setDiscountValue] = useState<number>(0);
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    
    // Patient State
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isPatientSearchOpen, setIsPatientSearchOpen] = useState(false);
    const [patientSearchTerm, setPatientSearchTerm] = useState('');

    // Payment Modal State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [splitPayments, setSplitPayments] = useState<PaymentRecord[]>([]);
    const [currentPaymentMethod, setCurrentPaymentMethod] = useState<PaymentMethodType>(PaymentMethodType.CASH);
    const [currentPaymentAmount, setCurrentPaymentAmount] = useState<string>('');

    // --- Logic: Cart ---

    const addToCart = (product: RetailProduct) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.price } : item));
        } else {
            setCart([...cart, { ...product, qty: 1, subtotal: product.price }]);
        }
    };

    const updateQty = (id: string, delta: number) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty, subtotal: newQty * item.price };
            }
            return item;
        }));
    };

    const removeFromCart = (id: string) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        if(window.confirm("Clear current cart?")) {
            setCart([]);
            setSelectedPatient(null);
            setSplitPayments([]);
            setDiscountValue(0);
            setIsDiscountOpen(false);
        }
    };

    // --- Logic: Filtering ---

    const categories = ['All', 'Skincare', 'Supplement', 'Kit', 'Merchandise'];
    
    const filteredProducts = MOCK_RETAIL_PRODUCTS.filter(p => {
        const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchSearch;
    });

    // --- Logic: Totals ---

    const cartSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Calculate Discount
    let discountAmount = 0;
    if (discountValue > 0) {
        if (discountType === 'Percent') {
            discountAmount = cartSubtotal * (discountValue / 100);
        } else {
            discountAmount = discountValue;
        }
    }
    // Cap discount at subtotal
    discountAmount = Math.min(discountAmount, cartSubtotal);

    const taxableAmount = cartSubtotal - discountAmount;
    const cartTax = taxableAmount * TAX_RATE;
    const cartTotal = taxableAmount + cartTax;

    const totalPaid = splitPayments.reduce((sum, p) => sum + p.amount, 0);
    const remainingDue = Math.max(0, cartTotal - totalPaid);

    // --- Logic: Payment ---

    const handleOpenPayment = () => {
        if (cart.length === 0) return;
        setSplitPayments([]);
        setCurrentPaymentAmount(cartTotal.toFixed(0)); // Auto-fill full amount
        setIsPaymentModalOpen(true);
    };

    const addPayment = () => {
        const amount = parseFloat(currentPaymentAmount);
        if (isNaN(amount) || amount <= 0) return;
        
        // Allow small rounding diffs
        if (amount > remainingDue + 100) {
             alert(`Amount exceeds remaining due: Rp ${remainingDue.toLocaleString()}`);
             return;
        }

        // Validate Wallet
        if (currentPaymentMethod === PaymentMethodType.WALLET) {
             if (!selectedPatient) {
                 alert("Cannot use Wallet for Guest.");
                 return;
             }
             if ((selectedPatient.walletBalance || 0) < amount) {
                 alert("Insufficient wallet balance.");
                 return;
             }
        }

        setSplitPayments([...splitPayments, { method: currentPaymentMethod, amount }]);
        setCurrentPaymentAmount('');
    };

    const removePayment = (index: number) => {
        const updated = [...splitPayments];
        updated.splice(index, 1);
        setSplitPayments(updated);
    };

    const finalizeTransaction = () => {
        if (remainingDue > 100) { // Allow small threshold
            alert("Payment incomplete.");
            return;
        }
        console.log("Retail Transaction Finalized:", {
            patient: selectedPatient ? selectedPatient.name : "Guest",
            items: cart,
            discount: { type: discountType, value: discountValue, amount: discountAmount },
            payments: splitPayments
        });
        alert("Transaction Successful! Inventory updated.");
        // Reset
        setCart([]);
        setSplitPayments([]);
        setSelectedPatient(null);
        setDiscountValue(0);
        setIsDiscountOpen(false);
        setIsPaymentModalOpen(false);
    };

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 animate-fade-in relative">
            
            {/* LEFT: Product Grid */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-soft overflow-hidden">
                {/* Search & Filter Header */}
                <div className="p-4 border-b border-gray-100 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                        <input 
                            type="text" 
                            placeholder="Scan barcode or search product..." 
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-soft-gold transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
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

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <div 
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-soft-gold/30 transition-all flex flex-col group"
                            >
                                {/* Mock Image Placeholder */}
                                <div 
                                    className="aspect-square rounded-lg mb-3 flex items-center justify-center text-white font-bold text-xl shadow-inner"
                                    style={{ backgroundColor: product.color || '#ddd' }}
                                >
                                    {product.name.substring(0,2).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-text-dark line-clamp-2 leading-tight mb-1">{product.name}</h3>
                                    <p className="text-xs text-text-muted">{product.category}</p>
                                </div>
                                <div className="mt-3 flex justify-between items-end">
                                    <span className="text-sm font-bold text-soft-gold">
                                        Rp {(product.price / 1000).toFixed(0)}k
                                    </span>
                                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-text-muted">
                                        Stock: {product.stock}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: Cart & Checkout */}
            <div className="w-96 bg-white rounded-2xl shadow-soft flex flex-col overflow-hidden border-l border-gray-100">
                
                {/* Patient Toggle */}
                <div className="p-4 border-b border-gray-100 bg-ivory relative">
                    {selectedPatient ? (
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-sm font-bold text-text-dark">{selectedPatient.name}</div>
                                <div className="text-xs text-soft-gold font-medium">{selectedPatient.tier} Member</div>
                            </div>
                            <button onClick={() => setSelectedPatient(null)} className="text-xs text-text-muted hover:text-rose underline">Change</button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsPatientSearchOpen(!isPatientSearchOpen)}
                            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-text-muted font-medium hover:border-soft-gold hover:text-soft-gold hover:bg-soft-gold/5 transition-all flex items-center justify-center gap-2"
                        >
                            <User size={16}/> Select Patient (Optional)
                        </button>
                    )}

                    {/* Simple Patient Dropdown Search */}
                    {isPatientSearchOpen && !selectedPatient && (
                        <div className="absolute top-full left-0 right-0 z-20 bg-white shadow-xl border border-gray-100 p-2 rounded-b-xl">
                            <input 
                                autoFocus
                                className="w-full p-2 bg-gray-50 border rounded-lg text-sm mb-2"
                                placeholder="Search patient..."
                                value={patientSearchTerm}
                                onChange={(e) => setPatientSearchTerm(e.target.value)}
                            />
                            <div className="max-h-40 overflow-y-auto">
                                {MOCK_PATIENTS.filter(p => p.name.toLowerCase().includes(patientSearchTerm.toLowerCase())).map(p => (
                                    <div 
                                        key={p.id} 
                                        onClick={() => { setSelectedPatient(p); setIsPatientSearchOpen(false); }}
                                        className="p-2 hover:bg-ivory cursor-pointer text-sm rounded"
                                    >
                                        {p.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                    {cart.length > 0 ? cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                            <div className="flex-1">
                                <div className="text-sm font-medium text-text-dark">{item.name}</div>
                                <div className="text-xs text-text-muted">Rp {item.price.toLocaleString()}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"><Minus size={12}/></button>
                                <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"><Plus size={12}/></button>
                            </div>
                            <div className="w-20 text-right text-sm font-medium">
                                Rp {item.subtotal.toLocaleString()}
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="ml-2 text-gray-300 hover:text-rose"><Trash2 size={14}/></button>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center h-full text-text-muted opacity-50">
                            <ShoppingBag size={48} className="mb-2"/>
                            <p className="text-sm">Cart is empty</p>
                        </div>
                    )}
                </div>

                {/* Summary & Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Subtotal</span>
                            <span>{cartSubtotal.toLocaleString()}</span>
                        </div>
                        
                        {/* Discount Section */}
                        <div className="flex justify-between items-start text-sm">
                            <div className="flex flex-col gap-1 w-full max-w-[180px]">
                                <div 
                                    className="flex items-center gap-1 text-text-muted cursor-pointer hover:text-soft-gold"
                                    onClick={() => setIsDiscountOpen(!isDiscountOpen)}
                                >
                                    <TicketPercent size={14} /> 
                                    <span>Discount</span>
                                    <ChevronDown size={12} className={`transform transition-transform ${isDiscountOpen ? 'rotate-180' : ''}`}/>
                                </div>
                                
                                {isDiscountOpen && (
                                    <div className="flex gap-2 mt-1 animate-fade-in">
                                        <select 
                                            value={discountType}
                                            onChange={(e) => setDiscountType(e.target.value as 'Percent' | 'Nominal')}
                                            className="bg-white border border-gray-200 rounded text-xs p-1 outline-none"
                                        >
                                            <option value="Percent">%</option>
                                            <option value="Nominal">Rp</option>
                                        </select>
                                        <input 
                                            type="number" 
                                            className="w-full bg-white border border-gray-200 rounded text-xs p-1 outline-none"
                                            placeholder="0"
                                            value={discountValue || ''}
                                            onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                )}
                            </div>
                            <span className="text-rose font-medium">
                                {discountAmount > 0 ? `- ${discountAmount.toLocaleString()}` : '-'}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Tax (11%)</span>
                            <span>{cartTax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                            <span>Total</span>
                            <span className="text-soft-gold">Rp {cartTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        <button onClick={clearCart} className="col-span-1 py-3 bg-white border border-gray-200 rounded-xl text-rose hover:bg-rose/5 hover:border-rose/30 flex items-center justify-center">
                            <Trash2 size={20} />
                        </button>
                        <button 
                            onClick={handleOpenPayment}
                            disabled={cart.length === 0}
                            className="col-span-3 py-3 bg-text-dark text-white rounded-xl font-bold shadow-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Charge Rp {cartTotal.toLocaleString()}
                        </button>
                    </div>
                </div>
            </div>

            {/* PAYMENT MODAL */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPaymentModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-ivory">
                            <h2 className="text-lg font-bold text-text-dark">Complete Payment</h2>
                            <button onClick={() => setIsPaymentModalOpen(false)}><X size={20}/></button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Amount Due Display */}
                            <div className="text-center">
                                <div className="text-sm text-text-muted mb-1">Total Amount Due</div>
                                <div className="text-3xl font-bold text-text-dark">Rp {remainingDue.toLocaleString()}</div>
                                {discountAmount > 0 && (
                                    <div className="text-xs text-sage mt-1">Includes discount of Rp {discountAmount.toLocaleString()}</div>
                                )}
                            </div>

                             {/* Loyalty Wallet Check */}
                            {selectedPatient && (
                                <div className="bg-soft-gold/10 p-3 rounded-lg flex justify-between items-center border border-soft-gold/20">
                                    <div className="flex items-center gap-2 text-sm font-medium text-text-dark">
                                        <Wallet size={16} className="text-soft-gold"/> Wallet Balance
                                    </div>
                                    <div className="font-bold text-soft-gold">Rp {(selectedPatient.walletBalance || 0).toLocaleString()}</div>
                                </div>
                            )}

                            {/* Split Payment Form */}
                            {remainingDue > 0 && (
                                <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="grid grid-cols-3 gap-2">
                                        <select 
                                            className="col-span-1 p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none"
                                            value={currentPaymentMethod}
                                            onChange={(e) => setCurrentPaymentMethod(e.target.value as PaymentMethodType)}
                                        >
                                            <option value={PaymentMethodType.CASH}>Cash</option>
                                            <option value={PaymentMethodType.QRIS}>QRIS</option>
                                            <option value={PaymentMethodType.DEBIT}>Debit</option>
                                            <option value={PaymentMethodType.WALLET}>Wallet</option>
                                        </select>
                                        <input 
                                            type="number"
                                            className="col-span-2 p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none"
                                            placeholder="Amount"
                                            value={currentPaymentAmount}
                                            onChange={(e) => setCurrentPaymentAmount(e.target.value)}
                                        />
                                    </div>
                                    <button onClick={addPayment} className="w-full py-2 bg-text-dark text-white rounded-lg text-sm font-medium hover:bg-black">
                                        Add Payment
                                    </button>
                                </div>
                            )}

                            {/* Payment List */}
                            <div className="space-y-2">
                                {splitPayments.map((p, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm p-2 border-b border-gray-50">
                                        <span className="text-text-muted">{p.method}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">Rp {p.amount.toLocaleString()}</span>
                                            <button onClick={() => removePayment(i)} className="text-rose"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                        
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button 
                                onClick={finalizeTransaction}
                                disabled={remainingDue > 100}
                                className="px-8 py-3 bg-soft-gold text-white font-bold rounded-xl shadow-lg hover:bg-[#cbad85] disabled:bg-gray-300 disabled:shadow-none flex items-center gap-2"
                            >
                                <Receipt size={18}/> Finalize & Print
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RetailSales;