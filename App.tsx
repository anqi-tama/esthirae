
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import AppointmentFormPage from './pages/AppointmentFormPage'; // New Page
import Patients from './pages/Patients';
import Treatments from './pages/Treatments';
import Cashier from './pages/Cashier';
import RetailSales from './pages/RetailSales';
import Inventory from './pages/Inventory';
import Procedures from './pages/Procedures'; 
import CRM from './pages/CRM';
import LoyaltyProgram from './pages/LoyaltyProgram'; // New Page
import PromotionEngine from './pages/PromotionEngine'; // New Page
import StaffPage from './pages/Staff';
import Reports from './pages/Reports';
import PackageMaster from './pages/PackageMaster';
import QueueInfoPage from './pages/QueueInfoPage'; // Import new page
import QueueMonitor from './pages/QueueMonitor'; // Import Queue Monitor
import QueueTVPage from './pages/QueueTVPage'; // Import TV Page
import Settings from './pages/Settings'; // New Settings Page

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
        {/* Public Routes (No Sidebar) */}
        <Route path="/queue/:id" element={<QueueInfoPage />} />
        <Route path="/queue-tv" element={<QueueTVPage />} />

        {/* Protected Routes (With Sidebar Layout) */}
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
              
              {/* Split POS Routes */}
              <Route path="/cashier" element={<Cashier />} />
              <Route path="/sales" element={<RetailSales />} />
              
              {/* Split Inventory Routes - Pointing to specific views in Inventory Component */}
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
