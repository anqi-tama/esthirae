
import React, { useState } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Search, 
  MoreHorizontal 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TODAY_APPOINTMENTS } from '../constants';
import { AppointmentStatus, Appointment } from '../types';

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock Date State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2023, 9, 24)); // Oct 24, 2023
  const formattedDate = selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Define Columns (Doctors) & Rows (Time Slots)
  const DOCTORS = ['Dr. Sarah', 'Dr. James', 'Dr. A. Wijaya'];
  const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  // Helper to find appointment for specific slot
  const getAppointment = (doctor: string, timePrefix: string) => {
    return TODAY_APPOINTMENTS.find(apt => {
      // Normalize time check (e.g., "10:00 AM" matches "10:00")
      const aptTime = apt.time.split(' ')[0]; // Get "10:00" from "10:00 AM"
      return apt.doctor === doctor && aptTime === timePrefix;
    });
  };

  const handleSlotClick = (doctor: string, time: string) => {
    // Navigate to new appointment page with prefilled query params
    navigate(`/agenda/new?doctor=${encodeURIComponent(doctor)}&time=${time}&date=${selectedDate.toISOString()}`);
  };

  const handleNewAppointmentClick = () => {
    navigate('/agenda/new');
  }

  const handleEditAppointment = (aptId: string) => {
    navigate(`/agenda/edit/${aptId}`);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-text-dark">Appointment Calendar</h1>
          <p className="text-text-muted mt-1">Manage schedules, rooms, and doctors.</p>
        </div>
        <div className="flex gap-3">
            <button className="bg-white text-text-dark border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Filter size={16}/> Filter
            </button>
            <button 
                onClick={handleNewAppointmentClick}
                className="bg-soft-gold text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg shadow-soft-gold/20 hover:bg-[#cbad85] flex items-center gap-2 transition-all"
            >
                <Plus size={18} /> New Appointment
            </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl shadow-soft flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left: View Switcher & Date Nav */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center bg-ivory rounded-lg p-1 border border-gray-100">
                <button className="px-4 py-1.5 rounded-md text-sm font-semibold bg-white shadow-sm text-text-dark border border-gray-100">Daily</button>
                <button className="px-4 py-1.5 rounded-md text-sm font-medium text-text-muted hover:text-text-dark transition-colors">Weekly</button>
                <button className="px-4 py-1.5 rounded-md text-sm font-medium text-text-muted hover:text-text-dark transition-colors">Monthly</button>
            </div>
            
            <div className="h-8 w-[1px] bg-gray-100 hidden md:block"></div>
            
            <div className="flex items-center gap-3">
                <button className="p-1.5 hover:bg-gray-50 rounded-full text-text-muted hover:text-text-dark transition-colors border border-transparent hover:border-gray-100">
                  <ChevronLeft size={20}/>
                </button>
                <span className="text-text-dark font-semibold min-w-[140px] text-center">{formattedDate}</span>
                <button className="p-1.5 hover:bg-gray-50 rounded-full text-text-muted hover:text-text-dark transition-colors border border-transparent hover:border-gray-100">
                  <ChevronRight size={20}/>
                </button>
            </div>
        </div>
        
        {/* Right: Search Input (Light Mode) */}
        <div className="relative w-full md:w-auto">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
            </div>
            <input 
                type="text" 
                placeholder="Search patient..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm w-full md:w-72 focus:outline-none focus:border-soft-gold focus:ring-2 focus:ring-soft-gold/10 text-text-dark placeholder-gray-400 shadow-sm transition-all"
            />
        </div>
      </div>

      {/* Daily Schedule Grid */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-50 min-h-[600px] flex flex-col">
        
        {/* Header Row (Doctors) */}
        <div className="grid grid-cols-4 border-b border-gray-100 bg-ivory/50">
            <div className="p-5 border-r border-gray-100 text-sm font-semibold text-text-muted uppercase tracking-wider">
              Time
            </div>
            {DOCTORS.map((doc, index) => (
               <div key={index} className="p-5 border-r border-gray-100 last:border-r-0 text-sm font-semibold text-text-dark flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-soft-gold' : index === 1 ? 'bg-lavender' : 'bg-sage'}`}></div>
                 {doc}
               </div>
            ))}
        </div>

        {/* Time Slots Rows */}
        <div className="divide-y divide-gray-50">
          {TIME_SLOTS.map((time) => (
             <div key={time} className="grid grid-cols-4 min-h-[120px]">
                {/* Time Column */}
                <div className="p-4 border-r border-gray-100 text-xs text-text-muted font-medium bg-ivory/20 flex flex-col justify-start pt-6">
                   {time}
                </div>
                
                {/* Doctor Columns */}
                {DOCTORS.map((doctor, colIndex) => {
                    const apt = getAppointment(doctor, time);

                    return (
                        <div 
                          key={`${time}-${colIndex}`} 
                          className="p-2 border-r border-gray-100 last:border-r-0 relative group transition-colors hover:bg-gray-50/50"
                        >
                            {/* Hover effect for empty slot - Click to Add */}
                            {!apt && (
                              <div 
                                onClick={() => handleSlotClick(doctor, time)}
                                className="absolute inset-0 m-2 rounded-lg border-2 border-dashed border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer hover:border-soft-gold/30 hover:bg-soft-gold/5"
                              >
                                <Plus size={20} className="text-soft-gold/50" />
                              </div>
                            )}

                            {apt && (
                                <div 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Stop bubbling to slot click
                                        handleEditAppointment(apt.id);
                                    }}
                                    className={`h-full p-3 rounded-xl border-l-4 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between ${
                                    apt.status === AppointmentStatus.IN_TREATMENT || apt.status === AppointmentStatus.CHECKED_IN ? 'bg-[#fffcf5] border-soft-gold' :
                                    apt.status === AppointmentStatus.CONFIRMED ? 'bg-[#fcfbff] border-lavender' :
                                    apt.status === AppointmentStatus.REQUESTED ? 'bg-gray-50 border-gray-300' :
                                    'bg-white border-gray-200'
                                }`}>
                                    <div>
                                      <div className="flex justify-between items-start mb-1">
                                          <span className="text-sm font-bold text-text-dark line-clamp-1" title={apt.patientName}>
                                            {apt.patientName}
                                          </span>
                                          {/* Status Dot */}
                                          <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                            apt.status === AppointmentStatus.IN_TREATMENT ? 'bg-soft-gold' :
                                            apt.status === AppointmentStatus.CONFIRMED ? 'bg-lavender' :
                                            apt.status === AppointmentStatus.CHECKED_IN ? 'bg-sage' :
                                            'bg-gray-300'
                                          }`}></div>
                                      </div>
                                      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                                        {apt.treatment}
                                      </p>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${
                                            apt.status === AppointmentStatus.IN_TREATMENT || apt.status === AppointmentStatus.CHECKED_IN ? 'bg-soft-gold/10 text-[#b5986a]' :
                                            apt.status === AppointmentStatus.CONFIRMED ? 'bg-lavender/20 text-[#8e85b8]' :
                                            apt.status === AppointmentStatus.REQUESTED ? 'bg-gray-200 text-gray-500' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                          {apt.status}
                                        </div>
                                        <button className="text-gray-300 hover:text-text-dark">
                                          <MoreHorizontal size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
