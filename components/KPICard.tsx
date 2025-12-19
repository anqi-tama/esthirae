import React from 'react';
import { KPI } from '../types.ts';

interface KPICardProps {
  data: KPI;
}

const KPICard: React.FC<KPICardProps> = ({ data }) => {
  const borderClass =
    data.color === 'gold'
      ? 'border-t-soft-gold'
      : data.color === 'lavender'
      ? 'border-t-lavender'
      : 'border-t-sage';

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-soft border-t-4 ${borderClass} hover:shadow-lg transition-shadow duration-300`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-text-muted font-medium uppercase tracking-wide">
          {data.label}
        </span>
        {data.trend && (
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              data.trendDirection === 'up'
                ? 'bg-sage/10 text-sage'
                : 'bg-rose/10 text-rose'
            }`}
          >
            {data.trend}
          </span>
        )}
      </div>
      <h2 className="text-3xl font-semibold text-text-dark mt-2">{data.value}</h2>
      <div className="h-8 w-full mt-4 opacity-30">
        <svg viewBox="0 0 100 20" className="w-full h-full fill-none stroke-current" style={{ color: data.color === 'gold' ? '#d6b98c' : data.color === 'lavender' ? '#c7c3e3' : '#9fc7b2'}}>
           <path d="M0 15 Q 10 5, 20 12 T 40 8 T 60 14 T 80 5 T 100 10" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

export default KPICard;