
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { MENU_GROUPS } from '../constants';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white shadow-soft flex flex-col z-50 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Logo & Toggle */}
      <div className={`flex items-center justify-between p-6 ${isCollapsed ? 'flex-col gap-4 px-2' : ''}`}>
        <div className={`transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
          <h1 className="text-2xl font-semibold tracking-wide text-soft-gold">
            Esthirae
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-text-muted mt-1 whitespace-nowrap">
            Aesthetic Intelligence
          </p>
        </div>
        
        {/* Collapsed Logo Variant */}
        {isCollapsed && (
           <div className="w-10 h-10 bg-soft-gold rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl">
             E
           </div>
        )}

        <button 
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-6 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {MENU_GROUPS.map((group, index) => (
          <div key={index}>
            {/* Group Label - Only visible when expanded */}
            {group.label && group.label !== 'Main' && !isCollapsed && (
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-4 mt-2 fade-in">
                {group.label}
              </h3>
            )}
            {/* Group Separator for Collapsed Mode */}
            {group.label && group.label !== 'Main' && isCollapsed && (
               <div className="h-px w-8 bg-gray-100 mx-auto my-3"></div>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    title={isCollapsed ? item.label : ''}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group ${
                      isActive
                        ? 'bg-soft-gold/10 text-text-dark'
                        : 'text-text-muted hover:bg-gray-50 hover:text-text-dark'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <item.icon
                      size={20}
                      className={`transition-colors duration-200 min-w-[20px] ${
                        isActive ? 'text-soft-gold' : 'text-gray-400 group-hover:text-soft-gold'
                      }`}
                    />
                    {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User / Footer */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <img
            src="https://picsum.photos/id/64/100/100"
            alt="User"
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
          />
          {!isCollapsed && (
            <div className="overflow-hidden">
                <p className="text-sm font-semibold text-text-dark truncate">Dr. A. Wijaya</p>
                <p className="text-xs text-text-muted truncate">Head Doctor</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
