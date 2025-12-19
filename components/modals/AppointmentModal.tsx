import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Stethoscope, MapPin, Search, Plus, ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { MOCK_PATIENTS, ROOMS } from '../../constants';
import { Patient, AppointmentStatus, Appointment } from '../../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledData?: {
    time?: string;
    doctor?: string;
  };
  appointmentToEdit?: Appointment | null; // New prop for editing
}

type ModalView = 'appointment' | 'new-patient';

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, prefilledData, appointmentToEdit }) => {
  const [view, setView] = useState<ModalView>('appointment');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Form States
  const [aptForm, setAptForm] = useState({
    doctor: '',
    time: '',
    treatment: '',
    room: '',
    notes: '',
    status: AppointmentStatus.CONFIRMED
  });

  const [patientForm, setPatientForm] = useState({
    name: '',
    phone: '',
    dob: '',
    email: ''
  });

  // Reset or Prefill when opened
  useEffect(() => {
    if (isOpen) {
      setView('appointment');
      setSearchTerm('');
      setIsSearching(false);

      if (appointmentToEdit) {
        // --- EDIT MODE ---
        setAptForm({
          doctor: appointmentToEdit.doctor,
          time: appointmentToEdit.time,
          treatment: appointmentToEdit.treatment,
          room: appointmentToEdit.room || '',
          notes: appointmentToEdit.notes || '',
          status: appointmentToEdit.status
        });
        
        // Find existing patient or create a mock one for display
        const existingPatient = MOCK_PATIENTS.find(p => p.id === appointmentToEdit.patientId);
        if (existingPatient) {
            setSelectedPatient(existingPatient);
            setSearchTerm(existingPatient.name);
        } else {
            // Fallback if patient not in mock list (shouldn't happen in real app)
            setSearchTerm(appointmentToEdit.patientName);
        }

      } else {
        // --- CREATE MODE ---
        setSelectedPatient(null);
        setAptForm(prev => ({
          ...prev,
          doctor: prefilledData?.doctor || 'Dr. Sarah',
          time: prefilledData?.time || '09:00',
          treatment: '',
          room: '',
          notes: '',
          status: AppointmentStatus.CONFIRMED
        }));
      }
    }
  }, [isOpen, prefilledData, appointmentToEdit]);

  if (!isOpen) return null;

  // --- Handlers ---

  const handlePatientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsSearching(true);
    if (e.target.value === '') {
        setIsSearching(false);
        setSelectedPatient(null);
    }
  };

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name);
    setIsSearching(false);
  };

  const handleSavePatient = () => {
    // Simulate saving patient
    const newId = `P-${Math.floor(Math.random() * 1000)}`;
    const newPatient: Patient = { 
      id: newId, 
      ...patientForm,
      gender: 'Female', 
      tier: 'Silver',
      lastVisit: new Date(),
      lastDoctor: '-',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(patientForm.name)}&background=random`
    };
    
    setSelectedPatient(newPatient);
    setSearchTerm(newPatient.name);
    setView('appointment');
  };

  const handleSaveAppointment = () => {
    console.log(appointmentToEdit ? "Updating Appointment:" : "Creating Appointment:", { ...aptForm, patient: selectedPatient });
    // In a real app, you would dispatch an update here
    onClose();
  };

  const handleDelete = () => {
      if(window.confirm("Are you sure you want to cancel/delete this appointment?")) {
          console.log("Deleted appointment");
          onClose();
      }
  }

  // --- Views ---

  const renderAppointmentForm = () => (
    <div className="space-y-5">
      {/* Patient Search - Read Only if Editing (usually implies changing patient is rare) */}
      <div className="relative z-20">
        <label className="block text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Patient</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handlePatientSearch}
            placeholder="Search by name or phone..."
            className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold focus:ring-1 focus:ring-soft-gold/20 ${appointmentToEdit ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={!!appointmentToEdit} 
          />
        </div>
        
        {/* Dropdown Results */}
        {!appointmentToEdit && isSearching && searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-48 overflow-y-auto">
             {MOCK_PATIENTS.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.phone.includes(searchTerm)
             ).map(p => (
               <div 
                key={p.id} 
                onClick={() => selectPatient(p)}
                className="px-4 py-3 hover:bg-ivory cursor-pointer border-b border-gray-50 last:border-none"
               >
                 <div className="text-sm font-medium text-text-dark">{p.name}</div>
                 <div className="text-xs text-text-muted">{p.phone}</div>
               </div>
             ))}
             <div 
                onClick={() => setView('new-patient')}
                className="px-4 py-3 bg-soft-gold/5 text-soft-gold text-sm font-medium hover:bg-soft-gold/10 cursor-pointer flex items-center gap-2"
             >
                <Plus size={16} /> Patient not found? Register New
             </div>
          </div>
        )}
      </div>

      {/* Doctor & Time Row */}
      <div className="grid grid-cols-2 gap-4">
         <div>
            <label className="block text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Doctor</label>
            <div className="relative">
                <Stethoscope size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  value={aptForm.doctor}
                  onChange={(e) => setAptForm({...aptForm, doctor: e.target.value})}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold appearance-none"
                >
                    <option>Dr. Sarah</option>
                    <option>Dr. James</option>
                    <option>Dr. A. Wijaya</option>
                </select>
            </div>
         </div>
         <div>
            <label className="block text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Time</label>
            <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="time" 
                  value={aptForm.time}
                  onChange={(e) => setAptForm({...aptForm, time: e.target.value})}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                />
            </div>
         </div>
      </div>

      {/* Treatment & Room Row */}
      <div className="grid grid-cols-2 gap-4">
         <div>
            <label className="block text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Treatment</label>
            <select 
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold appearance-none"
                value={aptForm.treatment}
                onChange={(e) => setAptForm({...aptForm, treatment: e.target.value})}
            >
                <option value="">Select Service...</option>
                <option value="Laser Rejuvenation (Full Face)">Laser Rejuvenation</option>
                <option value="Botox Injection (3 Areas)">Botox Injection</option>
                <option value="Korean Glow Facial">Korean Glow Facial</option>
                <option value="Slimming Consultation">Slimming Consultation</option>
                <option value="Microdermabrasion">Microdermabrasion</option>
                {/* Add a generic option if existing treatment isn't in list */}
                {appointmentToEdit && !['Laser Rejuvenation (Full Face)', 'Botox Injection (3 Areas)', 'Korean Glow Facial', 'Slimming Consultation', 'Microdermabrasion', ''].includes(aptForm.treatment) && (
                    <option value={aptForm.treatment}>{aptForm.treatment}</option>
                )}
            </select>
         </div>
         <div>
            <label className="block text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Room</label>
            <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold appearance-none"
                    value={aptForm.room}
                    onChange={(e) => setAptForm({...aptForm, room: e.target.value})}
                >
                    <option value="">Auto-Assign</option>
                    {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
         </div>
      </div>
      
      {/* Status Selection */}
      <div>
         <label className="block text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Status</label>
         <div className="flex flex-wrap gap-2">
            {[
                AppointmentStatus.REQUESTED, 
                AppointmentStatus.CONFIRMED, 
                AppointmentStatus.CHECKED_IN,
                AppointmentStatus.COMPLETED,
                AppointmentStatus.CANCELLED
            ].map(status => (
                <button
                    key={status}
                    onClick={() => setAptForm({...aptForm, status})}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        aptForm.status === status 
                        ? (status === AppointmentStatus.CANCELLED ? 'bg-rose/10 border-rose text-rose' : 'bg-soft-gold/10 border-soft-gold text-text-dark') 
                        : 'bg-white border-gray-200 text-text-muted hover:bg-gray-50'
                    }`}
                >
                    {status}
                </button>
            ))}
         </div>
      </div>

      {/* Notes */}
      <div>
         <label className="block text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Notes</label>
         <textarea 
            rows={2}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold resize-none"
            placeholder="Allergies, preferences, or special requests..."
            value={aptForm.notes}
            onChange={(e) => setAptForm({...aptForm, notes: e.target.value})}
         ></textarea>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex gap-3">
          {appointmentToEdit && (
              <button 
                onClick={handleDelete}
                className="py-2.5 px-4 bg-white border border-gray-200 text-rose rounded-xl hover:bg-rose/5 transition-colors"
                title="Delete Appointment"
              >
                  <Trash2 size={18} />
              </button>
          )}
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-text-muted hover:text-text-dark transition-colors">
              Cancel
          </button>
          <button onClick={handleSaveAppointment} className="flex-1 py-2.5 bg-soft-gold text-white text-sm font-medium rounded-xl shadow-lg hover:bg-[#cbad85] transition-colors flex items-center justify-center gap-2">
              {appointmentToEdit ? <CheckCircle2 size={18} /> : <Calendar size={18} />} 
              {appointmentToEdit ? 'Update Changes' : 'Schedule'}
          </button>
      </div>
    </div>
  );

  const renderNewPatientForm = () => (
    <div className="space-y-5 animate-fade-in">
        <div className="bg-ivory/50 p-4 rounded-xl border border-soft-gold/20 mb-4">
            <h3 className="text-sm font-semibold text-text-dark mb-1">Register New Patient</h3>
            <p className="text-xs text-text-muted">Enter patient details to generate a medical ID.</p>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Full Name</label>
                <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        value={patientForm.name}
                        onChange={e => setPatientForm({...patientForm, name: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                        placeholder="e.g. Jane Doe"
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Phone (WhatsApp)</label>
                    <input 
                        type="tel" 
                        value={patientForm.phone}
                        onChange={e => setPatientForm({...patientForm, phone: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                        placeholder="081..."
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Date of Birth</label>
                    <input 
                        type="date" 
                        value={patientForm.dob}
                        onChange={e => setPatientForm({...patientForm, dob: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                    />
                </div>
            </div>

             <div>
                <label className="block text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Email (Optional)</label>
                <input 
                    type="email" 
                    value={patientForm.email}
                    onChange={e => setPatientForm({...patientForm, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                    placeholder="patient@example.com"
                />
            </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button 
            onClick={() => setView('appointment')} 
            className="flex-1 py-2.5 text-sm font-medium text-text-muted hover:text-text-dark transition-colors flex items-center justify-center gap-2"
          >
              <ArrowLeft size={16} /> Back
          </button>
          <button 
            onClick={handleSavePatient} 
            className="flex-1 py-2.5 bg-text-dark text-white text-sm font-medium rounded-xl shadow-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
              <CheckCircle2 size={16} /> Save Patient
          </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-50 bg-ivory">
          <div>
            <h2 className="text-xl font-semibold text-text-dark">
                {view === 'appointment' ? (appointmentToEdit ? 'Edit Appointment' : 'New Appointment') : 'New Patient'}
            </h2>
            <p className="text-xs text-text-muted mt-1">
                {view === 'appointment' ? (appointmentToEdit ? `Updating schedule for ${appointmentToEdit.patientName}` : 'Fill in details to schedule a visit.') : 'Create ID for a new customer.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
            {view === 'appointment' ? renderAppointmentForm() : renderNewPatientForm()}
        </div>

      </div>
    </div>
  );
};

export default AppointmentModal;