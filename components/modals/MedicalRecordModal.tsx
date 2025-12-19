
import React from 'react';
import { X, Calendar, User, FileText, Pill, Camera, Stethoscope, Syringe } from 'lucide-react';
import { MedicalRecord } from '../../types';

interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecord | null;
}

const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({ isOpen, onClose, record }) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-ivory flex justify-between items-start">
          <div className="flex gap-4">
             <div className="w-12 h-12 bg-soft-gold/10 rounded-xl flex items-center justify-center text-soft-gold shrink-0">
                <FileText size={24}/>
             </div>
             <div>
                <h2 className="text-xl font-serif font-bold text-text-dark">{record.treatmentType}</h2>
                <div className="flex items-center gap-4 text-sm text-text-muted mt-1">
                    <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Stethoscope size={14}/> {record.doctorName}</span>
                </div>
             </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-200 rounded-full text-text-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
            
            {/* Diagnosis & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Diagnosis</label>
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-text-dark font-medium text-sm">
                        {record.diagnosis}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Clinical Notes</label>
                    <div className="bg-white border border-gray-200 p-4 rounded-xl text-text-dark text-sm leading-relaxed h-full">
                        {record.clinicalNotes}
                    </div>
                </div>
            </div>

            {/* Treatment Execution Section */}
            {(record.treatmentPlan || record.procedureNotes || (record.procedures && record.procedures.length > 0)) && (
                <div className="space-y-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-soft-gold">
                        <Syringe size={18} />
                        <h3 className="text-sm font-bold uppercase tracking-wide text-text-dark">Treatment Execution</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Plan */}
                         {record.treatmentPlan && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Treatment Plan</label>
                                <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl text-text-dark text-sm">
                                    {record.treatmentPlan}
                                </div>
                            </div>
                        )}
                        
                        {/* Procedures */}
                        {record.procedures && record.procedures.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Procedures Performed</label>
                                <div className="flex flex-col gap-2">
                                    {record.procedures.map((p, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-text-dark">
                                            <div className="w-1.5 h-1.5 rounded-full bg-soft-gold"></div>
                                            {p}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Procedure Notes */}
                    {record.procedureNotes && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Procedure Notes</label>
                            <div className="bg-white border border-gray-200 p-4 rounded-xl text-text-dark text-sm leading-relaxed">
                                {record.procedureNotes}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Prescriptions */}
            {record.prescriptions && record.prescriptions.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-gray-100">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wide flex items-center gap-2">
                        <Pill size={14}/> Prescriptions & Products
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {record.prescriptions.map((item, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-100">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Photos */}
            {record.photos && record.photos.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-gray-100">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wide flex items-center gap-2">
                        <Camera size={14}/> Treatment Photos
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {record.photos.map((photo, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                                <div className="flex gap-4 h-48">
                                    <div className="flex-1 relative group overflow-hidden rounded-lg bg-black">
                                        <img src={photo.before} alt="Before" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"/>
                                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded">BEFORE</div>
                                    </div>
                                    <div className="flex-1 relative group overflow-hidden rounded-lg bg-black">
                                        <img src={photo.after} alt="After" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"/>
                                        <div className="absolute top-2 right-2 bg-soft-gold backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">AFTER</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-right">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-white border border-gray-300 text-text-dark font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
            >
                Close Details
            </button>
        </div>

      </div>
    </div>
  );
};

export default MedicalRecordModal;
