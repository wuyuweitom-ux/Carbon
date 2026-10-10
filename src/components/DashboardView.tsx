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
  Download,
  Check,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface DashboardViewProps {
  project: ProjectInfo;
  setProject: (p: ProjectInfo) => void;
  workflowSteps: WorkflowStep[];
  setWorkflowSteps: (steps: WorkflowStep[]) => void;
  activities: ActivityLog[];
  setActivities: (logs: ActivityLog[]) => void;
}

const DEMO_PROJECTS: ProjectInfo[] = [
  {
    id: 'TP-INFRA-2024-089A',
    name: '臺北市公共工程智慧碳管理示範計畫－信義線東延段工區',
    type: '大眾捷運與地下軌道結構工程',
    location: '臺北市信義區信義路六段至福德街延伸段',
    scaleSqm: 45000,
    status: 'In Progress',
    estimatedCo2: 11280,
    totalBudgetCo2: 13500,
  },
  {
    id: 'TP-RD-2026-014B',
    name: '士林區中正路人行環境改造及透水鋪面示範工程',
    type: '道路人行環境與透水鋪面營造工程',
    location: '臺北市士林區中正路文林路口至福林路段',
    scaleSqm: 8200,
    status: 'In Progress',
    estimatedCo2: 385,
    totalBudgetCo2: 450,
  },
  {
    id: 'TP-WTR-2026-033C',
    name: '基隆河右岸成美防洪牆結構耐震補強與機組改善工程',
    type: '水利水防護岸與抽水防洪工程',
    location: '臺北市內湖區成功橋至成美長壽抽水站段',
    scaleSqm: 16500,
    status: 'In Progress',
    estimatedCo2: 1420,
    totalBudgetCo2: 1600,
  },
];

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
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // 生命週期階段檢視切換 (A1-A3, A4, A5)
  const [selectedStage, setSelectedStage] = useState<'all' | 'A1-A3' | 'A4' | 'A5'>('all');

  // Stats calculation
  const budgetRatio = Math.round((project.estimatedCo2 / project.totalBudgetCo2) * 100);

  // SVG Gauge Calculations for the semi-circle gauge
  const radius = 60;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (budgetRatio / 100) * circumference;

  // 切換專案
  const handleSelectDemoProject = (proj: ProjectInfo) => {
    setProject(proj);
    setEditedName(proj.name);
    setEditedLocation(proj.location);
    setEditedScale(proj.scaleSqm);
    setEditedType(proj.type);
    setEditedEstimated(proj.estimatedCo2);
    setEditedBudget(proj.totalBudgetCo2);

    const switchLog: ActivityLog = {
      id: `act-${Date.now()}`,
      title: `切換當前監管工程標案`,
      subtitle: `已載入專案：${proj.name} (核定額度: ${proj.totalBudgetCo2.toLocaleString()} tCO2e)`,
      timeAgo: '剛剛',
      type: 'system',
    };
    setActivities([switchLog, ...activities]);
    setToastNotice(`已成功切換至專案「${proj.name}」！`);
    setTimeout(() => setToastNotice(null), 3500);
  };

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

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      title: `管理員修正專案基礎指標參數`,
      subtitle: `地點: ${editedLocation} | 總算力規模: ${editedScale} sqm | 預估碳排: ${editedEstimated} tCO2e`,
      timeAgo: '剛剛',
      type: 'edit',
    };
    setActivities([newActivity, ...activities]);
    setToastNotice('專案指標參數已成功儲存並重新校核碳額度！');
    setTimeout(() => setToastNotice(null), 3500);
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

    const changedStep = workflowSteps.find((s) => s.id === stepId);
    if (changedStep) {
      const stepLog: ActivityLog = {
        id: `act-${Date.now()}`,
        title: `推進盤查流程狀態`,
        subtitle: `步驟「${changedStep.name}」狀態更新完成`,
        timeAgo: '剛剛',
        type: 'edit',
      };
      setActivities([stepLog, ...activities]);
    }
  };

  // 匯出報表
  const handleExportDashboard = () => {
    const summaryData = {
      project,
      budgetRatio,
      generatedAt: new Date().toISOString(),
      workflowSteps,
      recentActivities: activities.slice(0, 5),
    };
    const blob = new Blob([JSON.stringify(summaryData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `臺北市工程碳盤查報告_${project.id}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastNotice(`已成功匯出專案「${project.name}」之碳盤查分析報告！`);
    setTimeout(() => setToastNotice(null), 4000);
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
            臺北市公共工程即時碳排數據與推動進度總覽 • 115年度智慧監管平台
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportDashboard}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>匯出盤查分析報告</span>
          </button>
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FolderDot className="w-4 h-4" />
            <span>調整盤查專案指標</span>
          </button>
        </div>
      </div>

      {toastNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* 標案快速切換器 (Project Switcher) */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>切換示範標案即時監管資料庫</span>
          </span>
          <span className="text-[11px] text-slate-500">點選即可無縫切換專案儀表數據</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {DEMO_PROJECTS.map((proj) => {
            const isSelected = proj.id === project.id;
            return (
              <button
                key={proj.id}
                onClick={() => handleSelectDemoProject(proj)}
                className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <span className="font-extrabold text-slate-900 block truncate">{proj.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">{proj.type}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-100 text-[10px]">
                  <span className="font-mono text-slate-400">{proj.id}</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {proj.estimatedCo2.toLocaleString()} / {proj.totalBudgetCo2.toLocaleString()} tCO₂e
                  </span>
                </div>
              </button>
            );
          })}
        </div>
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
              <span>盤查推動進度 (點擊狀態可推進)</span>
            </h2>

            {/* Stepper block */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between w-full relative gap-6 md:gap-2 px-4 py-2">
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-100 -translate-y-1/2 -z-10 hidden md:block rounded-full"></div>
              <div className="absolute top-1/2 left-4 w-2/3 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 -translate-y-1/2 -z-10 hidden md:block rounded-full"></div>

              {workflowSteps.map((step) => {
                const getStatusStyle = () => {
                  switch (step.status) {
                    case 'done':
                      return {
                        circle: 'bg-indigo-600 text-white border-2 border-indigo-600',
                        text: 'text-indigo-700 font-extrabold',
                        badge: '已完成',
                        badgeClass: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
                      };
                    case 'active':
                      return {
                        circle: 'bg-white text-indigo-600 border-2 border-indigo-600 ring-4 ring-indigo-50 shadow-md',
                        text: 'text-indigo-600 font-black',
                        badge: '進行中',
                        badgeClass: 'bg-indigo-600 text-white shadow-sm',
                      };
                    default:
                      return {
                        circle: 'bg-white text-slate-300 border-2 border-slate-200',
                        text: 'text-slate-400 font-bold',
                        badge: '待辦',
                        badgeClass: 'bg-slate-100 text-slate-500',
                      };
                  }
                };

                const style = getStatusStyle();

                return (
                  <button
                    key={step.id}
                    onClick={() => handleToggleWorkflowStep(step.id)}
                    className="flex flex-row md:flex-col items-center gap-3 text-left md:text-center group cursor-pointer bg-white"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-transform duration-200 group-hover:scale-110 ${style.circle}`}
                    >
                      {step.status === 'done' ? (
                        <CheckCircle2 className="w-4.5 h-4.5" />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>

                    <div>
                      <div className={`text-xs transition-colors ${style.text}`}>
                        {step.name}
                      </div>
                      <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold mt-1 ${style.badgeClass}`}>
                        {style.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 mt-6 flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>各階段均受市府政風與審計標準把關</span>
            <span className="text-indigo-600 font-bold">點擊節點可直接切換模擬進程</span>
          </div>
        </div>
      </div>

      {/* Row 2 Bento Grid: Total Carbon Budget & Matching Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 3: Carbon Budget Gauge (Spans 6 columns) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col justify-between transition-all hover:shadow-md duration-300">
          <div>
            <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-3 mb-4">
              <h2 className="text-slate-900 font-bold text-sm tracking-wide flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-indigo-600" />
                <span>本案碳排累計與生命週期額度</span>
              </h2>
              <span className="text-[10px] font-bold text-slate-400">總體監管配額</span>
            </div>

            {/* Gauge visualization */}
            <div className="flex flex-col items-center justify-center my-2">
              <div className="relative w-48 h-28 flex items-end justify-center">
                <svg className="w-48 h-48 -rotate-90 origin-center" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth={14}
                    strokeDasharray={circumference * 2}
                    strokeDashoffset={circumference}
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="#4f46e5"
                    strokeWidth={14}
                    strokeDasharray={circumference * 2}
                    strokeDashoffset={circumference + strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute bottom-1 flex flex-col items-center text-center">
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
                <p className="text-[9px] text-emerald-600 font-semibold mt-1">
                  控制目標內剩餘 {(100 - budgetRatio)}% 空間
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Detailed Mapped Items + Recent Activity timeline log (Spans 6 columns) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
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

              <div className="w-full bg-slate-100 rounded-full h-3.5 shadow-inner border border-slate-200 overflow-hidden mt-3">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow"
                  style={{ width: '83%' }}
                ></div>
              </div>
            </div>
          </div>

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
                          <div className="min-w-0 flex-1 pt-0.5">
                            <p className="text-xs font-bold text-slate-800">{log.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{log.subtitle}</p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                            {log.timeAgo}
                          </span>
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

      {/* Adjust Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 transition-opacity">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 text-left">
            <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <FolderDot className="w-4 h-4" />
                <span>調整專案盤查指標參數</span>
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded px-2 py-1 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  專案工程名稱
                </label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                    工程坐落地點
                  </label>
                  <input
                    type="text"
                    value={editedLocation}
                    onChange={(e) => setEditedLocation(e.target.value)}
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                    工程類別
                  </label>
                  <input
                    type="text"
                    value={editedType}
                    onChange={(e) => setEditedType(e.target.value)}
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                    開發規模 (m²)
                  </label>
                  <input
                    type="number"
                    value={editedScale}
                    onChange={(e) => setEditedScale(Number(e.target.value))}
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                    預估碳排 (tCO₂e)
                  </label>
                  <input
                    type="number"
                    value={editedEstimated}
                    onChange={(e) => setEditedEstimated(Number(e.target.value))}
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                    總核准額度 (tCO₂e)
                  </label>
                  <input
                    type="number"
                    value={editedBudget}
                    onChange={(e) => setEditedBudget(Number(e.target.value))}
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                儲存專案配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
