/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Sliders,
  Calculator,
  Grid,
} from 'lucide-react';
import { TabType } from './types';
import { MODULE_DEFINITIONS } from './constants/modules';
import {
  defaultProjectInfo,
  defaultWorkflowSteps,
  defaultActivityLogs,
  defaultAutomatedChecks,
  defaultBOMItems,
  defaultComments,
  defaultUnitGroups,
  defaultAuditLogs,
  defaultUserAccounts,
} from './data';

// Component imports
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import SopDeclarationView from './components/SopDeclarationView';
import UnitGroupsView from './components/UnitGroupsView';
import AuditLogsView from './components/AuditLogsView';
import UserManagementView from './components/UserManagementView';

// Extras imports
import {
  ImportMappingView,
  FastEstimationView,
  HotspotAnalysisView,
  RolePermissionsView,
  ProjectPlanView,
  SettingsView,
  SupportView,
} from './components/ExtraViews';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchWord, setSearchWord] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core application States holding original datasets to enable dynamic updates / creation
  const [project, setProject] = useState(defaultProjectInfo);
  const [workflowSteps, setWorkflowSteps] = useState(defaultWorkflowSteps);
  const [activities, setActivities] = useState(defaultActivityLogs);
  const [automatedChecks, setAutomatedChecks] = useState(defaultAutomatedChecks);
  const [bomItems, setBomItems] = useState(defaultBOMItems);
  const [comments, setComments] = useState(defaultComments);
  const [unitGroups, setUnitGroups] = useState(defaultUnitGroups);
  const [auditLogs, setAuditLogs] = useState(defaultAuditLogs);
  const [users, setUsers] = useState(defaultUserAccounts);

  // Unified Dialog Visibility State for creating user accounts
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Handle triggering add user modal from sidebar / users panel
  const handleOpenAddUser = () => {
    setActiveTab('user_management');
    setShowAddUserModal(true);
  };

  // Determine view to render based on selection
  const renderMainView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            project={project}
            setProject={setProject}
            workflowSteps={workflowSteps}
            setWorkflowSteps={setWorkflowSteps}
            activities={activities}
            setActivities={setActivities}
          />
        );
      case 'sop_declaration':
        return (
          <SopDeclarationView
            bomItems={bomItems}
            setBomItems={setBomItems}
            comments={comments}
            setComments={setComments}
            automatedChecks={automatedChecks}
            setAutomatedChecks={setAutomatedChecks}
          />
        );
      case 'unit_groups':
        return (
          <UnitGroupsView
            unitGroups={unitGroups}
            setUnitGroups={setUnitGroups}
          />
        );
      case 'audit_logs':
        return (
          <AuditLogsView
            auditLogs={auditLogs}
            setAuditLogs={setAuditLogs}
          />
        );
      case 'user_management':
        return (
          <UserManagementView
            users={users}
            setUsers={setUsers}
            showAddUserModal={showAddUserModal}
            setShowAddUserModal={setShowAddUserModal}
          />
        );
      case 'import_mapping':
        return (
          <ImportMappingView
            searchQuery={searchWord}
            bomItems={bomItems}
            setBomItems={setBomItems}
            auditLogs={auditLogs}
            setAuditLogs={setAuditLogs}
            onNavigateToSop={() => setActiveTab('sop_declaration')}
          />
        );
      case 'fast_estimation':
        return <FastEstimationView />;
      case 'hotspot_analysis':
        return <HotspotAnalysisView />;
      case 'role_permissions':
        return <RolePermissionsView />;
      case 'project_plan':
        return <ProjectPlanView />;
      case 'settings':
        return <SettingsView />;
      case 'support':
        return <SupportView />;
      default:
        return (
          <div className="flex items-center justify-center h-full p-8 text-slate-400 font-bold">
            請點擊左側選單切換模組頁面
          </div>
        );
    }
  };

  // 統一各功能模組標題與分類顯示
  const currentModule = MODULE_DEFINITIONS[activeTab] || MODULE_DEFINITIONS.dashboard;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50/80 font-sans text-slate-800 antialiased selection:bg-[#00356a] selection:text-white">
      {/* Sidebar - Desktop & Mobile Drawer */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddUser={handleOpenAddUser}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Panel Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:pl-76">
        {/* Header - Consolidated dynamic alignment with unified Chinese names */}
        <Header
          title={currentModule.name}
          categoryLabel={currentModule.categoryLabel}
          searchWord={searchWord}
          setSearchWord={setSearchWord}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Dashboard Main Workspace area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 pb-24 lg:pb-8 space-y-6 sm:space-y-8 bg-slate-50 focus:outline-none">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderMainView()}
          </div>
        </main>

        {/* Mobile Bottom Quick-Navigation Bar */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1.5 py-1.5 z-30 flex items-center justify-around shadow-[0_-4px_12px_rgba(0,0,0,0.05)] select-none"
          aria-label="行動版快速導覽"
        >
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-indigo-600 font-extrabold bg-indigo-50/70 scale-105'
                : 'text-slate-500 hover:text-indigo-600 font-medium'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>儀表板</span>
          </button>

          <button
            onClick={() => setActiveTab('import_mapping')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] transition-all cursor-pointer ${
              activeTab === 'import_mapping'
                ? 'text-indigo-600 font-extrabold bg-indigo-50/70 scale-105'
                : 'text-slate-500 hover:text-indigo-600 font-medium'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 mb-0.5" />
            <span>PCCES媒合</span>
          </button>

          <button
            onClick={() => setActiveTab('sop_declaration')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] transition-all cursor-pointer ${
              activeTab === 'sop_declaration'
                ? 'text-indigo-600 font-extrabold bg-indigo-50/70 scale-105'
                : 'text-slate-500 hover:text-indigo-600 font-medium'
            }`}
          >
            <Sliders className="w-4 h-4 mb-0.5" />
            <span>SOP填報</span>
          </button>

          <button
            onClick={() => setActiveTab('fast_estimation')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] transition-all cursor-pointer ${
              activeTab === 'fast_estimation'
                ? 'text-indigo-600 font-extrabold bg-indigo-50/70 scale-105'
                : 'text-slate-500 hover:text-indigo-600 font-medium'
            }`}
          >
            <Calculator className="w-4 h-4 mb-0.5" />
            <span>快速估算</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] text-slate-600 hover:text-indigo-600 font-medium transition-all cursor-pointer active:scale-95"
            title="查看全部 12 項系統功能模組"
          >
            <Grid className="w-4 h-4 mb-0.5 text-indigo-500" />
            <span>全部模組</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
