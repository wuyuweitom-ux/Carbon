/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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
        return <ImportMappingView searchQuery={searchWord} />;
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
      {/* Sidebar - Unified Layout Alignments */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddUser={handleOpenAddUser}
      />

      {/* Main Panel Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:pl-76">
        {/* Header - Consolidated dynamic alignment with unified Chinese names */}
        <Header
          title={currentModule.name}
          categoryLabel={currentModule.categoryLabel}
          searchWord={searchWord}
          setSearchWord={setSearchWord}
        />

        {/* Dashboard Main Workspace area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-8 bg-slate-50 focus:outline-none">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderMainView()}
          </div>
        </main>
      </div>
    </div>
  );
}
