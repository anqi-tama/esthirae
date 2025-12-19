import React, { useState } from 'react';
import { X, Save, Calendar, Clock, MapPin } from 'lucide-react';
import { Shift, Staff } from '../../types';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shift: Shift) => void;
  staffList: Staff[];
}

const ShiftModal: React.FC<ShiftModalProps> = ({ isOpen, onClose, onSave, staffList }) => {
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [location, setLocation] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  // Filter active staff only
  const activeStaff = staffList.filter(s => s.status === 'Active');

  const handleSubmit = () => {
    if (!selectedStaffId) return alert("Please select a staff member.");
    
    const staff = staffList.find(s => s.id === selectedStaffId);
    if (!staff) return;

    if (startTime >= endTime) return alert("End time must be after start time.");

    const newShift: Shift = {
        id: `SH-${Date.now()}`,
        staffId: staff.id,
        staffName: staff.name,
        staffRole: staff.role,
        date: new Date(date),
        startTime,
        endTime,
        location: location || 'Main Clinic',
        isRecurring
    };

    onSave(newShift);
    onClose();
    // Reset minimal fields
    setSelectedStaffId('');
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
          <h2 className="text-lg font-bold text-text-dark">Schedule Shift</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
            <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">Staff Member</label>
                <select 
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                >
                    <option value="">Select Staff...</option>
                    {activeStaff.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">Date</label>
                <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="date"
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-text-muted mb-1.5">Start Time</label>
                    <input 
                        type="time"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-text-muted mb-1.5">End Time</label>
                    <input 
                        type="time"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">Location / Room (Optional)</label>
                <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="e.g. Room A"
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div 
                    onClick={() => setIsRecurring(!isRecurring)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isRecurring ? 'bg-soft-gold' : 'bg-gray-300'}`}
                >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isRecurring ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
                <div>
                    <div className="text-sm font-bold text-text-dark">Recurring Shift</div>
                    <div className="text-[10px] text-text-muted">Repeat weekly on this day</div>
                </div>
            </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-text-muted hover:text-text-dark transition-colors">Cancel</button>
            <button onClick={handleSubmit} className="px-6 py-2 bg-soft-gold text-white text-sm font-bold rounded-lg shadow-md hover:bg-[#cbad85] transition-colors flex items-center gap-2">
                <Save size={16}/> Save Shift
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftModal;