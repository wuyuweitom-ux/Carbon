/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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
} from 'lucide-react';
import { MODULE_DEFINITIONS } from '../constants/modules';
import {
  defaultEstimationModels,
  defaultBudgetExecution,
  defaultPilotProjects,
} from '../data';

interface ExtraProps {
  searchQuery: string;
}

/**
 * PCCES 數據智慧配對模組
 */
export function ImportMappingView({ searchQuery: _searchQuery }: ExtraProps) {
  const meta = MODULE_DEFINITIONS.import_mapping;

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-indigo-600" />
            <span>AI 語意配對模型參數設定</span>
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                配對信心權重門檻值
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="50"
                  max="100"
                  defaultValue="85"
                  className="flex-1 accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                  85% 信心門檻
                </span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                推薦匹配候選項數量
              </label>
              <select className="w-full h-10 border border-slate-200 bg-white text-xs font-semibold rounded-lg px-3 cursor-pointer">
                <option>推薦排列前 3 高機率係數項目</option>
                <option>推薦符合工務局預載 5 組係數項目</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>目前載入之 PCCES 盤查基準圖資</span>
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg flex justify-between items-center text-xs">
              <div>
                <p className="font-extrabold text-slate-800">115_臺北新建橋樑工程盤查清冊.xml</p>
                <p className="text-[10px] text-slate-400 font-medium">總記錄數：1,245 筆工程材料標的</p>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
                已解算完成
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center text-xs opacity-75">
              <div>
                <p className="font-extrabold text-slate-800">114_市府公共活動中心參考資料.csv</p>
                <p className="text-[10px] text-slate-400 font-medium">歷史參照：304 筆標準規範工項</p>
              </div>
              <span className="text-[10px] text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full font-bold">
                備用參照庫
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * 碳排放熱點分析模組
 */
export function HotspotAnalysisView() {
  const meta = MODULE_DEFINITIONS.hotspot_analysis;

  const hotItems = [
    { name: '卜特蘭水泥 (一型) - 特殊結構與大樑灌澆', share: '36%', color: 'bg-rose-600' },
    { name: '竹節鋼筋 SD420W - 基礎承重排架系統', share: '24%', color: 'bg-amber-500' },
    { name: '高強度預拌混凝土 280kg/cm² - 主橋面板結構', share: '18%', color: 'bg-indigo-600' },
    { name: '重型吊裝鋼構與組力系統 - 臨時便道與支架', share: '12%', color: 'bg-sky-500' },
    { name: '其他零星營造輔助材料與開挖填土工項', share: '10%', color: 'bg-slate-400' },
  ];

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-1.5">
            <Flame className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
            <span>重大碳排放料件排比分析</span>
          </h3>

          <div className="space-y-5">
            {hotItems.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.name}</span>
                  <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] font-bold">
                    佔比 {item.share}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className={`h-3 rounded-full ${item.color}`} style={{ width: item.share }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
              <AlertOctagon className="w-4.5 h-4.5 text-amber-600" />
              <span>AI 碳排減量最佳化建議</span>
            </h3>
            <div className="p-4 bg-orange-50/60 border border-orange-150 rounded-lg text-xs space-y-3">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                <span className="font-bold text-orange-900 text-sm">混合高爐水泥熟料替代方案</span>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                若將卜特蘭一型水泥依工法等比例替換為臺北市公共工程核可之「低碳混合高爐水泥」，本橋梁工程排碳總量可立即下調約{' '}
                <strong className="text-orange-700 font-black underline">14.6%</strong>
                ，且符合公共工程委員會低碳建材審查規範。
              </p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 mt-4 text-center text-[10px] text-slate-400 font-bold">
            臺北市政府工務局大數據科學建模分析庫提供
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * 角色與權限管理模組
 */
export function RolePermissionsView() {
  const meta = MODULE_DEFINITIONS.role_permissions;

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

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/70">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>市府機關與承攬廠商權限管控矩陣</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            嚴格管制市府主審主管、委外監造顧問及營造承攬單位的填報、修改、審核與終審權限門檻。
          </p>
        </div>

        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-extrabold text-[11px] tracking-wider border-b border-slate-200">
              <th className="p-4">角色類別</th>
              <th className="p-4">專案登錄</th>
              <th className="p-4">材料清冊填報</th>
              <th className="p-4">係數人工覆核</th>
              <th className="p-4">核定審決權</th>
              <th className="p-4">系統稽核與備份</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold">
            <tr>
              <td className="p-4 font-bold text-indigo-700">工務局審查長 (市府主審官)</td>
              <td className="p-4 text-emerald-600 font-bold">✓ 允許</td>
              <td className="p-4 text-emerald-600 font-bold">✓ 允許</td>
              <td className="p-4 text-emerald-600 font-bold">✓ 允許</td>
              <td className="p-4 text-emerald-600 font-bold">✓ 允許</td>
              <td className="p-4 text-emerald-600 font-bold">✓ 允許</td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-indigo-700">外部監造工程師 (委外顧問)</td>
              <td className="p-4 text-emerald-600 font-bold">✓ 允許</td>
              <td className="p-4 text-emerald-600 font-bold">✓ 允許</td>
              <td className="p-4 text-rose-500 font-bold">✗ 唯讀檢視</td>
              <td className="p-4 text-rose-500 font-bold">✗ 唯讀檢視</td>
              <td className="p-4 text-rose-500 font-bold">✗ 唯讀檢視</td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-amber-700">營造特約填報商 (承攬廠商)</td>
              <td className="p-4 text-emerald-600 font-bold">✓ 允許</td>
              <td className="p-4 text-rose-500 font-bold">✗ 唯讀檢視</td>
              <td className="p-4 text-rose-500 font-bold">✗ 唯讀檢視</td>
              <td className="p-4 text-rose-500 font-bold">✗ 唯讀檢視</td>
              <td className="p-4 text-rose-500 font-bold">✗ 唯讀檢視</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

/**
 * 系統參數設定模組
 */
export function SettingsView() {
  const meta = MODULE_DEFINITIONS.settings;

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

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-2xl">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3 mb-5 flex items-center gap-1.5">
          <Sliders className="w-4.5 h-4.5 text-indigo-600" />
          <span>全域系統參數配置</span>
        </h3>

        <div className="space-y-4 text-xs text-slate-800 font-semibold">
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="text-slate-900 font-bold text-sm">臺北市工程排放源係數庫自動同步</p>
              <p className="text-slate-400 text-[11px] font-medium mt-0.5">
                每逢環境部、國土署或經濟部公告最新碳排係數即自動同步更新。
              </p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600 cursor-pointer" />
          </div>

          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="text-slate-900 font-bold text-sm">啟用多因子驗證 (MFA) 高安全登入</p>
              <p className="text-slate-400 text-[11px] font-medium mt-0.5">
                市府稽核主管及主審官登入時，須經公務簡訊 OTP 安全驗證。
              </p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600 cursor-pointer" />
          </div>

          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="text-slate-900 font-bold text-sm">超額排放自動預警通報</p>
              <p className="text-slate-400 text-[11px] font-medium mt-0.5">
                公共工程專案累計碳排達到總預算配額之 90% 時，自動通報工務局與環境保護局。
              </p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 申報支援與諮詢模組
 */
export function SupportView() {
  const meta = MODULE_DEFINITIONS.support;
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-600" />
            <span>申報操作諮詢專線</span>
          </h3>
          <div className="space-y-3.5 text-xs text-slate-700 font-medium">
            <p className="leading-relaxed">
              填報單位若遭遇 PCCES 匯入不相容、語意係數配對落差等重大技術問題，可直接與臺北市政府工務局碳盤查推動諮詢專線聯繫。
            </p>
            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-1.5 text-xs">
              <span className="block font-bold text-indigo-800 text-sm">
                臺北市民當家熱線：1999 (外縣市請撥：02-2720-8889)
              </span>
              <span className="block text-slate-600">分機：#1085 (張工程師)、#1088 (李管理科長)</span>
              <span className="block text-slate-600 font-mono">公務信箱：carbon-ledgers@gov.taipei</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>申報作業手冊下載</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
              提供臺北市公共工程碳排係數申報標準作業程序 (SOP) 全套指引手冊，含詳細材料代碼比對規範及審核檢核清單。
            </p>
          </div>

          <div className="space-y-3">
            {downloadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>已成功下載《115年度臺北市公共工程碳預算盤查申報手冊_v1.2.pdf》</span>
              </div>
            )}
            <button
              onClick={handleDownload}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>下載全套申報作業規範手冊 (PDF)</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * 快速估算模型驗證模組
 * 依據需求說明書：建築前5、道路前6、人行道前9因子及橋梁、水利、公園等多元工項快速估算與盲測校正
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

      {/* 關鍵因子調整與即時推估清單 */}
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

        {/* 總結列 */}
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
 * 依據需求說明書：600日曆天(兩年度完成)、總經費450萬元整五大項目管考、4案示範工程試辦
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
      {/* 標題 */}
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

      {/* 頂部四項綜合指標 Bento Layout */}
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

