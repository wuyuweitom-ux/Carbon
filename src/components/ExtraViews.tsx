/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Database,
  FileSpreadsheet,
  Flame,
  AlertOctagon,
  Sliders,
  CheckCircle2,
  Download,
  Shield,
  HelpCircle,
  FileText,
  Phone,
  Calculator,
  BarChart3,
  TrendingUp,
  Building,
  CheckSquare,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Coins,
  Calendar,
  Layers,
  UploadCloud,
  Search,
  Check,
  X,
  Filter,
  UserCheck,
  Play,
  ArrowUpRight,
  Zap,
  Eye,
  Save,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
} from 'lucide-react';
import { MODULE_DEFINITIONS } from '../constants/modules';
import {
  defaultEstimationModels,
  defaultBudgetExecution,
  defaultPilotProjects,
} from '../data';
import { CustomBOMItem, AuditLogItem } from '../types';

interface ExtraProps {
  searchQuery: string;
  bomItems?: CustomBOMItem[];
  setBomItems?: (items: CustomBOMItem[]) => void;
  auditLogs?: AuditLogItem[];
  setAuditLogs?: (logs: AuditLogItem[]) => void;
  onNavigateToSop?: () => void;
}

interface MatchedPccesItem {
  id: string;
  pccesCode: string;
  name: string;
  unit: string;
  quantity: number;
  matchedFactor: string;
  factorCode: string;
  efValue: number;
  confidence: number;
  method: '規則式精確命中' | '關鍵字同義詞' | 'AI 深度語意分析';
  source: string;
  selected: boolean;
  status: 'matched' | 'manual';
}

const SAMPLE_PCCES_TEMPLATES = [
  {
    id: 't-1',
    name: '115_臺北市士林區中正路人行環境改造工程.xml',
    agency: '新工處',
    itemCount: 18,
    amount: '4,850,000 元',
    items: [
      { id: 'p-1', pccesCode: '02742-01', name: '透水性高壓混凝土地磚 (20x10x6cm)', unit: 'm²', quantity: 4500, matchedFactor: '高壓混凝土地磚 (環境部代碼: EF-TILE-01)', factorCode: 'EF-TILE-01', efValue: 28.5, confidence: 99, method: '規則式精確命中' as const, source: '環境部係數庫 v6.0', selected: true, status: 'matched' as const },
      { id: 'p-2', pccesCode: '03050-02', name: '預拌混凝土 210 kgf/cm² (底層打底用)', unit: 'm³', quantity: 420, matchedFactor: '預拌混凝土 210kgf/cm² (內政部建研所代碼: ABRI-CON-210)', factorCode: 'ABRI-CON-210', efValue: 265.0, confidence: 96, method: '規則式精確命中' as const, source: '內政部建研所碳足跡庫', selected: true, status: 'matched' as const },
      { id: 'p-3', pccesCode: '02315-05', name: '碎石級配底層 (厚度15cm滾壓夯實)', unit: 'm³', quantity: 850, matchedFactor: '碎石級配粒料底層 (公共工程常用材料庫)', factorCode: 'PCC-AGG-03', efValue: 14.2, confidence: 94, method: '關鍵字同義詞' as const, source: '工務局常用工程材料庫', selected: true, status: 'matched' as const },
      { id: 'p-4', pccesCode: '02771-01', name: '花崗石緣石 (15x20x100cm 車道邊石)', unit: 'm', quantity: 2200, matchedFactor: '天然花崗岩加工石材 (環境部代碼: EF-STONE-GR)', factorCode: 'EF-STONE-GR', efValue: 18.4, confidence: 91, method: 'AI 深度語意分析' as const, source: '環境部係數庫 v6.0', selected: true, status: 'matched' as const },
      { id: 'p-5', pccesCode: '02745-03', name: '無障礙導盲點字導引磚 (黃色抗滑)', unit: 'm²', quantity: 380, matchedFactor: '複合樹脂及陶瓷導盲磚 (建研所代碼: ABRI-TACT-02)', factorCode: 'ABRI-TACT-02', efValue: 24.0, confidence: 89, method: 'AI 深度語意分析' as const, source: '內政部建研所碳足跡庫', selected: true, status: 'matched' as const },
      { id: 'p-6', pccesCode: '02920-04', name: '路樹樹穴鑄鐵保護格柵及透水側板', unit: '組', quantity: 120, matchedFactor: '球狀石墨鑄鐵製品 (環境部代碼: EF-IRON-DUCT)', factorCode: 'EF-IRON-DUCT', efValue: 45.0, confidence: 87, method: 'AI 深度語意分析' as const, source: '環境部係數庫 v6.0', selected: true, status: 'matched' as const },
    ],
  },
  {
    id: 't-2',
    name: '115_捷運信義線東延段廣慈博愛段地下結構工程.xml',
    agency: '捷運局',
    itemCount: 24,
    amount: '68,200,000 元',
    items: [
      { id: 'p-21', pccesCode: '03310-01', name: '預拌混凝土 280 kgf/cm² (結構抗裂防水)', unit: 'm³', quantity: 18500, matchedFactor: '卜特蘭一型結構預拌混凝土 280kgf/cm²', factorCode: 'EF-CON-280', efValue: 320.0, confidence: 98, method: '規則式精確命中' as const, source: '環境部係數庫 v6.0', selected: true, status: 'matched' as const },
      { id: 'p-22', pccesCode: '03210-02', name: '熱軋竹節鋼筋 SD420W (高耐震級)', unit: 't', quantity: 920, matchedFactor: '鋼筋 (電爐煉鋼/高爐結合平均值)', factorCode: 'EF-STEEL-REBAR', efValue: 1850.0, confidence: 97, method: '規則式精確命中' as const, source: '環境部係數庫 v6.0', selected: true, status: 'matched' as const },
      { id: 'p-23', pccesCode: '02316-01', name: '連續壁導溝開挖與皂土泥漿穩定液', unit: 'm³', quantity: 6800, matchedFactor: '地下連續壁特殊土石方開挖作業', factorCode: 'PCC-EXC-DIAPH', efValue: 18.5, confidence: 88, method: 'AI 深度語意分析' as const, source: '工務局常用工程材料庫', selected: true, status: 'matched' as const },
      { id: 'p-24', pccesCode: '03110-01', name: '系統化鋼模板與大面積支撐排架', unit: 'm²', quantity: 32000, matchedFactor: '工程用金屬模板週轉分攤碳排', factorCode: 'ABRI-FORMWK-ST', efValue: 12.8, confidence: 92, method: '關鍵字同義詞' as const, source: '內政部建研所碳足跡庫', selected: true, status: 'matched' as const },
    ],
  },
  {
    id: 't-3',
    name: '115_基隆河右岸成美防洪牆結構耐震補強工程.xml',
    agency: '水利處',
    itemCount: 15,
    amount: '12,400,000 元',
    items: [
      { id: 'p-31', pccesCode: '03315-02', name: '高耐久抗滲自充填混凝土 SCC 350kgf/cm²', unit: 'm³', quantity: 5200, matchedFactor: '自充填高強度水利混凝土 (環境部代碼: EF-SCC-350)', factorCode: 'EF-SCC-350', efValue: 335.0, confidence: 95, method: '規則式精確命中' as const, source: '環境部係數庫 v6.0', selected: true, status: 'matched' as const },
      { id: 'p-32', pccesCode: '02458-01', name: '鍍鋅防蝕鋼板樁圍堰 (Type IV型 12m長)', unit: 't', quantity: 310, matchedFactor: '熱軋冷彎防蝕塗裝型鋼 (環境部代碼: EF-PILE-ST)', factorCode: 'EF-PILE-ST', efValue: 1920.0, confidence: 93, method: '關鍵字同義詞' as const, source: '環境部係數庫 v6.0', selected: true, status: 'matched' as const },
      { id: 'p-33', pccesCode: '02373-03', name: '拋石護岸天然塊石 (粒徑 30~50cm)', unit: 'm³', quantity: 6500, matchedFactor: '天然河道護岸防淘刷塊石 (工務局材料庫)', factorCode: 'PCC-RIPRAP-01', efValue: 11.2, confidence: 90, method: 'AI 深度語意分析' as const, source: '工務局常用工程材料庫', selected: true, status: 'matched' as const },
    ],
  },
];

/**
 * PCCES 數據智慧配對模組 (完整互動式模擬)
 */
export function ImportMappingView({
  searchQuery: _searchQuery,
  bomItems,
  setBomItems,
  auditLogs,
  setAuditLogs,
  onNavigateToSop,
}: ExtraProps) {
  const meta = MODULE_DEFINITIONS.import_mapping;
  const [selectedTemplateId, setSelectedTemplateId] = useState('t-1');
  const [threshold, setThreshold] = useState(85);
  const [candidateCount, setCandidateCount] = useState(3);
  const [isMatching, setIsMatching] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(100);
  const [matchedItems, setMatchedItems] = useState<MatchedPccesItem[]>(SAMPLE_PCCES_TEMPLATES[0].items);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // NLP 即時測試沙盒狀態
  const [sandboxText, setSandboxText] = useState('卜特蘭高爐低碳混凝土 280kgf/cm2');
  const [sandboxResult, setSandboxResult] = useState<{
    code: string;
    factorName: string;
    ef: number;
    unit: string;
    score: number;
    source: string;
  } | null>(null);
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);

  // 切換範本
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = SAMPLE_PCCES_TEMPLATES.find((t) => t.id === templateId) || SAMPLE_PCCES_TEMPLATES[0];
    setMatchedItems(tmpl.items);
    setSyncNotice(null);
  };

  // 模擬執行 AI 語意配對運算
  const handleRunAiMatching = () => {
    setIsMatching(true);
    setMatchingProgress(15);

    const step1 = setTimeout(() => setMatchingProgress(48), 350);
    const step2 = setTimeout(() => setMatchingProgress(82), 700);
    const step3 = setTimeout(() => {
      setMatchingProgress(100);
      setIsMatching(false);
      // 隨機微調信心度展示動態變化
      setMatchedItems((prev) =>
        prev.map((item) => ({
          ...item,
          confidence: Math.min(99, Math.max(threshold, item.confidence + (Math.random() > 0.5 ? 1 : -1))),
        }))
      );
      setSyncNotice('AI 三模態語意媒合分析已全部完成！規則命中率 50%、關鍵字 25%、語意分析 25%。');
      setTimeout(() => setSyncNotice(null), 6000);
    }, 1100);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  // 勾選/取消全選
  const handleToggleSelectAll = (checked: boolean) => {
    setMatchedItems((prev) => prev.map((item) => ({ ...item, selected: checked })));
  };

  const handleToggleItem = (id: string) => {
    setMatchedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  // 批次確認入庫並同步至 BOM 清冊
  const handleBatchSyncToBOM = () => {
    const selected = matchedItems.filter((i) => i.selected);
    if (selected.length === 0) {
      alert('請至少勾選一項欲入庫之工項！');
      return;
    }

    if (setBomItems && bomItems) {
      const newBoms: CustomBOMItem[] = selected.map((item) => {
        const total = Math.round(item.quantity * item.efValue);
        return {
          id: `bom-${Date.now()}-${item.pccesCode}`,
          code: item.pccesCode,
          description: item.name,
          quantity: `${item.quantity.toLocaleString()} ${item.unit}`,
          efValue: item.efValue,
          totalKgCo2: total,
          status: total > 2000000 ? 'high_emission' : 'standard',
        };
      });

      // 避免重複編碼覆蓋，併入 BOM
      const existingCodes = new Set(bomItems.map((b) => b.code));
      const filteredNew = newBoms.filter((b) => !existingCodes.has(b.code));
      setBomItems([...bomItems, ...(filteredNew.length > 0 ? filteredNew : newBoms)]);
    }

    if (setAuditLogs && auditLogs) {
      const newLog: AuditLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        operator: '林技正 (設計單位審核)',
        userId: 'USR-8821',
        department: '工程設計顧問 / 碳管理專案組',
        action: `PCCES 批次解析入庫：成功媒合入庫 ${selected.length} 筆工程材料係數至 BOM 清冊`,
        ip: '192.168.1.108',
        success: true,
      };
      setAuditLogs([newLog, ...auditLogs]);
    }

    setSyncNotice(`成功將 ${selected.length} 筆 PCCES 工項配對入庫並同步至「數位申報與審查 BOM 清冊」！`);
  };

  // 執行 NLP 係數庫沙盒測試
  const handleTestSandbox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxText.trim()) return;

    setIsSandboxRunning(true);
    setTimeout(() => {
      setIsSandboxRunning(false);
      setSandboxResult({
        code: 'EF-TW-CON-LOWC',
        factorName: '低碳高爐水淬預拌混凝土 (高爐熟料替代率35%)',
        ef: 242.0,
        unit: 'kgCO₂e/m³',
        score: 95.8,
        source: '環境部事業溫室氣體排放係數庫 v6.0',
      });
    }, 700);
  };

  const currentTemplate = SAMPLE_PCCES_TEMPLATES.find((t) => t.id === selectedTemplateId) || SAMPLE_PCCES_TEMPLATES[0];
  const selectedCount = matchedItems.filter((i) => i.selected).length;

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 標題列 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {meta.name}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1.5 tracking-wider">
            {meta.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRunAiMatching}
            disabled={isMatching}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isMatching ? 'animate-spin' : ''}`} />
            <span>{isMatching ? 'AI 語意媒合分析中...' : '啟動 AI 語意媒合運算'}</span>
          </button>
        </div>
      </div>

      {syncNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>{syncNotice}</span>
          </div>
          {onNavigateToSop && (
            <button
              onClick={onNavigateToSop}
              className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700 cursor-pointer shrink-0"
            >
              前往申報清冊檢視 →
            </button>
          )}
        </div>
      )}

      {/* 頂部設定與檔案載入 Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左側：預算書來源切換 */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-600" />
              <span>PCCES 預算書批次匯入解析來源</span>
            </h3>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              XML / Excel 格式相容
            </span>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
              選擇或切換載入之市府示範工程預算書
            </label>
            <div className="grid grid-cols-1 gap-2">
              {SAMPLE_PCCES_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer flex justify-between items-center ${
                    selectedTemplateId === tmpl.id
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="font-extrabold text-slate-800 block">{tmpl.name}</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      主辦機關：{tmpl.agency} • 預算總額：{tmpl.amount} • {tmpl.itemCount} 項材料工料
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedTemplateId === tmpl.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {selectedTemplateId === tmpl.id ? '已載入' : '切換'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 右側：AI 媒合演算法參數 */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-indigo-600" />
              <span>AI 智慧語意媒合引擎運算參數</span>
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              三模態引擎運作中
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  配對信心門檻值 (Confidence Threshold)
                </label>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs">
                  {threshold}% 門檻
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="98"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                低於 {threshold}% 之工項將自動標記為待人工複查，高於門檻可自動配對入庫。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  推薦候補係數項數
                </label>
                <select
                  value={candidateCount}
                  onChange={(e) => setCandidateCount(Number(e.target.value))}
                  className="w-full h-9 border border-slate-200 bg-white text-xs font-semibold rounded-lg px-2.5"
                >
                  <option value={3}>推薦前 3 筆高相關係數</option>
                  <option value={5}>推薦前 5 筆高相關係數</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  優先比對資料庫源
                </label>
                <select className="w-full h-9 border border-slate-200 bg-white text-xs font-semibold rounded-lg px-2.5">
                  <option>環境部事業碳排係數庫 v6.0</option>
                  <option>內政部建研所公共工程碳足跡庫</option>
                  <option>臺北市工務局常用材料歷史庫</option>
                </select>
              </div>
            </div>

            {isMatching && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-bold text-indigo-700">
                  <span>三模態語意分析進度 (規則比對 ➔ 同義詞 ➔ 語意 Embedding)</span>
                  <span>{matchingProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${matchingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 配對成果資料表 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{currentTemplate.name} — AI 語意配對核算結果清單</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              已由 NLP 引擎自動比對本土排放係數，勾選後即可一鍵批次同步至申報 BOM 清冊。
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleBatchSyncToBOM}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>批次確認入庫 ({selectedCount} 筆)</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                <th className="p-3.5 pl-6 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={matchedItems.length > 0 && matchedItems.every((i) => i.selected)}
                    onChange={(e) => handleToggleSelectAll(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">PCCES工項編碼</th>
                <th className="p-3.5">原始工項名稱</th>
                <th className="p-3.5 text-right">數量</th>
                <th className="p-3.5">AI 本土係數媒合推薦</th>
                <th className="p-3.5 text-right">碳排係數</th>
                <th className="p-3.5 text-center">媒合方式與信心度</th>
                <th className="p-3.5 text-right pr-6">小計 (kgCO₂e)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {matchedItems.map((item) => {
                const subtotal = Math.round(item.quantity * item.efValue);
                const isHighConfidence = item.confidence >= 90;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-6 text-center">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleToggleItem(item.id)}
                        className="w-4 h-4 accent-indigo-600 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-700">{item.pccesCode}</td>
                    <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                    <td className="p-3.5 text-right font-mono font-semibold text-slate-600">
                      {item.quantity.toLocaleString()} {item.unit}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-indigo-700">{item.matchedFactor}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{item.source}</span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-800">
                      {item.efValue}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isHighConfidence ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-amber-50 text-amber-700 border border-amber-150'
                        }`}>
                          {item.method} ({item.confidence}%)
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-right pr-6 font-mono font-bold text-slate-900">
                      {subtotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* NLP 係數庫即時語意比對沙盒 (Sandbox) */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>NLP 智慧語意媒合演算法即時驗證沙盒 (Live Test Sandbox)</span>
          </div>
          <span className="text-xs text-slate-400">支援模糊描述、同義詞、複合材料語意解析</span>
        </h3>

        <form onSubmit={handleTestSandbox} className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={sandboxText}
            onChange={(e) => setSandboxText(e.target.value)}
            className="flex-1 h-10 px-4 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-slate-50/50"
            placeholder="輸入工程工項描述（例如：高爐低碳預拌混凝土、再生冷刨瀝青鋪面）..."
          />
          <button
            type="submit"
            disabled={isSandboxRunning}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isSandboxRunning ? '分析中...' : '即時測試 AI 語意配對'}</span>
          </button>
        </form>

        {sandboxResult && (
          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-700">AI 最佳匹配推薦結果</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150">
                語意相似度：{sandboxResult.score}%
              </span>
            </div>
            <div className="text-xs font-extrabold text-slate-900">
              [{sandboxResult.code}] {sandboxResult.factorName}
            </div>
            <div className="flex flex-wrap gap-4 text-[11px] text-slate-600 font-medium">
              <span>排放係數：<strong className="text-slate-900 font-mono">{sandboxResult.ef}</strong> {sandboxResult.unit}</span>
              <span>資料來源：{sandboxResult.source}</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/**
 * 碳排放熱點分析模組 (含減碳情境模擬器)
 */
export function HotspotAnalysisView() {
  const meta = MODULE_DEFINITIONS.hotspot_analysis;
  const [viewMode, setViewMode] = useState<'material' | 'lifecycle'>('material');

  // 減碳情境模擬器狀態
  const [slagCementRate, setSlagCementRate] = useState(40); // 高爐水泥替代率 %
  const [electricSteelRate, setElectricSteelRate] = useState(50); // 電爐再生鋼筋 %
  const [recycleAsphalt, setRecycleAsphalt] = useState(true); // 冷刨再生瀝青
  const [electricMachinery, setElectricMachinery] = useState(true); // 電動重型機具

  const baseTotalTon = 11280; // 基準碳排 11,280 tCO2e

  // 計算動態減碳量
  const reductionCement = Math.round((baseTotalTon * 0.36) * (slagCementRate / 100) * 0.25);
  const reductionSteel = Math.round((baseTotalTon * 0.24) * (electricSteelRate / 100) * 0.35);
  const reductionAsphalt = recycleAsphalt ? 145 : 0;
  const reductionMachine = electricMachinery ? 88 : 0;
  const totalReductionTon = reductionCement + reductionSteel + reductionAsphalt + reductionMachine;
  const finalEmissionTon = baseTotalTon - totalReductionTon;
  const reductionPercent = ((totalReductionTon / baseTotalTon) * 100).toFixed(1);

  // 臺北市2030目標達成率 (-30% 目標)
  const target30Progress = Math.min(100, Math.round((Number(reductionPercent) / 30) * 100));

  const hotMaterials = [
    { name: '卜特蘭水泥 (一型) - 結構與主梁澆置', emissionTon: 4060, share: '36.0%', color: 'bg-rose-600' },
    { name: '竹節鋼筋 SD420W - 基礎承重排架系統', emissionTon: 2707, share: '24.0%', color: 'bg-amber-500' },
    { name: '高強度預拌混凝土 280kg/cm² - 橋面板結構', emissionTon: 2030, share: '18.0%', color: 'bg-indigo-600' },
    { name: '重型吊裝鋼構與組力系統 - 臨時便道與支架', emissionTon: 1354, share: '12.0%', color: 'bg-sky-500' },
    { name: '其他零星營造材料與開挖填土工項', emissionTon: 1129, share: '10.0%', color: 'bg-slate-400' },
  ];

  const lifecycleStages = [
    { stage: 'A1-A3 原料開採、運送與製品製造階段', emissionTon: 7693, share: '68.2%', color: 'bg-rose-600', desc: '水泥熟料鍛燒、鋼鐵電爐冶煉大宗原料製程碳排' },
    { stage: 'A4 材料運送至施工工地交通運輸階段', emissionTon: 959, share: '8.5%', color: 'bg-amber-500', desc: '預拌混凝土車、砂石大貨卡運距排碳' },
    { stage: 'A5 現場施作、重型挖掘吊裝與養護階段', emissionTon: 2628, share: '23.3%', color: 'bg-indigo-600', desc: '柴油挖土機、吊車、發電機與臨時水電能耗' },
  ];

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 模組標題 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {meta.name}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1.5 tracking-wider">
            {meta.description}
          </p>
        </div>

        {/* 檢視維度切換 */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('material')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'material' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            依材料工項別排比
          </button>
          <button
            onClick={() => setViewMode('lifecycle')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'lifecycle' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            依施工生命週期階段別 (A1-A5)
          </button>
        </div>
      </div>

      {/* 排比分析面板 */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
            <span>{viewMode === 'material' ? '工程重大碳排放材料工料排比' : '施工生命週期階段別 (A1-A5) 碳足跡佔比'}</span>
          </div>
          <span className="text-xs text-slate-400 font-semibold">基準碳排總額：{baseTotalTon.toLocaleString()} tCO₂e</span>
        </h3>

        {viewMode === 'material' ? (
          <div className="space-y-4">
            {hotMaterials.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-600 font-semibold">{item.emissionTon.toLocaleString()} tCO₂e</span>
                    <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] font-bold">
                      佔比 {item.share}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: item.share }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {lifecycleStages.map((st, idx) => (
              <div key={idx} className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{st.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-600 font-bold">{st.emissionTon.toLocaleString()} tCO₂e</span>
                    <span className="font-mono text-indigo-700 bg-white px-2 py-0.5 rounded text-[11px] font-bold border border-slate-200">
                      佔比 {st.share}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-2.5 rounded-full ${st.color}`} style={{ width: st.share }}></div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">{st.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 減碳對策情境模擬器 (Decarbonization Scenario Simulator) */}
      <section className="bg-white rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/30 to-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-indigo-100 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              減碳對策情境模擬試算器 (Decarbonization Scenario Simulator)
            </h3>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            即時動態連動核算
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左側：四項減碳策略控制 */}
          <div className="lg:col-span-7 space-y-4">
            {/* 策略 1 */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-800">1. 預拌混凝土改用「卜特蘭高爐水泥 / 低碳配比」</span>
                <span className="font-mono font-bold text-indigo-600">{slagCementRate}% 替代率 (-{reductionCement} t)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={slagCementRate}
                onChange={(e) => setSlagCementRate(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 font-medium">每提高替代率可降低熟料鍛燒排碳，最高可減碳達 25%。</p>
            </div>

            {/* 策略 2 */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-800">2. 鋼筋全面採用「電爐煉鋼再生鋼筋」</span>
                <span className="font-mono font-bold text-indigo-600">{electricSteelRate}% 採用率 (-{reductionSteel} t)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={electricSteelRate}
                onChange={(e) => setElectricSteelRate(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 font-medium">電爐廢鋼再生相較高爐煉鋼可降低約 35% 製程碳排放強度。</p>
            </div>

            {/* 策略 3 */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex justify-between items-center text-xs">
              <div>
                <span className="font-extrabold text-slate-800 block">3. 既有路面材料「100% 瀝青混凝土冷刨再生利用」</span>
                <span className="text-[11px] text-slate-400 font-medium">原地刨除再生鋪築，預估可降低 145 tCO₂e 運輸與新料能耗</span>
              </div>
              <input
                type="checkbox"
                checked={recycleAsphalt}
                onChange={(e) => setRecycleAsphalt(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 cursor-pointer shrink-0"
              />
            </div>

            {/* 策略 4 */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex justify-between items-center text-xs">
              <div>
                <span className="font-extrabold text-slate-800 block">4. 施工重型機具「全面改採綠電充電樁與電動型機具」</span>
                <span className="text-[11px] text-slate-400 font-medium">工地現場設置太陽能臨時電網與電動挖土機，預估減少 88 tCO₂e</span>
              </div>
              <input
                type="checkbox"
                checked={electricMachinery}
                onChange={(e) => setElectricMachinery(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 cursor-pointer shrink-0"
              />
            </div>
          </div>

          {/* 右側：減碳綜合核算結果 */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">綜合減碳情境模擬成果</span>
              <div className="mt-3 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">專案原始基準排放</span>
                  <span className="font-mono font-bold text-slate-800">{baseTotalTon.toLocaleString()} tCO₂e</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-700 font-bold">對策累積推估減碳量</span>
                  <span className="font-mono font-black text-emerald-600 text-sm">-{totalReductionTon.toLocaleString()} tCO₂e</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2">
                  <span className="text-slate-800 font-bold">採用對策後專案總碳排</span>
                  <span className="font-mono font-black text-indigo-700 text-base">{finalEmissionTon.toLocaleString()} tCO₂e</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-900">整體減碳比例達成</span>
                <span className="text-lg font-mono font-black text-emerald-700">{reductionPercent}%</span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, Number(reductionPercent) * 2.5)}%` }}></div>
              </div>
              <p className="text-[10px] text-emerald-800 font-semibold leading-relaxed">
                距臺北市公共工程 2030 階段目標（減碳 -30%）達成進度：{target30Progress}%。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * 角色與權限管理模組 (含模擬身分切換視角)
 */
export function RolePermissionsView() {
  const meta = MODULE_DEFINITIONS.role_permissions;
  const [currentPersona, setCurrentPersona] = useState<'auditor' | 'designer' | 'consultant' | 'contractor'>('auditor');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const personas = [
    { id: 'auditor' as const, name: '工務局審查長 (市府主審官)', dept: '工務局工程管理科', badge: '終審核可決行', level: '最高主管' },
    { id: 'designer' as const, name: '工程設計單位 (規劃設計廠商)', dept: '世曦工程顧問設計處', badge: 'PCCES編造與初審', level: '規劃設計' },
    { id: 'consultant' as const, name: '外部監造顧問 (工程顧問監理員)', dept: '中興工程顧問監造所', badge: '現勘查核與退回', level: '監造顧問' },
    { id: 'contractor' as const, name: '營造承攬廠商 (現場填報經辦人)', dept: '春原營造特約工區', badge: 'BOM填報與出廠證明', level: '施工廠商' },
  ];

  const handleSaveMatrix = () => {
    setSaveNotice('角色權限管控矩陣已成功儲存並同步至安全稽核存取控制清單 (ACL)。');
    setTimeout(() => setSaveNotice(null), 4000);
  };

  const activePersona = personas.find((p) => p.id === currentPersona) || personas[0];

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {meta.name}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1.5 tracking-wider">
            {meta.description}
          </p>
        </div>

        <button
          onClick={handleSaveMatrix}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>儲存權限矩陣設定</span>
        </button>
      </div>

      {saveNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* 模擬切換使用者角色視角 (Persona Switcher) */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>模擬切換各利害關係人操作角色視角 (Persona Switcher)</span>
          </h3>
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
            當前操作角色：{activePersona.level}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {personas.map((p) => {
            const isSelected = p.id === currentPersona;
            return (
              <button
                key={p.id}
                onClick={() => setCurrentPersona(p.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <span className="font-extrabold text-slate-900 text-xs block">{p.name.split(' (')[0]}</span>
                  <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">{p.dept}</span>
                </div>
                <span className={`text-[10px] font-bold mt-2 px-2 py-0.5 rounded inline-block w-fit ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {p.badge}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 權限管控矩陣 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>市府機關與承攬廠商權限管控矩陣 (RBAC Matrix)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">點擊各權限格子可即時切換允許、唯讀或禁止存取狀態。</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-extrabold text-[10px] uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5 pl-6">角色類別</th>
                <th className="p-3.5 text-center">專案建立與登錄</th>
                <th className="p-3.5 text-center">PCCES 預算書匯入</th>
                <th className="p-3.5 text-center">材料清冊線上填報</th>
                <th className="p-3.5 text-center">係數人工覆核修訂</th>
                <th className="p-3.5 text-center">核定終審簽准權</th>
                <th className="p-3.5 text-center pr-6">日誌稽查與系統匯出</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold">
              <tr className={currentPersona === 'auditor' ? 'bg-indigo-50/40 font-bold' : ''}>
                <td className="p-3.5 pl-6 text-indigo-900 font-bold">
                  工務局審查長 (市府主審官)
                  {currentPersona === 'auditor' && <span className="ml-2 text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-normal">當前視角</span>}
                </td>
                <td className="p-3.5 text-center text-emerald-600">✓ 允許</td>
                <td className="p-3.5 text-center text-emerald-600">✓ 允許</td>
                <td className="p-3.5 text-center text-emerald-600">✓ 允許</td>
                <td className="p-3.5 text-center text-emerald-600">✓ 允許</td>
                <td className="p-3.5 text-center text-emerald-600 font-extrabold">✓ 允許 (唯一)</td>
                <td className="p-3.5 text-center pr-6 text-emerald-600">✓ 允許</td>
              </tr>
              <tr className={currentPersona === 'designer' ? 'bg-indigo-50/40 font-bold' : ''}>
                <td className="p-3.5 pl-6 text-slate-900 font-bold">
                  工程設計單位 (規劃設計廠商)
                  {currentPersona === 'designer' && <span className="ml-2 text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-normal">當前視角</span>}
                </td>
                <td className="p-3.5 text-center text-emerald-600">✓ 允許</td>
                <td className="p-3.5 text-center text-emerald-600">✓ 允許</td>
                <td className="p-3.5 text-center text-emerald-600">✓ 允許</td>
                <td className="p-3.5 text-center text-slate-400">唯讀檢視</td>
                <td className="p-3.5 text-center text-rose-500">✗ 禁止</td>
                <td className="p-3.5 text-center pr-6 text-slate-400">唯讀檢視</td>
              </tr>
              <tr className={currentPersona === 'consultant' ? 'bg-indigo-50/40 font-bold' : ''}>
                <td className="p-3.5 pl-6 text-slate-900 font-bold">
                  外部監造顧問 (工程顧問監理員)
                  {currentPersona === 'consultant' && <span className="ml-2 text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-normal">當前視角</span>}
                </td>
                <td className="p-3.5 text-center text-slate-400">唯讀檢視</td>
                <td className="p-3.5 text-center text-slate-400">唯讀檢視</td>
                <td className="p-3.5 text-center text-emerald-600">✓ 允許查核</td>
                <td className="p-3.5 text-center text-emerald-600">✓ 允許初審</td>
                <td className="p-3.5 text-center text-rose-500">✗ 禁止</td>
                <td className="p-3.5 text-center pr-6 text-slate-400">唯讀檢視</td>
              </tr>
              <tr className={currentPersona === 'contractor' ? 'bg-indigo-50/40 font-bold' : ''}>
                <td className="p-3.5 pl-6 text-slate-900 font-bold">
                  營造承攬廠商 (現場填報經辦人)
                  {currentPersona === 'contractor' && <span className="ml-2 text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-normal">當前視角</span>}
                </td>
                <td className="p-3.5 text-center text-rose-500">✗ 禁止</td>
                <td className="p-3.5 text-center text-rose-500">✗ 禁止</td>
                <td className="p-3.5 text-center text-emerald-600">✓ 允許填報</td>
                <td className="p-3.5 text-center text-rose-500">✗ 禁止</td>
                <td className="p-3.5 text-center text-rose-500">✗ 禁止</td>
                <td className="p-3.5 text-center pr-6 text-rose-500">✗ 禁止</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/**
 * 系統參數設定模組 (含 API 同步與門檻調整)
 */
export function SettingsView() {
  const meta = MODULE_DEFINITIONS.settings;
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [alertThreshold, setAlertThreshold] = useState(90);
  const [alertEmail, setAlertEmail] = useState('carbon-alert@gov.taipei');

  const handleSyncApi = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice('成功連線環境部事業溫室氣體資料庫與內政部建研所 API，已自動同步更新 115 年度最新 1,248 筆公共工程材料碳排放係數！');
      setTimeout(() => setSyncNotice(null), 5000);
    }, 1200);
  };

  const handleSaveSettings = () => {
    setSyncNotice('系統參數設定已儲存生效！');
    setTimeout(() => setSyncNotice(null), 3000);
  };

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {meta.name}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1.5 tracking-wider">
            {meta.description}
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>儲存全域參數設定</span>
        </button>
      </div>

      {syncNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 本土係數資料庫同步 */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            <span>本土化碳排放係數庫動態同步機制</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            系統支援排程每週自動或手動即時介接環境部及內政部資料庫，確保工程標案引用之係數為最新核定版次。
          </p>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">目前係數庫版本：</span>
              <span className="font-mono font-bold text-slate-800">115.02.15-RELEASE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">涵蓋大宗工程材料：</span>
              <span className="font-mono font-bold text-slate-800">1,248 筆</span>
            </div>
          </div>

          <button
            onClick={handleSyncApi}
            disabled={isSyncing}
            className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? '同步環境部最新係數庫中...' : '手動立即檢查並同步最新係數 (API)'}</span>
          </button>
        </section>

        {/* 超額預警通報 */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-600" />
            <span>公共工程超額排放自動預警通報</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  觸發預警門檻 (占核定預算比例)
                </label>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {alertThreshold}% 額度觸發
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                緊急預警公務收件信箱
              </label>
              <input
                type="email"
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * 申報支援與諮詢模組 (含多種公務作業指引下載)
 */
export function SupportView() {
  const meta = MODULE_DEFINITIONS.support;
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [inquiryQuestion, setInquiryQuestion] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const handleDownload = (docName: string) => {
    setDownloadSuccess(`已成功下載《${docName}》！`);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 4000);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryQuestion.trim()) return;
    setInquirySuccess(true);
    setInquiryQuestion('');
    setTimeout(() => setInquirySuccess(false), 5000);
  };

  return (
    <div className="space-y-6 text-left font-sans">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          {meta.name}
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-1.5 tracking-wider">
          {meta.description}
        </p>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {inquirySuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>您的諮詢意見已送達臺北市政府工務局碳管理推動小組，將於 24 小時內指派專案工程師回覆！</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 諮詢專線 */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-600" />
            <span>申報操作諮詢專線與輔導窗口</span>
          </h3>
          <div className="space-y-3.5 text-xs text-slate-700 font-medium">
            <p className="leading-relaxed">
              填報單位若遭遇 PCCES 匯入解析錯誤、語意係數配對落差或示範案場填報問題，可直接聯繫工務局碳管理小組。
            </p>
            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-1.5 text-xs">
              <span className="block font-bold text-indigo-800 text-sm">
                臺北市民當家熱線：1999 (外縣市請撥：02-2720-8889)
              </span>
              <span className="block text-slate-600">分機：#1085 (張工程師)、#1088 (李管理科長)</span>
              <span className="block text-slate-600 font-mono">公務信箱：carbon-ledgers@gov.taipei</span>
            </div>
          </div>

          <form onSubmit={handleSendInquiry} className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              線上即時問題諮詢留言
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inquiryQuestion}
                onChange={(e) => setInquiryQuestion(e.target.value)}
                className="flex-1 h-9 px-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600"
                placeholder="輸入您遭遇的系統申報問題..."
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>送出</span>
              </button>
            </div>
          </form>
        </section>

        {/* 官方手冊下載清單 */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>臺北市公共工程碳管理官方作業手冊下載</span>
          </h3>

          <div className="space-y-2.5">
            {[
              { name: '115年度臺北市公共工程施工階段碳盤查申報SOP作業指引_v2.1.pdf', size: '4.8 MB' },
              { name: 'PCCES預算書工項與本土碳排係數庫編碼對照指引_v1.0.xlsx', size: '2.1 MB' },
              { name: '市府工程單位碳盤查審查作業手冊及檢核表.pdf', size: '3.2 MB' },
            ].map((doc, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center text-xs">
                <div>
                  <p className="font-extrabold text-slate-800">{doc.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.size}</p>
                </div>
                <button
                  onClick={() => handleDownload(doc.name)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded text-[11px] font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>下載</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * 快速估算模型驗證模組
 */
export function FastEstimationView() {
  const meta = MODULE_DEFINITIONS.fast_estimation;
  const [models, setModels] = useState(defaultEstimationModels);
  const [selectedCategory, setSelectedCategory] = useState(models[0].category);
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    defaultEstimationModels.forEach((m) => {
      m.factors.forEach((f) => {
        initial[f.id] = f.inputQuantity;
      });
    });
    return initial;
  });
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibratedNotice, setCalibratedNotice] = useState<string | null>(null);

  const currentModel = models.find((m) => m.category === selectedCategory) || models[0];

  const handleQuantityChange = (factorId: string, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [factorId]: Math.max(0, val),
    }));
  };

  // 總推估碳排量試算
  const totalEmissionKg = currentModel.factors.reduce((acc, f) => {
    const qty = quantities[f.id] ?? f.inputQuantity;
    return acc + qty * f.defaultEf;
  }, 0);

  const totalEmissionTon = (totalEmissionKg / 1000).toFixed(2);

  // 執行盲測校正模擬
  const handleRunCalibration = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      setCalibratedNotice(`已依據 ${currentModel.blindTestSamples} 組市府新舊工程歷史盲測樣本最佳化迴歸係數，模型綜合驗證精準度提升至 ${(currentModel.accuracyRate + 0.6).toFixed(1)}%！`);
      setModels((prev) =>
        prev.map((m) =>
          m.category === currentModel.category
            ? { ...m, accuracyRate: Math.min(99.5, Number((m.accuracyRate + 0.6).toFixed(1))) }
            : m
        )
      );
      setTimeout(() => setCalibratedNotice(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {meta.name}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1.5 tracking-wider">
            {meta.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCalibration}
            disabled={isCalibrating}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isCalibrating ? 'animate-spin' : ''}`} />
            <span>{isCalibrating ? '歷史盲測數據校正中...' : '執行盲測樣本校準'}</span>
          </button>
        </div>
      </div>

      {calibratedNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>{calibratedNotice}</span>
        </div>
      )}

      {/* 模型切換標籤 */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        {models.map((m) => {
          const isActive = m.category === selectedCategory;
          return (
            <button
              key={m.category}
              onClick={() => setSelectedCategory(m.category)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span>{m.name.split(' (')[0]}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {m.stage}
              </span>
            </button>
          );
        })}
      </div>

      {/* 模型概況與指標卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">當前快速估算模型</span>
          <span className="text-base font-extrabold text-slate-900 mt-1 block truncate">
            {currentModel.name}
          </span>
          <p className="text-[10px] text-indigo-600 font-semibold mt-1">
            {currentModel.stage} • 涵蓋 {currentModel.factorCount} 項核心關鍵工料
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">歷史盲測樣本總數</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-mono font-black text-slate-900">{currentModel.blindTestSamples}</span>
            <span className="text-xs text-slate-500 font-bold">件工程標案</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">擴大驗證以校準模型調整係數</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">模型綜合驗證精準度</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-mono font-black text-emerald-600">{currentModel.accuracyRate}%</span>
            <span className="text-xs text-emerald-700 font-bold">相較全工項</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">快速估算可推估 85% 以上總碳排</p>
        </div>

        <div className="bg-white rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white p-5 shadow-xs">
          <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block">推估生命週期碳排總量</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-mono font-black text-indigo-600">{totalEmissionTon}</span>
            <span className="text-xs text-indigo-900 font-bold">tCO₂e</span>
          </div>
          <p className="text-[10px] text-indigo-700 font-semibold mt-1">即時試算聯動（含正負碳排）</p>
        </div>
      </div>

      {/* 關鍵因子調整清單 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>{currentModel.name} — 關鍵工項因子參數調整與動態核算</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{currentModel.description}</p>
          </div>
          <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg shrink-0">
            共 {currentModel.factors.length} 項關鍵因子
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                <th className="p-3.5 pl-6">關鍵因子名稱</th>
                <th className="p-3.5 text-center">工程單位</th>
                <th className="p-3.5 text-right">碳排係數 (kgCO₂e/單位)</th>
                <th className="p-3.5 text-center">預估排碳佔比</th>
                <th className="p-3.5 text-right w-44">輸入工程數量</th>
                <th className="p-3.5 text-right pr-6">試算排放量 (kgCO₂e)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {currentModel.factors.map((factor) => {
                const qty = quantities[factor.id] ?? factor.inputQuantity;
                const emission = qty * factor.defaultEf;
                const isNegative = factor.defaultEf < 0;

                return (
                  <tr key={factor.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-6 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        <span>{factor.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-mono text-slate-600 font-semibold">
                      {factor.unit}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-700">
                      <span className={isNegative ? 'text-emerald-600' : ''}>
                        {factor.defaultEf}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-mono text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-semibold">
                        {factor.weight}%
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <input
                        type="number"
                        min="0"
                        value={qty}
                        onChange={(e) => handleQuantityChange(factor.id, Number(e.target.value))}
                        className="w-32 h-8 px-2.5 text-right border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
                      />
                    </td>
                    <td className="p-3.5 text-right pr-6 font-mono font-bold">
                      <span className={isNegative ? 'text-emerald-600' : 'text-slate-900'}>
                        {emission.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            依據前期與中期研究，透過關鍵因子估算可將人工盤查作業耗時縮短 75% 以上。
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-slate-600">模型快速推估總量：</span>
            <span className="text-lg font-mono font-black text-indigo-600">{totalEmissionTon}</span>
            <span className="text-xs font-bold text-indigo-700">tCO₂e</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 計畫期程與經費管考模組
 */
export function ProjectPlanView() {
  const meta = MODULE_DEFINITIONS.project_plan;
  const [budgetList] = useState(defaultBudgetExecution);
  const [pilotList] = useState(defaultPilotProjects);

  const totalBudget = 4500000;
  const totalSpent = budgetList.reduce((acc, b) => acc + b.spentAmount, 0);
  const overallBudgetProgress = ((totalSpent / totalBudget) * 100).toFixed(1);

  const totalDays = 600;
  const passedDays = 375;
  const daysProgress = ((passedDays / totalDays) * 100).toFixed(1);

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {meta.name}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1.5 tracking-wider">
            {meta.description}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3.5 py-2 rounded-xl text-indigo-900 text-xs font-bold">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>計畫執行進度：第 {passedDays} 天 / 全期程 {totalDays} 日曆天 ({daysProgress}%)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">核定法定採購總預算</span>
          <span className="text-2xl font-mono font-black text-slate-900 mt-1 block">
            NT$ {(totalBudget / 10000).toLocaleString()} <span className="text-xs font-bold text-slate-500">萬元</span>
          </span>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">兩年度期程編列 (450萬元整)</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">累計執行與實報金額</span>
          <span className="text-2xl font-mono font-black text-indigo-600 mt-1 block">
            NT$ {(totalSpent / 10000).toFixed(1)} <span className="text-xs font-bold text-slate-500">萬元</span>
          </span>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${overallBudgetProgress}%` }}></div>
          </div>
          <p className="text-[10px] text-indigo-600 mt-1 font-semibold">整體經費執行率：{overallBudgetProgress}%</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">示範工程試辦導入</span>
          <span className="text-2xl font-mono font-black text-emerald-600 mt-1 block">
            {pilotList.length} <span className="text-xs font-bold text-slate-500">案場</span>
          </span>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">
            跨新工處、水利處、公園處、大地處
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">主要工作項目驗收階段</span>
          <span className="text-2xl font-mono font-black text-amber-600 mt-1 block">
            期中查驗 <span className="text-xs font-bold text-slate-500">完成</span>
          </span>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">即將進入示範案場實證與制度推廣</p>
        </div>
      </div>

      {/* 經費配置管考表 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-indigo-600" />
            <span>五大預算項目配置與實施進度管考明細</span>
          </div>
          <span className="text-xs text-slate-400 font-semibold">依勞務採購需求說明書規格</span>
        </h3>

        <div className="space-y-4">
          {budgetList.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-slate-900">
                    NT$ {item.spentAmount.toLocaleString()} / {item.allocatedAmount.toLocaleString()} 元
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600">{item.progressPercent}% 達成</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item.progressPercent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 案示範工程導入試辦與輔導管考 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <span>示範案場導入與府內機關試辦輔導進度 (新工處、水利處、公園處、大地處)</span>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            滿足合約要求（至少3案）
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                <th className="p-3.5 pl-6">示範工程名稱</th>
                <th className="p-3.5">主辦機關</th>
                <th className="p-3.5">施工廠商</th>
                <th className="p-3.5 text-center">PCCES預算書匯入</th>
                <th className="p-3.5 text-right">基準碳排 (tCO₂e)</th>
                <th className="p-3.5 text-right">減碳效益 (tCO₂e)</th>
                <th className="p-3.5 text-center pr-6">試辦狀態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {pilotList.map((p) => {
                const getStatusBadge = () => {
                  switch (p.status) {
                    case '審查簽准核可':
                      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    case '模型盲測驗證':
                      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
                    default:
                      return 'bg-amber-50 text-amber-700 border-amber-200';
                  }
                };

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-6 font-bold text-slate-900">{p.name}</td>
                    <td className="p-3.5 font-bold text-indigo-700">{p.agency}</td>
                    <td className="p-3.5 text-slate-600 font-medium">{p.contractor}</td>
                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>已完成</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-semibold text-slate-600">
                      {p.baselineCo2.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-600">
                      -{p.reducedCo2}
                    </td>
                    <td className="p-3.5 text-center pr-6">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge()}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 四大工作項目落實清單 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-indigo-600" />
          <span>採購需求書四大主要工作項目落實檢核清單</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>工作項目一：公共工程施工階段碳盤查與管理資訊系統正式開發與部署</span>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1 pl-6 text-[11px] leading-relaxed">
              <li>PCCES 預算書自動匯入解析（XML 格式支援）</li>
              <li>視覺化儀表板開發（即時進度追蹤、額度監控、減碳熱點）</li>
              <li>多角色權限與審核流（設計單位、施工廠商、工務局/監造單位）</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>工作項目二：NLP 智慧語意媒合引擎與本土化碳排放係數庫擴充</span>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1 pl-6 text-[11px] leading-relaxed">
              <li>三模態比對引擎（規則式比對、關鍵字匹配及 AI 語意分析）</li>
              <li>在地化係數庫擴充（整合環境部、內政部及工程大宗材料係數）</li>
              <li>係數庫動態更新與維護機制</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>工作項目三：快速估算模型深化與多元工項類型擴充驗證</span>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1 pl-6 text-[11px] leading-relaxed">
              <li>校正既有模型（建築前5、道路前6、人行道前9因子擴大盲測樣本）</li>
              <li>擴充工程類別（橋梁前8、水利前7、公園前6、下水道關鍵因子快速估算）</li>
              <li>多類型快速計算公式調整係數最佳化</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>工作項目四：制定數位化申報標準作業程序與制度推廣</span>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1 pl-6 text-[11px] leading-relaxed">
              <li>編撰作業指引與手冊（碳盤查申報 SOP、審查作業手冊）</li>
              <li>教育訓練與試辦輔導（新工處、水利處、公園處、大地處辦理培訓）</li>
              <li>挑選至少 3 案示範工程進行實地試辦輔導</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ExtraViews() {
  return null;
}
