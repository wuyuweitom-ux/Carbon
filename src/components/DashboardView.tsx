/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ProjectInfo, WorkflowStep, ActivityLog } from '../types';
import { generateCarbonReportPDF } from '../utils/pdfGenerator';
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
  FileDown,
  Eye,
  Loader2,
  FileText,
  Printer,
  ShieldCheck,
  X,
  Gauge,
  PieChart,
  BarChart2,
  AlertTriangle,
  Sparkles,
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

  // 圖形化百分比示意圖顯示模式：'gauge' (環形儀表盤) | 'lifecycle' (生命週期各階段配額切分) | 'waterfall' (配額水位階梯比較)
  const [gaugeViewMode, setGaugeViewMode] = useState<'gauge' | 'lifecycle' | 'waterfall'>('gauge');

  // Stats calculation
  const budgetRatio = Math.round((project.estimatedCo2 / project.totalBudgetCo2) * 100);

  // 配額警戒狀態判定
  const quotaStatus = budgetRatio <= 80
    ? {
        label: '低碳合規優等',
        badge: '● 符合 2050 淨零路徑',
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        strokeColor: '#10b981',
      }
    : budgetRatio <= 95
    ? {
        label: '接近監管配額',
        badge: '● 需加強工區材料管控',
        textColor: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        strokeColor: '#f59e0b',
      }
    : {
        label: '⚠️ 超出監管配額',
        badge: '● 需啟動減碳抵換備案',
        textColor: 'text-rose-700',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        strokeColor: '#ef4444',
      };

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

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showReportPreviewModal, setShowReportPreviewModal] = useState(false);

  // 匯出結構化碳盤查 PDF 報告 (包含當前專案之關鍵指標、生命週期分布、減碳效益與公務審定紀錄)
  const handleExportCarbonReport = async () => {
    setIsExportingPdf(true);
    try {
      const { filename, download } = await generateCarbonReportPDF({
        project,
        budgetRatio,
        workflowSteps,
        activities,
      });
      download();

      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        title: `匯出專案碳盤查正式 PDF 審定報告書`,
        subtitle: `已成功產製並下載檔案《${filename}》`,
        timeAgo: '剛剛',
        type: 'download',
      };
      setActivities([newLog, ...activities]);
      setToastNotice(`已成功產製並下載專案「${project.name}」之結構化碳盤查 PDF 報告書！`);
      setTimeout(() => setToastNotice(null), 4500);
    } catch (err) {
      console.error('PDF generation error:', err);
      setToastNotice('產製 PDF 報告時發生異常，請重試。');
      setTimeout(() => setToastNotice(null), 3500);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // 匯出 JSON 原始數據
  const handleExportDashboardJson = () => {
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
    a.download = `臺北市工程碳盤查數據_${project.id}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastNotice(`已成功匯出專案「${project.name}」之原始盤查 JSON 數據！`);
    setTimeout(() => setToastNotice(null), 3500);
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
        <div className="flex flex-wrap items-center gap-2">
          {/* 匯出碳盤查報告 (PDF) 主功能按鈕 */}
          <button
            onClick={handleExportCarbonReport}
            disabled={isExportingPdf}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:bg-indigo-400 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            title="點擊模擬下載包含當前專案各項關鍵數據之結構化 PDF 報告"
          >
            {isExportingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            <span>{isExportingPdf ? '正在產製 PDF 報告...' : '匯出碳盤查報告'}</span>
          </button>

          {/* 預覽報告視窗按鈕 */}
          <button
            onClick={() => setShowReportPreviewModal(true)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            title="開啟結構化碳盤查審定報告書預覽"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>預覽報告</span>
          </button>

          {/* 調整指標按鈕 */}
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FolderDot className="w-4 h-4 text-indigo-600" />
            <span>調整盤查指標</span>
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
        {/* Card 3: 本案碳排累計與生命週期額度 - 總體監管配額 (Spans 6 columns) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6 flex flex-col justify-between transition-all hover:shadow-md duration-300">
          <div>
            {/* Card Header with View Switcher Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                    <span>本案碳排累計與生命週期額度</span>
                  </h2>
                  <span className="text-[10px] text-slate-400 font-bold block">總體監管配額監控</span>
                </div>
              </div>

              {/* 圖形化百分比顯示模式切換按鈕 */}
              <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-[10px] font-bold self-start sm:self-auto">
                <button
                  onClick={() => setGaugeViewMode('gauge')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    gaugeViewMode === 'gauge'
                      ? 'bg-white text-indigo-700 shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="環形儀表盤百分比圖示"
                >
                  <Gauge className="w-3 h-3" />
                  <span>環形儀表</span>
                </button>
                <button
                  onClick={() => setGaugeViewMode('lifecycle')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    gaugeViewMode === 'lifecycle'
                      ? 'bg-white text-indigo-700 shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="生命週期階段配額拆解"
                >
                  <PieChart className="w-3 h-3" />
                  <span>生命週期</span>
                </button>
                <button
                  onClick={() => setGaugeViewMode('waterfall')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    gaugeViewMode === 'waterfall'
                      ? 'bg-white text-indigo-700 shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="監管配額與水位階梯比較"
                >
                  <BarChart2 className="w-3 h-3" />
                  <span>配額階梯</span>
                </button>
              </div>
            </div>

            {/* 1. 環形儀表盤模式 (Gauge View) */}
            {gaugeViewMode === 'gauge' && (
              <div className="flex flex-col items-center justify-center py-2 animate-fade-in">
                <div className="relative w-64 h-36 flex items-end justify-center">
                  <svg className="w-64 h-36" viewBox="0 0 240 135">
                    <defs>
                      <linearGradient id="budgetGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="75%" stopColor="#6366f1" />
                        <stop offset="90%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                      <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
                      </filter>
                    </defs>

                    {/* 底軌灰線 (0% - 100%) */}
                    <path
                      d="M 35 115 A 85 85 0 0 1 205 115"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />

                    {/* 80% 淨零標竿線背景標記 */}
                    <path
                      d="M 35 115 A 85 85 0 0 1 205 115"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="16"
                      strokeDasharray="267.04"
                      strokeDashoffset="53.4"
                      strokeLinecap="round"
                    />

                    {/* 彩色動態百分比進度弧線 */}
                    <path
                      d="M 35 115 A 85 85 0 0 1 205 115"
                      fill="none"
                      stroke={budgetRatio > 100 ? '#ef4444' : 'url(#budgetGaugeGradient)'}
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray="267.04"
                      strokeDashoffset={267.04 * (1 - Math.min(budgetRatio, 100) / 100)}
                      className="transition-all duration-1000 ease-out"
                    />

                    {/* 80% 標竿目標虛線指針 */}
                    <line
                      x1={120 - 85 * Math.cos(Math.PI * 0.20)}
                      y1={115 - 85 * Math.sin(Math.PI * 0.20)}
                      x2={120 - 101 * Math.cos(Math.PI * 0.20)}
                      y2={115 - 101 * Math.sin(Math.PI * 0.20)}
                      stroke="#059669"
                      strokeWidth="2.5"
                      strokeDasharray="2 2"
                    />

                    {/* 當前百分比圓點指針 */}
                    <circle
                      cx={120 - 85 * Math.cos(Math.PI * (1 - Math.min(budgetRatio, 100) / 100))}
                      cy={115 - 85 * Math.sin(Math.PI * (1 - Math.min(budgetRatio, 100) / 100))}
                      r="6.5"
                      fill="#ffffff"
                      stroke={quotaStatus.strokeColor}
                      strokeWidth="3.5"
                      filter="url(#gaugeShadow)"
                      className="transition-all duration-1000 ease-out"
                    />

                    {/* 刻度文字 */}
                    <text x="32" y="132" fontSize="10" fill="#94a3b8" fontWeight="bold">0%</text>
                    <text x="120" y="22" fontSize="10" fill="#94a3b8" fontWeight="bold" textAnchor="middle">50%</text>
                    <text x="176" y="52" fontSize="9" fill="#059669" fontWeight="bold" textAnchor="start">80% 標竿</text>
                    <text x="208" y="132" fontSize="10" fill="#ef4444" fontWeight="bold" textAnchor="end">100%</text>
                  </svg>

                  {/* 儀表中央百分比數值卡 */}
                  <div className="absolute bottom-0 flex flex-col items-center text-center">
                    <span className="text-4xl font-black tracking-tight text-slate-800 leading-none font-mono">
                      {budgetRatio}%
                    </span>
                    <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full border mt-1.5 shadow-2xs ${quotaStatus.bgColor} ${quotaStatus.textColor} ${quotaStatus.borderColor}`}>
                      {quotaStatus.badge}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 font-semibold mt-3 text-center">
                  已消耗 <span className="font-mono font-bold text-slate-800">{project.estimatedCo2.toLocaleString()}</span> / 法定配額 <span className="font-mono font-bold text-slate-800">{project.totalBudgetCo2.toLocaleString()}</span> tCO₂e
                </p>
              </div>
            )}

            {/* 2. 生命週期階段拆解模式 (Lifecycle View) */}
            {gaugeViewMode === 'lifecycle' && (
              <div className="space-y-3.5 py-1 animate-fade-in">
                {/* 階段百分比長條堆疊圖 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 mb-1.5">
                    <span>各生命週期階段佔本案碳排比例</span>
                    <span className="font-mono text-indigo-700">合計 100% ({project.estimatedCo2.toLocaleString()} tCO₂e)</span>
                  </div>
                  <div className="h-5 w-full bg-slate-100 rounded-lg overflow-hidden flex shadow-inner border border-slate-200">
                    <div style={{ width: '72%' }} className="bg-indigo-600 h-full flex items-center justify-center text-[10px] font-extrabold text-white" title="A1-A3: 72.0%">
                      A1-A3 (72%)
                    </div>
                    <div style={{ width: '8%' }} className="bg-cyan-500 h-full flex items-center justify-center text-[9px] font-extrabold text-white" title="A4: 8.0%">
                      A4
                    </div>
                    <div style={{ width: '20%' }} className="bg-amber-500 h-full flex items-center justify-center text-[10px] font-extrabold text-white" title="A5: 20.0%">
                      A5 (20%)
                    </div>
                  </div>
                </div>

                {/* 3 大階段配額詳細卡片 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 bg-indigo-50/60 border border-indigo-100 rounded-lg text-left">
                    <span className="text-[10px] font-extrabold text-indigo-700 block">A1-A3 建材製造</span>
                    <span className="text-base font-mono font-black text-slate-900 block mt-0.5">
                      {Math.round(project.estimatedCo2 * 0.72).toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-500 block">配額佔比 72.0% (混凝土/鋼筋)</span>
                  </div>
                  <div className="p-2.5 bg-cyan-50/60 border border-cyan-100 rounded-lg text-left">
                    <span className="text-[10px] font-extrabold text-cyan-700 block">A4 建材運輸</span>
                    <span className="text-base font-mono font-black text-slate-900 block mt-0.5">
                      {Math.round(project.estimatedCo2 * 0.08).toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-500 block">配額佔比 8.0% (預拌車/砂石車)</span>
                  </div>
                  <div className="p-2.5 bg-amber-50/60 border border-amber-100 rounded-lg text-left">
                    <span className="text-[10px] font-extrabold text-amber-700 block">A5 現場施工</span>
                    <span className="text-base font-mono font-black text-slate-900 block mt-0.5">
                      {Math.round(project.estimatedCo2 * 0.20).toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-500 block">配額佔比 20.0% (怪手/吊車柴油)</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. 配額水位階梯比較模式 (Waterfall / Level View) */}
            {gaugeViewMode === 'waterfall' && (
              <div className="space-y-3 py-1 animate-fade-in text-xs">
                {/* 100% 總體監管配額基準 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      法定監管配額上限 (100%)
                    </span>
                    <span className="font-mono font-extrabold text-slate-800">{project.totalBudgetCo2.toLocaleString()} tCO₂e</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div className="bg-slate-500 h-full w-full"></div>
                  </div>
                </div>

                {/* 當前專案累計碳排 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-indigo-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      本案累計預估碳排 ({budgetRatio}%)
                    </span>
                    <span className="font-mono font-extrabold text-indigo-600">{project.estimatedCo2.toLocaleString()} tCO₂e</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        budgetRatio <= 80
                          ? 'bg-gradient-to-r from-emerald-500 to-indigo-600'
                          : budgetRatio <= 95
                          ? 'bg-gradient-to-r from-indigo-500 to-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(budgetRatio, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* 剩餘減碳餘裕水位 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-emerald-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      剩餘減碳餘裕空間 ({Math.max(0, 100 - budgetRatio)}%)
                    </span>
                    <span className="font-mono font-extrabold text-emerald-700">
                      {Math.max(0, project.totalBudgetCo2 - project.estimatedCo2).toLocaleString()} tCO₂e
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(0, 100 - budgetRatio)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom 3 Detailed Metrics Tiles */}
            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3.5 mt-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
              <div className="text-left border-r border-slate-200/80 pr-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">專案累計碳排</span>
                <span className="text-xs sm:text-sm font-mono font-extrabold text-indigo-700 mt-0.5 block">
                  {project.estimatedCo2.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-500 font-semibold block">佔配額 {budgetRatio}%</span>
              </div>
              <div className="text-center border-r border-slate-200/80 px-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">總體監管配額</span>
                <span className="text-xs sm:text-sm font-mono font-extrabold text-slate-800 mt-0.5 block">
                  {project.totalBudgetCo2.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-500 font-semibold block">法定基準 100%</span>
              </div>
              <div className="text-right pl-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">剩餘減碳空間</span>
                <span className="text-xs sm:text-sm font-mono font-extrabold text-emerald-600 mt-0.5 block">
                  {Math.max(0, project.totalBudgetCo2 - project.estimatedCo2).toLocaleString()}
                </span>
                <span className="text-[9px] text-emerald-600 font-bold block">
                  餘裕 {Math.max(0, 100 - budgetRatio)}%
                </span>
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

      {/* 結構化碳盤查正式審定報告書預覽 Modal (Report Preview Modal) */}
      {showReportPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    公共工程施工階段碳盤查正式審定報告書 (預覽)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    文件編號：TP-CARB-115-{project.id} • 依法定格式即時核算產製
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCarbonReport}
                  disabled={isExportingPdf}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  title="下載完整排版之 A4 PDF 正式報告"
                >
                  {isExportingPdf ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5" />
                  )}
                  <span>下載 PDF 報告</span>
                </button>
                <button
                  onClick={() => setShowReportPreviewModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="關閉預覽"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable A4 Document Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-slate-800 bg-white">
              {/* Official Banner */}
              <div className="border-b-2 border-slate-900 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                      <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">
                        臺北市政府工務局 • 公共工程碳管理雲端平台
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      公共工程施工階段碳盤查正式審定報告書
                    </h2>
                    <p className="text-xs text-slate-500">
                      依據《臺北市淨零排放管理自治條例》及國家 2050 淨零路徑規範產製存查
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black rounded-full shadow-xs">
                      ● 審核通過 (正式存查)
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      查核基準：民國115年度
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. 專案基本資料 */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>一、專案工程基本資料</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold">標案名稱：</span>
                    <span className="font-extrabold text-slate-800 block">{project.name}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold">管考編號：</span>
                    <span className="font-mono font-bold text-slate-800 block">{project.id}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold">工程類別：</span>
                    <span className="font-extrabold text-slate-800 block">{project.type}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold">施工位置：</span>
                    <span className="font-bold text-slate-800 block">{project.location}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold">核算規模：</span>
                    <span className="font-extrabold text-slate-800 block">
                      {project.scaleSqm.toLocaleString()} 平方公尺 (m²)
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold">主管機關：</span>
                    <span className="font-bold text-slate-800 block">臺北市政府工務局 管理科</span>
                  </div>
                </div>
              </div>

              {/* 2. 關鍵碳指標 */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>二、關鍵碳排放核算指標</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-[11px] font-bold text-blue-800 block">預估碳排總量</span>
                    <span className="text-xl font-black text-blue-900 font-mono mt-1 block">
                      {project.estimatedCo2.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-blue-600">tCO₂e (全階段)</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[11px] font-bold text-slate-700 block">核定預算上限</span>
                    <span className="text-xl font-black text-slate-900 font-mono mt-1 block">
                      {project.totalBudgetCo2.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500">tCO₂e (市府核定)</span>
                  </div>
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[11px] font-bold text-emerald-800 block">碳預算使用率</span>
                    <span className="text-xl font-black text-emerald-900 font-mono mt-1 block">
                      {budgetRatio}%
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      {budgetRatio <= 100 ? '✓ 符合目標未超標' : '⚠️ 已超出上限'}
                    </span>
                  </div>
                  <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <span className="text-[11px] font-bold text-indigo-800 block">累計減碳效益</span>
                    <span className="text-xl font-black text-indigo-900 font-mono mt-1 block">
                      -{(project.totalBudgetCo2 - project.estimatedCo2).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-indigo-600">
                      tCO₂e (減碳率 {(((project.totalBudgetCo2 - project.estimatedCo2) / project.totalBudgetCo2) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. 生命週期分布 (A1-A5) */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>三、生命週期各階段碳排結構</span>
                </h4>
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                    <div style={{ width: '72%' }} className="bg-indigo-600 h-full" title="A1-A3: 72%"></div>
                    <div style={{ width: '8%' }} className="bg-cyan-500 h-full" title="A4: 8%"></div>
                    <div style={{ width: '20%' }} className="bg-amber-500 h-full" title="A5: 20%"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                      <span className="font-bold text-indigo-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        A1-A3 建材生產 (72.0%)
                      </span>
                      <p className="font-mono font-black text-slate-900 mt-1 text-sm">
                        {Math.round(project.estimatedCo2 * 0.72).toLocaleString()} tCO₂e
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">預拌混凝土、高爐水泥、再生鋼筋</p>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                      <span className="font-bold text-cyan-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                        A4 建材運輸 (8.0%)
                      </span>
                      <p className="font-mono font-black text-slate-900 mt-1 text-sm">
                        {Math.round(project.estimatedCo2 * 0.08).toLocaleString()} tCO₂e
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">預拌車、大貨車運輸柴油消耗</p>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                      <span className="font-bold text-amber-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        A5 現場施工 (20.0%)
                      </span>
                      <p className="font-mono font-black text-slate-900 mt-1 text-sm">
                        {Math.round(project.estimatedCo2 * 0.20).toLocaleString()} tCO₂e
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">挖掘機、吊車、工區夜間照明</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. 減碳熱點成效 */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>四、關鍵工項減碳措施效益清冊</span>
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">工項名稱 / 策略</th>
                        <th className="py-2.5 px-3">適用階段</th>
                        <th className="py-2.5 px-3">排放係數基準</th>
                        <th className="py-2.5 px-3 text-right">減排效益</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          採用高爐水泥/飛灰低碳配比混凝土 (4000psi)
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">A1-A3 材料製造</td>
                        <td className="py-2.5 px-3 text-slate-500">環境部 EPD 245 kgCO₂e/m³</td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-emerald-600">
                          -18.5%
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          綠色鋼筋循環材料與精準下料施工計畫
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">A1-A3 材料製造</td>
                        <td className="py-2.5 px-3 text-slate-500">內政部建材係數 1.82 kgCO₂e/kg</td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-emerald-600">
                          -12.0%
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          施工機具怠速管理與電動化設備導入
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">A5 現場施工</td>
                        <td className="py-2.5 px-3 text-slate-500">工程施工柴油燃燒排放標準</td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-emerald-600">
                          -9.4%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. 審核簽章與公務審定印鑑 */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>五、多角色審核簽核紀錄與主管印章</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold block">設計單位 (申報)</span>
                    <span className="font-extrabold text-slate-800 mt-1 block">宏國聯合建築師事務所</span>
                    <span className="text-[10px] font-bold text-blue-600 mt-1 block">✓ 係數媒合核定</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold block">施工廠商 (填報)</span>
                    <span className="font-extrabold text-slate-800 mt-1 block">達欣工程營造股份公司</span>
                    <span className="text-[10px] font-bold text-emerald-600 mt-1 block">✓ 數量填報完成</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold block">監造單位 (審查)</span>
                    <span className="font-extrabold text-slate-800 mt-1 block">台灣世曦工程顧問</span>
                    <span className="text-[10px] font-bold text-emerald-600 mt-1 block">✓ 現場抽驗無誤</span>
                  </div>
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl relative overflow-hidden">
                    <span className="text-[10px] text-indigo-700 font-bold block">工務局管理科 (定審)</span>
                    <span className="font-extrabold text-slate-900 mt-1 block">林科長 審定核可</span>
                    <span className="text-[10px] font-bold text-indigo-700 mt-1 block">✓ 正式備查通過</span>
                    {/* 印鑑章視覺 */}
                    <div className="mt-2 py-1 px-2 border-2 border-red-600 text-red-600 text-[10px] font-black rounded text-center rotate-[-3deg] select-none">
                      臺北市工務局 審查合格
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Disclaimer */}
              <div className="text-[11px] text-slate-400 border-t border-slate-200 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>數位防偽校驗碼：SHA256-{project.id}-VERIFIED-115TAIPEI</span>
                <span>臺北市政府工務局 版權所有 • 依法令規定本報告存查 5 年</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                點擊下載將匯出一份完整 A4 尺寸之結構化正式 PDF 報告文件
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportDashboardJson}
                  className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  匯出 JSON 數據
                </button>
                <button
                  onClick={handleExportCarbonReport}
                  disabled={isExportingPdf}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isExportingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileDown className="w-4 h-4" />
                  )}
                  <span>立即下載正式 PDF 報告</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
