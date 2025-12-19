
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
    ArrowLeft, 
    CheckCircle2, 
    Clock, 
    User, 
    MapPin, 
    FileText, 
    Stethoscope, 
    Syringe, 
    Package, 
    Camera, 
    MessageSquare, 
    Plus,
    Trash2,
    Pill,
    Beaker,
    Box,
    PenTool,
    Columns,
    ImageIcon,
    X,
    Activity,
    History,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { Treatment, TreatmentStatus, TreatmentProduct, ExecutedProcedure, MedicalRecord } from '../types';
import { MOCK_PATIENTS, MOCK_MEDICAL_RECORDS } from '../constants';
import AddProductModal from './modals/AddProductModal';
import AddProcedureModal from './modals/AddProcedureModal';
import MedicalCanvasModal from './modals/MedicalCanvasModal';
import ComparePhotosModal from './modals/ComparePhotosModal';
import TreatmentSuccessModal from './modals/TreatmentSuccessModal';
import MedicalRecordModal from './modals/MedicalRecordModal';

interface TreatmentDetailProps {
  treatment: Treatment;
  onBack: () => void;
  onUpdate: (updated: Treatment) => void;
}

// Helper component for Photo Grid
const PhotoCategoryGrid = ({ 
    title, 
    photos, 
    onAdd, 
    onDelete, 
    type,
    onCanvas 
}: { 
    title: string, 
    photos: string[], 
    onAdd?: () => void, 
    onDelete: (idx: number) => void,
    type: 'Before' | 'After' | 'Annotation',
    onCanvas?: () => void
}) => (
    <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide flex items-center gap-2">
                {type === 'Before' && <div className="w-2 h-2 rounded-full bg-gray-400"/>}
                {type === 'After' && <div className="w-2 h-2 rounded-full bg-sage"/>}
                {type === 'Annotation' && <div className="w-2 h-2 rounded-full bg-soft-gold"/>}
                {title} <span className="text-[10px] bg-gray-100 px-1.5 rounded-full text-text-muted">{photos.length}</span>
            </h4>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {photos.map((url, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden aspect-square border border-gray-200 bg-gray-50">
                    <img src={url} alt={`${type} ${idx}`} className="w-full h-full object-cover"/>
                    <button 
                        onClick={() => onDelete(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose"
                    >
                        <X size={12}/>
                    </button>
                </div>
            ))}
            
            {/* Add Button */}
            {type === 'Annotation' ? (
                <button 
                    onClick={onCanvas}
                    className="border-2 border-dashed border-soft-gold/30 bg-soft-gold/5 rounded-lg aspect-square flex flex-col items-center justify-center text-soft-gold hover:bg-soft-gold/10 transition-all gap-1"
                >
                    <PenTool size={20}/>
                    <span className="text-[10px] font-bold">Draw</span>
                </button>
            ) : (
                <button 
                    onClick={onAdd}
                    className="border-2 border-dashed border-gray-200 rounded-lg aspect-square flex flex-col items-center justify-center text-text-muted hover:border-gray-300 hover:bg-gray-50 transition-all gap-1"
                >
                    <Camera size={20}/>
                    <span className="text-[10px] font-bold">Add Photo</span>
                </button>
            )}
        </div>
    </div>
);

const TreatmentDetail: React.FC<TreatmentDetailProps> = ({ treatment, onBack, onUpdate }) => {
  const [formData, setFormData] = useState<Treatment>(treatment);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddProcedureOpen, setIsAddProcedureOpen] = useState(false);
  
  // --- New Modals State ---
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  // --- History Detail Modal State ---
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<MedicalRecord | null>(null);
  
  // Structured Photo State
  const [visualData, setVisualData] = useState<{
      before: string[];
      after: string[];
      annotations: string[];
  }>({
      before: ['https://images.unsplash.com/photo-1616750735399-6505084920df?q=80&w=800&auto=format&fit=crop'],
      after: ['https://images.unsplash.com/photo-1512288094938-36328d6396e6?q=80&w=800&auto=format&fit=crop'],
      annotations: []
  });

  // Retrieve full patient data
  const patient = MOCK_PATIENTS.find(p => p.id === treatment.patientId);
  const activePackages = patient?.serviceWallet?.filter(pkg => pkg.remainingUnits > 0 && pkg.status === 'Active') || [];
  
  // Retrieve History
  const patientHistory = MOCK_MEDICAL_RECORDS.filter(r => r.patientId === treatment.patientId && r.date !== treatment.date.toISOString());

  const handleInputChange = (field: keyof Treatment, value: any) => {
    if (formData.isFinalized) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFinish = () => {
    const finalized = { ...formData, status: TreatmentStatus.COMPLETED, isFinalized: true };
    setFormData(finalized);
    onUpdate(finalized);
    setIsSuccessModalOpen(true);
  };

  const handleCloseSuccess = () => {
      setIsSuccessModalOpen(false);
      onBack(); 
  };

  const handleSaveDraft = () => {
      onUpdate(formData);
      alert("Draft saved successfully.");
  }

  // --- Product Handlers ---
  const handleAddProduct = (newProduct: TreatmentProduct) => {
    const updatedProducts = [...(formData.productsUsed || []), newProduct];
    setFormData(prev => ({ ...prev, productsUsed: updatedProducts }));
  };

  const handleRemoveProduct = (productId: string) => {
    const updatedProducts = formData.productsUsed?.filter(p => p.id !== productId) || [];
    setFormData(prev => ({ ...prev, productsUsed: updatedProducts }));
  };

  // --- Procedure Handlers ---
  const handleAddProcedure = (newProcedure: ExecutedProcedure) => {
      const updatedProcedures = [...(formData.additionalProcedures || []), newProcedure];
      setFormData(prev => ({ ...prev, additionalProcedures: updatedProcedures }));
  };

  const handleRemoveProcedure = (procedureId: string) => {
      const updatedProcedures = formData.additionalProcedures?.filter(p => p.id !== procedureId) || [];
      setFormData(prev => ({ ...prev, additionalProcedures: updatedProcedures }));
  };

  const handleRemoveMainTreatment = () => {
      if(window.confirm("Remove the primary treatment from this session?")) {
          handleInputChange('type', ''); 
      }
  }

  // --- Photo Handlers ---

  const handleAddPhoto = (category: 'before' | 'after') => {
      const mockNewPhoto = category === 'before' 
        ? 'https://images.unsplash.com/photo-1588510883386-252a5d246c4f?q=80&w=800&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop';
      
      setVisualData(prev => ({
          ...prev,
          [category]: [...prev[category], mockNewPhoto]
      }));
  };

  const handleCanvasSave = (imgData: string) => {
      setVisualData(prev => ({
          ...prev,
          annotations: [...prev.annotations, imgData]
      }));
  };

  const handleDeletePhoto = (category: 'before' | 'after' | 'annotations', index: number) => {
      setVisualData(prev => {
          const newList = [...prev[category]];
          newList.splice(index, 1);
          return { ...prev, [category]: newList };
      });
  };

  // Helper for Section Headers
  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <Icon size={18} className="text-soft-gold" />
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wide">{title}</h3>
    </div>
  );

  return (
    <>
        {/* Modals */}
        {createPortal(
            <TreatmentSuccessModal 
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccess}
                patientName={formData.patientName}
                treatmentType={formData.type || 'Treatment Session'}
            />, document.body
        )}
        {createPortal(
            <AddProductModal 
                isOpen={isAddProductOpen}
                onClose={() => setIsAddProductOpen(false)}
                onAdd={handleAddProduct}
            />, document.body
        )}
        {createPortal(
            <AddProcedureModal 
                isOpen={isAddProcedureOpen}
                onClose={() => setIsAddProcedureOpen(false)}
                onAdd={handleAddProcedure}
            />, document.body
        )}
        {createPortal(
            <MedicalCanvasModal 
                isOpen={isCanvasOpen}
                onClose={() => setIsCanvasOpen(false)}
                onSave={handleCanvasSave}
                initialImage={visualData.before.length > 0 ? visualData.before[0] : undefined} 
            />, document.body
        )}
        {createPortal(
            <ComparePhotosModal 
                isOpen={isCompareOpen}
                onClose={() => setIsCompareOpen(false)}
                beforeImage={visualData.before[0]}
                afterImage={visualData.after[0]} 
            />, document.body
        )}
        
        {/* History Detail Modal */}
        {createPortal(
            <MedicalRecordModal 
                isOpen={!!selectedHistoryRecord}
                onClose={() => setSelectedHistoryRecord(null)}
                record={selectedHistoryRecord}
            />, document.body
        )}

        <div className="bg-white rounded-2xl shadow-soft h-[calc(100vh-140px)] flex flex-col overflow-hidden animate-fade-in relative">
            
            {/* Top Header Bar */}
            <div className="px-6 py-4 border-b border-gray-100 bg-ivory flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-white rounded-full text-text-muted hover:text-text-dark transition-colors"
                    >
                        <ArrowLeft size={20}/>
                    </button>
                    <div>
                        <h2 className="text-xl font-serif font-bold text-text-dark flex items-center gap-2">
                            {formData.type || <span className="text-gray-400 italic">No Treatment Selected</span>}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                formData.status === TreatmentStatus.IN_PROGRESS ? 'bg-soft-gold/10 text-[#b5986a] border-soft-gold/30' :
                                formData.status === TreatmentStatus.COMPLETED ? 'bg-sage/10 text-sage border-sage/30' :
                                'bg-gray-100 text-gray-500 border-gray-200'
                            }`}>
                                {formData.status}
                            </span>
                        </h2>
                        <div className="flex gap-4 mt-1 text-xs text-text-muted">
                            <span className="flex items-center gap-1"><User size={12}/> {formData.patientName}</span>
                            <span className="flex items-center gap-1"><Clock size={12}/> {new Date(formData.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span className="flex items-center gap-1"><Stethoscope size={12}/> {formData.doctorName}</span>
                        </div>
                    </div>
                </div>
                
                {!formData.isFinalized && (
                    <div className="flex gap-3">
                        <button onClick={handleSaveDraft} className="px-4 py-2 bg-white border border-gray-200 text-text-muted text-sm font-medium rounded-lg hover:text-text-dark hover:border-gray-300 transition-colors">
                            Save Draft
                        </button>
                        <button onClick={handleFinish} className="px-4 py-2 bg-text-dark text-white text-sm font-medium rounded-lg shadow-lg hover:bg-black transition-colors flex items-center gap-2">
                            <CheckCircle2 size={16} /> Finish
                        </button>
                    </div>
                )}
                {formData.isFinalized && (
                    <div className="flex items-center gap-2 text-sage font-medium text-sm bg-sage/10 px-4 py-2 rounded-lg">
                        <CheckCircle2 size={16} /> Treatment Finished
                    </div>
                )}
            </div>

            {/* Split Screen Layout */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* LEFT: DOCTOR INPUT (Wide) */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50/30">
                    <div className="max-w-4xl mx-auto space-y-6">

                        {/* Section 1: Assessment */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <SectionHeader icon={FileText} title="Assessment & Consultation" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Chief Complaint</label>
                                    <textarea 
                                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-soft-gold rounded-xl p-3 text-sm text-text-dark outline-none resize-none transition-all"
                                        rows={3}
                                        placeholder="Patient's main concern..."
                                        value={formData.complaint || ''}
                                        onChange={(e) => handleInputChange('complaint', e.target.value)}
                                        disabled={formData.isFinalized}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Diagnosis / Observation</label>
                                    <textarea 
                                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-soft-gold rounded-xl p-3 text-sm text-text-dark outline-none resize-none transition-all"
                                        rows={3}
                                        placeholder="Clinical findings..."
                                        value={formData.diagnosis || ''}
                                        onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                                        disabled={formData.isFinalized}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Visual Documentation */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <Camera size={18} className="text-soft-gold" />
                                    <h3 className="text-sm font-bold text-text-dark uppercase tracking-wide">Visual Documentation</h3>
                                </div>
                                <button 
                                    onClick={() => setIsCompareOpen(true)}
                                    disabled={visualData.before.length === 0 || visualData.after.length === 0}
                                    className="px-4 py-2 bg-text-dark text-white text-xs font-bold rounded-lg hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Columns size={14}/> Compare Result
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <PhotoCategoryGrid title="Before" type="Before" photos={visualData.before} onAdd={() => handleAddPhoto('before')} onDelete={(idx) => handleDeletePhoto('before', idx)}/>
                                <PhotoCategoryGrid title="After" type="After" photos={visualData.after} onAdd={() => handleAddPhoto('after')} onDelete={(idx) => handleDeletePhoto('after', idx)}/>
                                <PhotoCategoryGrid title="Annotations" type="Annotation" photos={visualData.annotations} onCanvas={() => setIsCanvasOpen(true)} onDelete={(idx) => handleDeletePhoto('annotations', idx)}/>
                            </div>
                        </div>

                        {/* Section 2: Plan & Execution */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <SectionHeader icon={Syringe} title="Treatment Execution" />
                            <div className="space-y-6">
                                {/* Package Selection */}
                                <div>
                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-2 mb-2">
                                        <Box size={14} className="text-soft-gold"/> Package Redemption
                                    </label>
                                    <select 
                                        className={`w-full bg-gray-50 border border-transparent focus:bg-white focus:border-soft-gold rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${formData.linkedServiceWalletId ? 'text-text-dark font-medium ring-1 ring-soft-gold/30 bg-soft-gold/5' : 'text-text-muted'}`}
                                        value={formData.linkedServiceWalletId || ''}
                                        onChange={(e) => {
                                            handleInputChange('linkedServiceWalletId', e.target.value);
                                            if(e.target.value) {
                                                const pkg = activePackages.find(p => p.id === e.target.value);
                                                if(pkg && !formData.plan) {
                                                    handleInputChange('plan', `Redeeming 1x ${pkg.procedureName} from ${pkg.packageName}`);
                                                }
                                            }
                                        }}
                                        disabled={formData.isFinalized}
                                    >
                                        <option value="">No Package - Pay per Visit</option>
                                        {activePackages.map(pkg => (
                                            <option key={pkg.id} value={pkg.id}>
                                                {pkg.packageName} ({pkg.remainingUnits} units left) - {pkg.procedureName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Additional Procedures Table */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-2">
                                            <Activity size={14} className="text-soft-gold"/> Performed Procedures
                                        </label>
                                        {!formData.isFinalized && (
                                            <button 
                                                onClick={() => setIsAddProcedureOpen(true)}
                                                className="text-xs bg-soft-gold text-white hover:bg-[#cbad85] px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
                                            >
                                                <Plus size={12}/> Add Treatment
                                            </button>
                                        )}
                                    </div>
                                    <div className="overflow-hidden border border-gray-100 rounded-lg">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-ivory text-xs text-text-muted uppercase font-semibold">
                                                <tr>
                                                    <th className="px-4 py-2">Treatment Name</th>
                                                    <th className="px-4 py-2">Notes</th>
                                                    <th className="px-4 py-2 text-right">Price</th>
                                                    {!formData.isFinalized && <th className="px-4 py-2 w-10"></th>}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {formData.type && (
                                                    <tr className="bg-soft-gold/5">
                                                        <td className="px-4 py-3 font-medium text-text-dark flex items-center gap-2">
                                                            {formData.type} <span className="text-[10px] px-1.5 py-0.5 bg-soft-gold/20 rounded text-text-dark font-normal">Primary</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-text-muted text-xs italic">Main booking</td>
                                                        <td className="px-4 py-3 text-right text-text-muted">-</td>
                                                        {!formData.isFinalized && (
                                                            <td className="px-4 py-3 text-center">
                                                                <button onClick={handleRemoveMainTreatment} className="text-gray-300 hover:text-rose transition-colors"><Trash2 size={14}/></button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                )}
                                                {formData.additionalProcedures && formData.additionalProcedures.map((proc) => (
                                                    <tr key={proc.id} className="group hover:bg-gray-50">
                                                        <td className="px-4 py-3 font-medium text-text-dark">{proc.name}</td>
                                                        <td className="px-4 py-3 text-text-muted text-xs">{proc.notes || '-'}</td>
                                                        <td className="px-4 py-3 text-right text-text-dark">Rp {proc.price.toLocaleString()}</td>
                                                        {!formData.isFinalized && (
                                                            <td className="px-4 py-3 text-center">
                                                                <button onClick={() => handleRemoveProcedure(proc.id)} className="text-gray-300 hover:text-rose transition-colors"><Trash2 size={14}/></button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Plan & Notes Inputs */}
                                <div className="space-y-4 pt-2 border-t border-gray-100">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Treatment Plan Details</label>
                                        <input 
                                            type="text"
                                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-soft-gold rounded-xl px-4 py-2.5 text-sm text-text-dark outline-none transition-all"
                                            placeholder="Specific protocols, energy settings, or dosages..."
                                            value={formData.plan || ''}
                                            onChange={(e) => handleInputChange('plan', e.target.value)}
                                            disabled={formData.isFinalized}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Procedure Notes</label>
                                        <textarea 
                                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-soft-gold rounded-xl p-3 text-sm text-text-dark outline-none resize-none transition-all"
                                            rows={4}
                                            placeholder="Describe the procedure performed, immediate endpoints, etc..."
                                            value={formData.proceduresDone || ''}
                                            onChange={(e) => handleInputChange('proceduresDone', e.target.value)}
                                            disabled={formData.isFinalized}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Products Used */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <SectionHeader icon={Package} title="Prescriptions & Products" />
                            {!formData.isFinalized && (
                                <div className="flex gap-2 mb-4">
                                    <button 
                                        onClick={() => setIsAddProductOpen(true)}
                                        className="text-xs bg-soft-gold text-white hover:bg-[#cbad85] border border-transparent px-3 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                                    >
                                        <Plus size={14}/> Add Product / Recipe
                                    </button>
                                </div>
                            )}
                            <div className="overflow-hidden border border-gray-100 rounded-lg">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-ivory text-xs text-text-muted uppercase font-semibold">
                                        <tr>
                                            <th className="px-4 py-3">Details</th>
                                            <th className="px-4 py-3">Signa</th>
                                            <th className="px-4 py-3 w-32">Qty</th>
                                            {!formData.isFinalized && <th className="px-4 py-3 w-10"></th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {formData.productsUsed && formData.productsUsed.length > 0 ? (
                                            formData.productsUsed.map((prod) => (
                                                <tr key={prod.id} className="group hover:bg-gray-50/50">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${prod.type === 'Compound' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                                {prod.type === 'Compound' ? <Beaker size={16} /> : <Pill size={16} />}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-text-dark">{prod.name}</div>
                                                                <div className="text-[10px] text-text-muted uppercase tracking-wider">{prod.type}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-text-dark font-medium border border-gray-200">
                                                            {prod.signa?.summary || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-text-dark font-medium">{prod.quantity} {prod.unit}</td>
                                                    {!formData.isFinalized && (
                                                        <td className="px-4 py-3 text-center">
                                                            <button onClick={() => handleRemoveProduct(prod.id)} className="text-gray-300 hover:text-rose transition-colors"><Trash2 size={16}/></button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={4} className="px-4 py-8 text-center text-text-muted italic">No products added.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Section 5: Post Care */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <SectionHeader icon={MessageSquare} title="Post-Care & Follow Up" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Instructions</label>
                                    <textarea 
                                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-soft-gold rounded-xl p-3 text-sm text-text-dark outline-none resize-none transition-all"
                                        rows={2}
                                        value={formData.postCareInstructions || ''}
                                        onChange={(e) => handleInputChange('postCareInstructions', e.target.value)}
                                        disabled={formData.isFinalized}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Next Visit</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-soft-gold rounded-xl px-4 py-2.5 text-sm text-text-dark outline-none transition-all"
                                        value={formData.nextVisit || ''}
                                        onChange={(e) => handleInputChange('nextVisit', e.target.value)}
                                        disabled={formData.isFinalized}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT: PATIENT HISTORY (Narrow) */}
                <div className="w-80 md:w-96 border-l border-gray-200 bg-white flex flex-col h-full overflow-hidden shadow-xl z-10">
                    <div className="p-4 border-b border-gray-100 bg-ivory flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-text-dark flex items-center gap-2 text-sm">
                            <History size={16} className="text-soft-gold"/> Medical History
                        </h3>
                        <span className="text-[10px] bg-gray-200 text-text-muted px-2 py-0.5 rounded-full">{patientHistory.length}</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-gray-50">
                        {patientHistory.length > 0 ? patientHistory.map((record) => (
                            <div 
                                key={record.id} 
                                onClick={() => setSelectedHistoryRecord(record)}
                                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-xs font-bold text-soft-gold">{new Date(record.date).toLocaleDateString()}</div>
                                    <div className="text-[10px] text-text-muted bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                        {record.id}
                                    </div>
                                </div>
                                <h4 className="font-bold text-text-dark text-sm mb-1">{record.treatmentType}</h4>
                                <div className="flex items-center gap-1 text-[10px] text-text-muted mb-3">
                                    <Stethoscope size={10}/> {record.doctorName}
                                </div>
                                
                                {record.diagnosis && (
                                    <div className="mb-2">
                                        <p className="text-[10px] font-bold text-text-muted uppercase">Diagnosis</p>
                                        <p className="text-xs text-text-dark line-clamp-2">{record.diagnosis}</p>
                                    </div>
                                )}
                                
                                <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {record.photos?.map((p, i) => (
                                            <img key={i} src={p.after} className="w-6 h-6 rounded-full border border-white object-cover" alt="History"/>
                                        ))}
                                    </div>
                                    <button className="text-[10px] text-soft-gold font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        View Details <ChevronRight size={10}/>
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-text-muted">
                                <History size={32} className="mx-auto mb-2 opacity-20"/>
                                <p className="text-xs">No previous history found.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    </>
  );
};

export default TreatmentDetail;
