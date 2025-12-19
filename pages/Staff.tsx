import React, { useState } from 'react';
import { 
    Users, 
    CalendarClock, 
    Plus, 
    Search, 
    Filter, 
    MoreHorizontal,
    Edit2,
    Trash2,
    Shield,
    Phone,
    MapPin,
    Clock,
    UserCheck,
    Stethoscope
} from 'lucide-react';
import { MOCK_STAFF, MOCK_SHIFTS } from '../constants';
import { Staff, Shift, StaffRole } from '../types';
import StaffModal from '../components/modals/StaffModal';
import ShiftModal from '../components/modals/ShiftModal';

type Tab = 'staff' | 'shifts';

const StaffPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('staff');
    const [staffList, setStaffList] = useState<Staff[]>(MOCK_STAFF);
    const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);
    
    // Modal States
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('All');

    // --- Handlers ---

    const handleSaveStaff = (staff: Staff) => {
        if (staffList.some(s => s.id === staff.id)) {
            // Edit
            setStaffList(staffList.map(s => s.id === staff.id ? staff : s));
        } else {
            // Add
            setStaffList([...staffList, staff]);
        }
        setEditingStaff(null);
    };

    const handleEditStaff = (staff: Staff) => {
        setEditingStaff(staff);
        setIsStaffModalOpen(true);
    };

    const handleDeleteStaff = (id: string) => {
        if(window.confirm("Are you sure? This will deactivate the staff member.")) {
            setStaffList(staffList.map(s => s.id === id ? { ...s, status: 'Inactive' } : s));
        }
    };

    const handleSaveShift = (shift: Shift) => {
        setShifts([...shifts, shift]);
    };

    // --- Views ---

    const StaffDirectoryView = () => {
        const filteredStaff = staffList.filter(s => {
            const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.phone.includes(searchTerm);
            const matchRole = roleFilter === 'All' || s.role === roleFilter;
            return matchSearch && matchRole;
        });

        return (
            <div className="space-y-6 animate-fade-in">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {['All', 'Doctor', 'Nurse', 'Therapist', 'Admin', 'Cashier'].map(role => (
                            <button 
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all whitespace-nowrap ${
                                    roleFilter === role 
                                    ? 'bg-text-dark text-white border-text-dark' 
                                    : 'bg-white text-text-muted border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                            type="text" 
                            placeholder="Search staff..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Data Table View */}
                <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-ivory border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Staff Info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Credentials / Spec</th>
                                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStaff.map(staff => (
                                <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={staff.avatarUrl} alt={staff.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"/>
                                            <div>
                                                <div className="font-medium text-text-dark">{staff.name}</div>
                                                <div className="text-xs text-text-muted flex items-center gap-1">
                                                    {staff.role === 'Doctor' || staff.role === 'Nurse' ? <Stethoscope size={12}/> : <UserCheck size={12}/>}
                                                    {staff.role}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-text-dark">
                                            <Phone size={14} className="text-text-muted"/> {staff.phone}
                                        </div>
                                        {staff.email && (
                                            <div className="text-xs text-text-muted mt-0.5 ml-5">
                                                {staff.email}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(staff.strNumber || staff.specialization) ? (
                                            <div>
                                                {staff.specialization && <div className="text-sm font-medium text-text-dark">{staff.specialization}</div>}
                                                {staff.strNumber && <div className="text-xs text-text-muted flex items-center gap-1 mt-0.5"><Shield size={12}/> {staff.strNumber}</div>}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-text-muted">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                            staff.status === 'Active' ? 'bg-sage/10 border-sage/30 text-sage' : 'bg-gray-100 border-gray-200 text-gray-500'
                                        }`}>
                                            {staff.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEditStaff(staff)}
                                                className="p-1.5 rounded-lg text-text-muted hover:text-soft-gold hover:bg-soft-gold/10 transition-all"
                                                title="Edit Staff"
                                            >
                                                <Edit2 size={16}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteStaff(staff.id)}
                                                className="p-1.5 rounded-lg text-text-muted hover:text-rose hover:bg-rose/10 transition-all"
                                                title="Deactivate Staff"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredStaff.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                                        No staff found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const ShiftScheduleView = () => {
        // Simple Weekly View Simulation
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        return (
            <div className="space-y-6 animate-fade-in">
                {/* Header Filter for Shift View */}
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-text-dark">Weekly Overview</h3>
                        <div className="flex gap-2 text-xs">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-soft-gold"></div> Doctor</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-lavender"></div> Nurse</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sage"></div> Other</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="text-sm text-text-muted hover:text-text-dark">Previous</button>
                        <span className="text-sm font-bold text-text-dark">Oct 23 - Oct 29</span>
                        <button className="text-sm text-text-muted hover:text-text-dark">Next</button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-7 border-b border-gray-100 bg-ivory">
                        {days.map(day => (
                            <div key={day} className="py-3 text-center text-xs font-bold text-text-muted uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 min-h-[400px] divide-x divide-gray-100">
                        {days.map((day, idx) => (
                            <div key={day} className="p-2 space-y-2">
                                {/* Filter shifts roughly by day for demo purposes using mock data logic */}
                                {shifts.map((shift, i) => {
                                    // Hacky demo logic: distribute shifts visually based on index to fill calendar
                                    if (i % 7 === idx) { 
                                        return (
                                            <div key={shift.id} className={`p-2 rounded-lg border-l-4 text-xs shadow-sm hover:shadow-md transition-all ${
                                                shift.staffRole === 'Doctor' ? 'bg-[#fffcf5] border-soft-gold' :
                                                shift.staffRole === 'Nurse' ? 'bg-[#fcfbff] border-lavender' :
                                                'bg-sage/5 border-sage'
                                            }`}>
                                                <div className="font-bold text-text-dark truncate">{shift.staffName}</div>
                                                <div className="text-text-muted flex items-center gap-1 mt-1">
                                                    <Clock size={10}/> {shift.startTime} - {shift.endTime}
                                                </div>
                                                <div className="text-text-muted flex items-center gap-1 mt-0.5">
                                                    <MapPin size={10}/> {shift.location}
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null;
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <StaffModal 
                isOpen={isStaffModalOpen} 
                onClose={() => { setIsStaffModalOpen(false); setEditingStaff(null); }}
                onSave={handleSaveStaff}
                staffToEdit={editingStaff}
            />
            <ShiftModal 
                isOpen={isShiftModalOpen}
                onClose={() => setIsShiftModalOpen(false)}
                onSave={handleSaveShift}
                staffList={staffList}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-medium text-text-dark">Staff & Shift Management</h1>
                    <p className="text-text-muted mt-1">Manage human resources and operational schedules.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsShiftModalOpen(true)}
                        className="bg-white border border-gray-200 text-text-dark px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-all"
                    >
                        <CalendarClock size={18} /> Schedule Shift
                    </button>
                    <button 
                        onClick={() => { setEditingStaff(null); setIsStaffModalOpen(true); }}
                        className="bg-soft-gold text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg hover:bg-[#cbad85] flex items-center gap-2 transition-all"
                    >
                        <Plus size={18} /> Add Staff
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab('staff')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'staff' ? 'border-soft-gold text-soft-gold' : 'border-transparent text-text-muted hover:text-text-dark'}`}
                >
                    <Users size={18}/> Staff Directory
                </button>
                <button 
                    onClick={() => setActiveTab('shifts')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'shifts' ? 'border-soft-gold text-soft-gold' : 'border-transparent text-text-muted hover:text-text-dark'}`}
                >
                    <CalendarClock size={18}/> Shift Schedule
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[500px]">
                {activeTab === 'staff' ? <StaffDirectoryView /> : <ShiftScheduleView />}
            </div>
        </div>
    );
};

export default StaffPage;