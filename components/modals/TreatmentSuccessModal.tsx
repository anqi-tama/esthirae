
import React from 'react';
import { CheckCircle2, ArrowRight, FileText, Calendar } from 'lucide-react';

interface TreatmentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  treatmentType: string;
}

const TreatmentSuccessModal: React.FC<TreatmentSuccessModalProps> = ({ 
    isOpen, 
    onClose, 
    patientName, 
    treatmentType 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop - Click to Close */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in text-center p-8 z-10">
        
        <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-sage animate-bounce-short" />
        </div>

        <h2 className="text-2xl font-bold text-text-dark mb-2">Treatment Completed!</h2>
        <p className="text-text-muted text-sm mb-6">
            Documentation for <span className="font-bold text-text-dark">{patientName}</span> has been finalized and saved successfully.
        </p>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-8 text-left space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted flex items-center gap-2"><FileText size={14}/> Service</span>
                <span className="font-medium text-text-dark">{treatmentType}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted flex items-center gap-2"><Calendar size={14}/> Date</span>
                <span className="font-medium text-text-dark">{new Date().toLocaleDateString()}</span>
            </div>
        </div>

        <button 
            onClick={onClose}
            className="w-full py-3 bg-text-dark text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
        >
            Back to Treatment List <ArrowRight size={18}/>
        </button>

      </div>
    </div>
  );
};

export default TreatmentSuccessModal;
