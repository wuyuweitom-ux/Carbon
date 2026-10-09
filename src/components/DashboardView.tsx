/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ProjectInfo, WorkflowStep, ActivityLog } from '../types';
import {
  Building2,
  Milestone,
  Activity,
  History,
  TrendingDown,
  CheckCircle2,
  FolderDot,
  UploadCloud,
  FileCheck2,
  MapPin,
  Maximize2,
  CalendarDays,
  PlusCircle,
} from 'lucide-react';

interface DashboardViewProps {
  project: ProjectInfo;
  setProject: (p: ProjectInfo) => void;
  workflowSteps: WorkflowStep[];
  setWorkflowSteps: (steps: WorkflowStep[]) => void;
  activities: ActivityLog[];
  setActivities: (logs: ActivityLog[]) => void;
}

export default function DashboardView({
  project,
  setProject,
  workflowSteps,
  setWorkflowSteps,
  activities,
  setActivities,
}: DashboardViewProps) {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editedName, setEditedName] = useState(project.name);
  const [editedLocation, setEditedLocation] = useState(project.location);
  const [editedScale, setEditedScale] = useState(project.scaleSqm);
  const [editedEstimated, setEditedEstimated] = useState(project.estimatedCo2);
  const [editedBudget, setEditedBudget] = useState(project.totalBudgetCo2);
  const [editedType, setEditedType] = useState(project.type);

  // Stats calculation
  const budgetRatio = Math.round((project.estimatedCo2 / project.totalBudgetCo2) * 100);

  // SVG Gauge Calculations for the semi-circle gauge
  const radius = 60;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Semi-circle circumference
  const strokeDashoffset = circumference - (budgetRatio / 100) * circumference;

  // Handle saving the modified Project Configuration
  const handleSaveConfig = () => {
    setProject({
      ...project,
      name: editedName,
      location: editedLocation,
      scaleSqm: editedScale,
      type: editedType,
      estimatedCo2: editedEstimated,
      totalBudgetCo2: editedBudget,
    });
    setShowConfigModal(false);

    // Push standard action to Activity logs
    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      title: `管理員修正專案基礎指標參數`,
      subtitle: `地點: ${editedLocation} | 總算力規模: ${editedScale} sqm | 預估碳排: ${editedEstimated} tCO2e`,
      timeAgo: '剛剛',
      type: 'edit',
    };
    setActivities([newActivity, ...activities]);
  };

  // Toggle state of stepper workflow items
  const handleToggleWorkflowStep = (stepId: number) => {
    const updated = workflowSteps.map((s) => {
      if (s.id === stepId) {
        let nextStatus: 'done' | 'active' | 'pending' = 'pending';
        if (s.status === 'pending') nextStatus = 'active';
        else if (s.status === 'active') nextStatus = 'done';
        else nextStatus = 'pending';
        return { ...s, status: nextStatus };
      }
      return s;
    });
    setWorkflowSteps(updated);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Platform Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            工程碳盤查儀表板
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1.5 tracking-wider">
            臺北市公共工程即時碳排數據與推動進度總覽
          </p>
        </div>
        <button
          onClick={() => setShowConfigModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
        >
          <FolderDot className="w-4 h-4" />
          <span>調整盤查專案指標</span>
        </button>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Project Info (Spans 4 columns) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col justify-between transition-all hover:shadow-md duration-300">
          <div>
            <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-4 mb-4">
              <h2 className="text-slate-900 font-bold text-sm tracking-wide flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>專案基礎資訊</span>
              </h2>
              <span className="px-2.5 py-1 bg-slate-50 text-indigo-600 text-[10px] font-bold rounded-md tracking-wider border border-slate-100">
                專案編號: {project.id}
              </span>
            </div>

            {/* Title / Description */}
            <div className="mb-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">專案名稱</span>
              <p className="text-xs font-extrabold text-slate-800 mt-0.5 leading-snug">
                {project.name}
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                  工程類別
                </span>
                <span className="text-xs font-extrabold text-slate-800">
                  {project.type}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  工程坐落地點
                </span>
                <span className="text-xs font-extrabold text-slate-800">
                  {project.location}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                  基地開發規模
                </span>
                <span className="text-xs font-mono font-bold text-slate-800">
                  {project.scaleSqm.toLocaleString()} 平方公尺 (m²)
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-semibold">盤查監控狀態</span>
            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-extrabold tracking-wider shadow-sm animate-pulse border border-indigo-100">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-600 border border-white"></span>
              申報盤查中
            </span>
          </div>
        </div>

        {/* Card 2: Inventory Progress Step tracker (Spans 8 columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col justify-between transition-all hover:shadow-md duration-300">
          <div>
            <h2 className="text-slate-900 font-bold text-sm tracking-wide flex items-center gap-2 border-b border-dashed border-slate-200 pb-4 mb-6">
              <Milestone className="w-4 h-4 text-indigo-600" />
              <span>盤查推動進度 (點擊狀態可切換)</span>
            </h2>

            {/* Stepper block */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between w-full relative gap-6 md:gap-2 px-4 py-2">
              {/* Connected background progress line */}
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-100 -translate-y-1/2 -z-10 hidden md:block rounded-full"></div>
              <div className="absolute top-1/2 left-4 w-2/3 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 -translate-y-1/2 -z-10 hidden md:block rounded-full"></div>

              {workflowSteps.map((step) => {
                const getStatusStyle = () => {
                  switch (step.status) {
                    case 'done':
                      return {
                        circle: 'bg-indigo-600 text-white border-2 border-indigo-600',
                        label: 'text-indigo-700 font-bold',
                        badge: '已完備',
                        badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
                      };
                    case 'active':
                      return {
                        circle: 'bg-indigo-50 border-2 border-indigo-600 text-indigo-600 animate-bounce',
                        label: 'text-indigo-700 font-extrabold ring-1 ring-offset-2 ring-indigo-200 rounded-md px-1.5 py-0.5',
                        badge: '盤查中',
                        badgeColor: 'bg-amber-50 text-amber-700 border border-amber-100',
                      };
                    default:
                      return {
                        circle: 'bg-slate-50 border-2 border-slate-200 text-slate-400',
                        label: 'text-slate-400 font-semibold',
                        badge: '待啟動',
                        badgeColor: 'bg-slate-100 text-slate-500',
                      };
                  }
                };

                const style = getStatusStyle();

                return (
                  <button
                    key={step.id}
                    onClick={() => handleToggleWorkflowStep(step.id)}
                    className="flex flex-row md:flex-col items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm md:shadow-none border border-slate-100 md:border-0 hover:bg-slate-50/50 transition-all text-left md:text-center shrink-0 cursor-pointer focus:outline-none"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-extrabold text-sm shadow-inner transition-all shrink-0 ${style.circle}`}>
                      {step.status === 'done' ? '✓' : step.id}
                    </div>
                    <div className="flex flex-col md:items-center">
                      <span className={`text-[13px] tracking-tight ${style.label}`}>
                        {step.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium tracking-wide mt-0.5">
                        {step.enName === 'Project Reg' ? '第 1 階段' : step.enName === 'Data Import' ? '第 2 階段' : step.enName === 'NLP Matching' ? '第 3 階段' : '第 4 階段'}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1.5 leading-none ${style.badgeColor}`}>
                        {style.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-xl p-3.5 mt-6 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
            <p className="text-xs text-slate-600 font-bold leading-relaxed">
              系統配對進度已達後盤期。現已完成 <span className="text-indigo-700 underline">85 項</span> 碳排項目審定解算，剩餘 17 項特規混凝土配比須由稽核委員手動審核。
            </p>
          </div>
        </div>

        {/* Card 3: Dashboard Circular Gauge representation (Spans 6 columns) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col justify-between transition-all hover:shadow-md duration-300">
          <div>
            <h2 className="text-slate-900 font-bold text-sm tracking-wide flex items-center gap-2 border-b border-dashed border-slate-200 pb-4 mb-4">
              <TrendingDown className="w-4 h-4 text-indigo-600" />
              <span>本案碳排累計與生命週期額度</span>
            </h2>

            {/* Beautiful SVG Arc Circular Gauge wrapper */}
            <div className="flex flex-col items-center justify-center p-4 relative">
              <div className="relative w-56 h-32 flex justify-center">
                <svg className="w-56 h-56 transform rotate-180 origin-center" viewBox="0 0 160 160">
                  {/* Gray background arc track */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    className="transform rotate-180 origin-center"
                  />
                  {/* Foreground progress arc indicator */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="#4f46e5"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out-quad"
                  />
                </svg>

                {/* Internal percentage text details */}
                <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold tracking-tight text-slate-800 leading-none">
                    {budgetRatio}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    額度已消耗比例
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom detailed legend metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-2 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
              <div className="text-left border-r border-slate-150 pr-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">專案預估排碳量</span>
                <span className="text-base font-mono font-extrabold text-indigo-600">
                  {project.estimatedCo2.toLocaleString()} tCO₂e
                </span>
                <p className="text-[9px] text-slate-400 mt-1">符合臺北市第 2 級標準預測係數</p>
              </div>
              <div className="text-right pl-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">核准總體碳排額度</span>
                <span className="text-base font-mono font-extrabold text-slate-700">
                  {project.totalBudgetCo2.toLocaleString()} tCO₂e
                </span>
                <p className="text-[9px] text-emerald-600 font-semibold mt-1">控制目標內剩餘 28% 空間</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Detailed Mapped Items + Recent Activity timeline log (Spans 6 columns) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Top segment: Mapped Item Bar Progress */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col justify-between transition-all hover:shadow-md duration-300">
            <div>
              <h2 className="text-slate-900 font-bold text-sm tracking-wide flex items-center gap-2 border-b border-dashed border-slate-200 pb-3 mb-4">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>申報材料智慧配對進度</span>
              </h2>

              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-extrabold text-slate-800 tracking-tight leading-none">
                  85
                </span>
                <span className="text-lg font-bold text-slate-400 tracking-wide">
                  / 102 項材料
                </span>
                <span className="ml-auto text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                  完成度 83%
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-slate-100 rounded-full h-3.5 shadow-inner border border-slate-200 overflow-hidden mt-3">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow"
                  style={{ width: '83%' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Bottom segment: Recent System and User Activity logs */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex-1 transition-all hover:shadow-md duration-300">
            <h2 className="text-slate-900 font-bold text-sm tracking-wide flex items-center gap-2 border-b border-dashed border-slate-200 pb-4 mb-4">
              <History className="w-4 h-4 text-indigo-600" />
              <span>稽核與申報軌跡紀錄</span>
            </h2>

            <div className="flow-root mt-1">
              <ul className="-mb-8">
                {activities.slice(0, 3).map((log, idx) => {
                  const getIconColor = () => {
                    switch (log.type) {
                      case 'nlp':
                        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
                      case 'upload':
                        return 'bg-indigo-50 text-indigo-600 border border-indigo-150';
                      case 'edit':
                        return 'bg-amber-50 text-amber-700 border border-amber-200';
                      default:
                        return 'bg-slate-50 text-slate-600 border border-slate-200';
                    }
                  };

                  return (
                    <li key={log.id}>
                      <div className="relative pb-6">
                        {idx !== 2 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100"
                            aria-hidden="true"
                          ></span>
                        )}
                        <div className="relative flex space-x-3 text-left">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${getIconColor()}`}>
                              {log.type === 'nlp' && <CheckCircle2 className="w-4 h-4" />}
                              {log.type === 'upload' && <UploadCloud className="w-4 h-4" />}
                              {log.type === 'edit' && <FileCheck2 className="w-4 h-4" />}
                              {log.type === 'system' && <History className="w-4 h-4" />}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5">
                            <p className="text-xs font-bold text-slate-800 leading-snug">
                              {log.title}
                            </p>
                            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                              {log.subtitle}
                            </p>
                          </div>
                          <div className="text-right text-[10px] whitespace-nowrap text-slate-400 font-mono font-medium pt-1.5 pr-1">
                            {log.timeAgo}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Indicator modal dialogue settings */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 transition-opacity">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 text-left">
            <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <FolderDot className="w-4 h-4" />
                <span>盤查專案基礎參數設定</span>
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded px-2 py-1 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                  專案名稱
                </label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    工程坐落地點
                  </label>
                  <input
                    type="text"
                    value={editedLocation}
                    onChange={(e) => setEditedLocation(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    工程類別
                  </label>
                  <input
                    type="text"
                    value={editedType}
                    onChange={(e) => setEditedType(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    基地規模 (m²)
                  </label>
                  <input
                    type="number"
                    value={editedScale}
                    onChange={(e) => setEditedScale(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    預估排碳量 (tCO₂e)
                  </label>
                  <input
                    type="number"
                    value={editedEstimated}
                    onChange={(e) => setEditedEstimated(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    核准總額度 (tCO₂e)
                  </label>
                  <input
                    type="number"
                    value={editedBudget}
                    onChange={(e) => setEditedBudget(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer font-sans"
              >
                儲存指標設定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
