import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import GlobalFilterBar from './components/GlobalFilterBar';
import DemoGuideBar from './components/DemoGuideBar';
import EmployeeProfileModal from './components/EmployeeProfileModal';

// Pages
import Overview from './pages/Overview';
import Employees from './pages/Employees';
import Analytics from './pages/Analytics';
import FlightRisk from './pages/FlightRisk';
import SkillIntelligence from './pages/SkillIntelligence';
import TalentMatrix from './pages/TalentMatrix';
import HRCopilot from './pages/HRCopilot';
import HRAlerts from './pages/HRAlerts';
import WhatIfSimulator from './pages/WhatIfSimulator';
import FinancialCost from './pages/FinancialCost';
import Reports from './pages/Reports';

const initialFilters = {
  dateRange: 'Q3 2026',
  department: 'All',
  location: 'All',
  jobRole: 'All',
  experience: 'All',
};

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState(initialFilters);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const resetFilters = () => setFilters(initialFilters);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onSelectEmployee={(emp) => setSelectedEmployee(emp)} />;
      case 'employees':
        return <Employees onSelectEmployee={(emp) => setSelectedEmployee(emp)} />;
      case 'analytics':
        return <Analytics />;
      case 'flight-risk':
        return <FlightRisk onSelectEmployee={(emp) => setSelectedEmployee(emp)} />;
      case 'skills':
        return <SkillIntelligence />;
      case 'talent-matrix':
        return <TalentMatrix onSelectEmployee={(emp) => setSelectedEmployee(emp)} />;
      case 'copilot':
        return <HRCopilot />;
      case 'alerts':
        return <HRAlerts />;
      case 'simulator':
        return <WhatIfSimulator />;
      case 'financials':
        return <FinancialCost />;
      case 'reports':
        return <Reports />;
      default:
        return <Overview onSelectEmployee={(emp) => setSelectedEmployee(emp)} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header Navbar */}
        <Navbar
          activeTab={activeTab}
          isDemoMode={isDemoMode}
          setIsDemoMode={setIsDemoMode}
        />

        {/* Global Filter Bar & Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <GlobalFilterBar
            filters={filters}
            setFilters={setFilters}
            onReset={resetFilters}
          />

          {renderContent()}
        </main>
      </div>

      {/* Floating Presentation Guided Demo Mode Bar */}
      {isDemoMode && (
        <DemoGuideBar
          currentStep={demoStep}
          setCurrentStep={setDemoStep}
          setActiveTab={setActiveTab}
          onClose={() => setIsDemoMode(false)}
        />
      )}

      {/* Employee Intelligence Profile Modal Drawer */}
      {selectedEmployee && (
        <EmployeeProfileModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

export default App;
