import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import KPICard from '../components/KPICard.tsx';
import { KPI, AppointmentStatus } from '../types.ts';
import { TODAY_APPOINTMENTS, DOCTOR_COMMISSION_DATA, TOP_REVENUE_TREATMENTS } from '../constants.ts';
import { DollarSign, TrendingUp } from 'lucide-react';

const KPIS: KPI[] = [
  { id: '1', label: 'Appointments Today', value: 22, color: 'gold', trend: '+12%', trendDirection: 'up' },
  { id: '2', label: 'Revenue Today', value: 'Rp 18.200.000', color: 'lavender', trend: '+5%', trendDirection: 'up' },
  { id: '3', label: 'Follow-ups', value: 5, color: 'sage', trend: 'On Track', trendDirection: 'neutral' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-medium text-text-dark">Good Morning, Dr. Wijaya ✨</h1>
          <p className="text-text-muted mt-1">Here is your clinic overview for today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {KPIS.map((kpi) => (
          <KPICard key={kpi.id} data={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-medium text-lg text-text-dark flex items-center gap-2">
                    <DollarSign size={20} className="text-sage" /> My Commission Estimation
                </h3>
                <p className="text-xs text-text-muted">Estimated earnings from performed treatments.</p>
              </div>
              <select className="bg-ivory border-none text-sm text-text-muted rounded-md px-3 py-1 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DOCTOR_COMMISSION_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9fc7b2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#9fc7b2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8a8a8a', fontSize: 12 }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8a8a8a', fontSize: 12 }} 
                    tickFormatter={(val) => `Rp ${(val/1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: '#9fc7b2' }}
                    formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#9fc7b2"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCommission)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-soft">
             <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-medium text-lg text-text-dark flex items-center gap-2">
                    <TrendingUp size={20} className="text-soft-gold"/> Top Revenue Sources
                </h3>
                <p className="text-xs text-text-muted">Highest grossing treatments performed.</p>
              </div>
            </div>
            <div className="space-y-5">
                {TOP_REVENUE_TREATMENTS.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-ivory text-xs font-bold text-text-muted border border-gray-200">
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-text-dark">{item.name}</div>
                                    <div className="text-xs text-text-muted">{item.count} performed</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-soft-gold">Rp {item.revenue.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-soft-gold to-[#c5a676] rounded-full"
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-soft h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium text-lg text-text-dark">Today's Schedule</h3>
              <button className="text-sm text-soft-gold hover:underline">View All</button>
            </div>
            
            <div className="space-y-0">
              {TODAY_APPOINTMENTS.map((apt, index) => {
                const isLast = index === TODAY_APPOINTMENTS.length - 1;
                return (
                  <div key={apt.id} className={`flex gap-4 py-4 ${!isLast ? 'border-b border-gray-50' : ''}`}>
                    <div className="flex-shrink-0">
                        <div className="text-xs font-semibold text-text-dark">{apt.time}</div>
                        <div className="text-[10px] text-text-muted mt-1 uppercase tracking-wide">
                            {parseInt(apt.time.split(':')[0]) < 12 ? 'AM' : 'PM'}
                        </div>
                    </div>
                    <div className="w-1 bg-ivory rounded-full"></div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-medium text-text-dark">{apt.patientName}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                apt.status === AppointmentStatus.IN_TREATMENT ? 'bg-soft-gold/20 text-soft-gold' :
                                apt.status === AppointmentStatus.CONFIRMED ? 'bg-lavender/30 text-[#8e85b8]' :
                                apt.status === AppointmentStatus.COMPLETED ? 'bg-sage/20 text-sage' : 
                                'bg-gray-100 text-gray-400'
                            }`}>
                                {apt.status}
                            </span>
                        </div>
                        <p className="text-sm text-text-muted mt-0.5">{apt.treatment}</p>
                        <div className="flex items-center gap-2 mt-2">
                             {apt.avatarUrl && <img src={apt.avatarUrl} alt="" className="w-5 h-5 rounded-full" />}
                             <span className="text-xs text-text-muted">with {apt.doctor}</span>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;