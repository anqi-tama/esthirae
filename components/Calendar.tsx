import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Hardcoded for October 2023 for demo consistency
  const currentMonth = "October 2023";
  const daysInMonth = 31;
  const startDayOffset = 0; // October 1st 2023 is Sunday

  // Mock data generator for visual density
  const getMockAppointments = (day: number) => {
    // Deterministic random-like based on day number
    if (day % 7 === 0) return 0; // Sunday off
    if (day === 24) return 5; // Selected day (busy)
    return (day * 13) % 4; // Returns 0-3 appointments
  };

  const renderDays = () => {
    const days = [];
    
    // Padding for start of month
    for (let i = 0; i < startDayOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-ivory/30 border border-gray-50"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day;
      const isToday = day === 24; // Mock today
      const apptCount = getMockAppointments(day);

      days.push(
        <div 
          key={day} 
          onClick={() => {
             const newDate = new Date(2023, 9, day);
             onDateSelect(newDate);
          }}
          className={`h-24 border border-gray-50 p-2 cursor-pointer transition-all duration-200 relative group
            ${isSelected ? 'bg-white ring-2 ring-soft-gold z-10' : 'bg-white hover:bg-gray-50'}
          `}
        >
          {/* Day Number */}
          <div className="flex justify-between items-start">
            <span className={`
              text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
              ${isToday ? 'bg-soft-gold text-white shadow-md' : 'text-text-dark'}
            `}>
              {day}
            </span>
            {apptCount > 0 && (
                <span className="text-[10px] text-text-muted font-medium">{apptCount} appts</span>
            )}
          </div>

          {/* Visual Indicators (Dots) */}
          <div className="mt-2 flex flex-wrap gap-1 content-end">
            {Array.from({ length: Math.min(apptCount, 4) }).map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-soft-gold' : 'bg-lavender'}`}
              ></div>
            ))}
            {apptCount > 4 && <span className="text-[10px] text-text-muted">+</span>}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden animate-fade-in">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-text-dark">{currentMonth}</h2>
          <div className="flex gap-1">
            <button className="p-1 rounded-full hover:bg-gray-100 text-text-muted transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="p-1 rounded-full hover:bg-gray-100 text-text-muted transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
            <span className="flex items-center gap-2 text-xs text-text-muted">
                <span className="w-2 h-2 rounded-full bg-soft-gold"></span> Treatment
            </span>
            <span className="flex items-center gap-2 text-xs text-text-muted">
                <span className="w-2 h-2 rounded-full bg-lavender"></span> Consult
            </span>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 bg-ivory border-b border-gray-100">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-text-muted uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 bg-gray-50/50">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
