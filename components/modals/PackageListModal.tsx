import React from 'react';
import { X, Box, ArrowRight, Tag } from 'lucide-react';
import { MOCK_PACKAGES } from '../../constants.ts';
import { PackageMaster } from '../../types.ts';

interface PackageListModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterTreatment?: string;
  onSelectOfInterest: (pkg: PackageMaster) => void;
}

const PackageListModal: React.FC<PackageListModalProps> = ({ isOpen, onClose, filterTreatment, onSelectOfInterest }) => {
  if (!isOpen) return null;

  const relevantPackages = filterTreatment 
    ? MOCK_PACKAGES.filter(pkg => pkg.items.some(item => item.procedureName.includes(filterTreatment)))
    : MOCK_PACKAGES;

  const displayPackages = relevantPackages.length > 0 ? relevantPackages : MOCK_PACKAGES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh] animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
            <Tag size={18} className="text-soft-gold" />
            Available Packages
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
            {displayPackages.map(pkg => (
                <div key={pkg.id} className="border border-gray-100 rounded-xl p-4 hover:border-soft-gold transition-all bg-white shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-soft-gold/10 rounded-lg flex items-center justify-center text-soft-gold"><Box size={24} /></div>
                            <div>
                                <h3 className="font-bold text-text-dark">{pkg.name}</h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {pkg.items.slice(0, 2).map((item, idx) => (
                                        <span key={idx} className="text-[10px] bg-gray-50 border border-gray-200 px-2 py-1 rounded text-text-dark font-medium">{item.unitCount}x {item.procedureName}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-soft-gold">Rp {pkg.totalPrice.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end">
                        <button onClick={() => { onSelectOfInterest(pkg); onClose(); }} className="text-xs font-bold flex items-center gap-1 text-text-dark hover:text-soft-gold">Select Package <ArrowRight size={14} /></button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PackageListModal;