import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Appointments from './pages/Appointments.tsx';
import AppointmentFormPage from './pages/AppointmentFormPage.tsx';
import Patients from './pages/Patients.tsx';
import Treatments from './pages/Treatments.tsx';
import Cashier from './pages/Cashier.tsx';
import RetailSales from './pages/RetailSales.tsx';
import Inventory from './pages/Inventory.tsx';
import Procedures from './pages/Procedures.tsx'; 
import CRM from './pages/CRM.tsx';
import LoyaltyProgram from './pages/LoyaltyProgram.tsx';
import PromotionEngine from './pages/PromotionEngine.tsx';
import StaffPage from './pages/Staff.tsx';
import Reports from './pages/Reports.tsx';
import PackageMaster from './pages/PackageMaster.tsx';
import QueueInfoPage from './pages/QueueInfoPage.tsx';
import QueueMonitor from './pages/QueueMonitor.tsx';
import QueueTVPage from './pages/QueueTVPage.tsx';
import Settings from './pages/Settings.tsx';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-ivory font-sans">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main 
        className={`flex-1 p-8 lg:p-12 overflow-x-hidden transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/queue/:id" element={<QueueInfoPage />} />
        <Route path="/queue-tv" element={<QueueTVPage />} />

        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agenda" element={<Appointments />} />
              <Route path="/agenda/new" element={<AppointmentFormPage />} />
              <Route path="/agenda/edit/:id" element={<AppointmentFormPage />} />
              <Route path="/queue-monitor" element={<QueueMonitor />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/treatments" element={<Treatments />} />
              <Route path="/cashier" element={<Cashier />} />
              <Route path="/sales" element={<RetailSales />} />
              <Route path="/inventory" element={<Inventory view="catalog" />} />
              <Route path="/stock" element={<Inventory view="stock" />} />
              <Route path="/purchasing" element={<Inventory view="purchasing" />} />
              <Route path="/opname" element={<Inventory view="opname" />} />
              <Route path="/logs" element={<Inventory view="logs" />} />
              <Route path="/services" element={<Procedures />} /> 
              <Route path="/packages" element={<PackageMaster />} />
              <Route path="/crm" element={<CRM />} />
              <Route path="/loyalty" element={<LoyaltyProgram />} />
              <Route path="/promotions" element={<PromotionEngine />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;