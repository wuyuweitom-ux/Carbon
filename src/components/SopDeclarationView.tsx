/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CustomBOMItem, CommentItem, AutomatedCheck } from '../types';
import { MODULE_DEFINITIONS } from '../constants/modules';
import {
  Download,
  AlertTriangle,
  History,
  Send,
  FileEdit,
  ClipboardCheck,
  CheckCircle,
  Wrench,
} from 'lucide-react';

interface SopDeclarationViewProps {
  bomItems: CustomBOMItem[];
  setBomItems: (items: CustomBOMItem[]) => void;
  comments: CommentItem[];
  setComments: (comments: CommentItem[]) => void;
  automatedChecks: AutomatedCheck[];
  setAutomatedChecks: (checks: AutomatedCheck[]) => void;
}

export default function SopDeclarationView({
  bomItems,
  setBomItems,
  comments,
  setComments,
  automatedChecks,
  setAutomatedChecks,
}: SopDeclarationViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high_emission' | 'manually_adjusted'>('all');
  const [commentInput, setCommentInput] = useState('');
  const [highlightedRowCode, setHighlightedRowCode] = useState<string | null>(null);

  // Row Edit Modal states
  const [editingItem, setEditingItem] = useState<CustomBOMItem | null>(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [editEf, setEditEf] = useState(0);

  // Handle locating item code from automated triggers
  const handleLocateItem = (code: string) => {
    setHighlightedRowCode(code);
    setTimeout(() => {
      setHighlightedRowCode(null);
    }, 3000); // Highlight flash effect for 3 seconds
  };

  // Submit Comments
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      author: '陳美華 (審查長)',
      avatarText: 'AD',
      role: '工務局管理科科長',
      content: commentInput.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setComments([...comments, newComment]);
    setCommentInput('');
  };

  // Open Edit Item target values
  const handleStartEdit = (item: CustomBOMItem) => {
    setEditingItem(item);
    setEditQuantity(item.quantity);
    setEditEf(item.efValue);
  };

  // Save item values and push audits
  const handleSaveEditItem = () => {
    if (!editingItem) return;

    const parsedQty = parseFloat(editQuantity.replace(/[^0-9.]/g, '')) || 0;
    const unitPart = editQuantity.replace(/[0-9.,\s]/g, '') || '';
    const newTotal = Math.round(parsedQty * editEf);

    const updated = bomItems.map((item) => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          quantity: editQuantity,
          efValue: editEf,
          totalKgCo2: newTotal,
          status: 'manually_adjusted' as const,
        };
      }
      return item;
    });

    setBomItems(updated);

    // Push audit trails to comments log
    const systemAudit: CommentItem = {
      id: `system-${Date.now()}`,
      author: '系統自動日誌',
      avatarText: 'SYS',
      role: '申報稽查追蹤系統',
      content: `稽核主管手工覆核修改項目「${editingItem.code}」：數量調整為 ${editQuantity}，碳排係數修改為 ${editEf}。原申報碳排放量自動重新解算為 ${newTotal.toLocaleString()} kgCO2e。`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isSystem: true,
    };

    setComments([systemAudit, ...comments]);
    setEditingItem(null);
  };

  // Filter conditions
  const filteredBOM = bomItems.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.status === selectedFilter;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top action layout matching the mock design */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {MODULE_DEFINITIONS.sop_declaration.name}
          </h1>
          <p className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg mt-2 inline-block">
            專案編號：TP-INFRA-2024-089A • 臺北市橋梁重建工程
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer">
            <Download className="w-4 h-4" />
            <span>匯出審核專案 (臺北市政府官方格式)</span>
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
            <CheckCircle className="w-4 h-4" />
            <span>上報市府申報帳冊</span>
          </button>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Declaration Workflow & Automated Checks (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Declaration Workflow */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-slate-900 font-bold text-sm tracking-wide border-b border-slate-200 pb-3 mb-5 flex items-center gap-1.5">
              <ClipboardCheck className="w-4.5 h-4.5 text-indigo-600" />
              <span>申報作業流程</span>
            </h3>

            {/* Stepper Timeline UI */}
            <div className="relative pl-4 space-y-6">
              {/* Connected guide line */}
              <div className="absolute left-[21px] top-2 bottom-5 w-0.5 bg-slate-100"></div>

              {/* Step 1 */}
              <div className="relative flex items-start gap-4 text-left">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 z-10 shadow-sm">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">申報單位正式上報</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    10-12 14:30 • 經辦：張建宏 工程師
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-4 text-left">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 z-10 shadow-sm">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">雲端 AI 與規則自動檢核</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    10-12 14:35 • 系統智慧檢核模組
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-4 text-left">
                <div className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-indigo-600 flex items-center justify-center text-xs shrink-0 z-10 shadow-sm animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-600">市府稽核主管覆核</h4>
                  <p className="text-[10px] text-amber-600 font-bold mt-0.5 animate-pulse bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 inline-block">
                    等待審核覆核中 • 預計於 10-15 前完成
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start gap-4 text-left opacity-40">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 border border-slate-300 flex items-center justify-center text-xs shrink-0 z-10">
                  4
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-700">最終簽准核定</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">待前階段完成</p>
                </div>
              </div>
            </div>
          </section>

          {/* Automated check panel */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-slate-900 font-bold text-sm tracking-wide">AI 異常自動篩查結果</h3>
              <span className="px-2 py-0.5 bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-bold rounded">
                偵測到 2 處異常
              </span>
            </div>

            <div className="space-y-3">
              {automatedChecks.map((chk) => {
                const isCritical = chk.severity === 'critical';
                return (
                  <div
                    key={chk.id}
                    className={`p-3 border-l-4 rounded-r-lg text-left text-xs ${
                      isCritical
                        ? 'bg-rose-50/50 border-rose-600 text-slate-800'
                        : 'bg-amber-50/50 border-amber-500 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {isCritical ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isCritical ? 'text-rose-700' : 'text-amber-700'}`}>
                        {chk.title}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-700 leading-relaxed text-[11px]">{chk.description}</p>
                    {chk.bomLink && (
                      <button
                        onClick={() => handleLocateItem('C-400-STR')}
                        className="text-indigo-600 hover:underline font-extrabold text-[11px] mt-2 block tracking-tight cursor-pointer"
                      >
                        [定點至材料清冊異常位置]
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right column: Reviewer interface table & comments console (8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Reviewer interface BOM list */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 border-b border-slate-200 bg-[#f8f9ff] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-slate-900 font-bold text-sm tracking-wide">申報材料係數審計評估清冊 (BOM)</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">本批次共 6 筆材料工項。紅色為高碳排，藍色為手動調整，綠色為正常申報。</p>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1.5 shrink-0 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    selectedFilter === 'all'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  全部工項
                </button>
                <button
                  onClick={() => setSelectedFilter('high_emission')}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    selectedFilter === 'high_emission'
                      ? 'bg-[#ffebee] text-rose-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  高碳排工項
                </button>
                <button
                  onClick={() => setSelectedFilter('manually_adjusted')}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    selectedFilter === 'manually_adjusted'
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  手動修正工項
                </button>
              </div>
            </div>

            {/* Table block */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold tracking-widest uppercase">
                    <th className="p-3 pl-5 w-12 text-center">狀態</th>
                    <th className="p-3">材料編碼</th>
                    <th className="p-3">材料工項描述</th>
                    <th className="p-3 text-right">申報數量</th>
                    <th className="p-3 text-right">碳排係數</th>
                    <th className="p-3 text-right">總排量 (kgCO₂e)</th>
                    <th className="p-3 text-center w-16">覆核</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100">
                  {filteredBOM.map((item) => {
                    const isHigh = item.status === 'high_emission';
                    const isManual = item.status === 'manually_adjusted';
                    const isHighlighted = highlightedRowCode === item.code;

                    // Compute styles dynamically matching screenshot colors
                    let rowBgClass = 'bg-white';
                    if (isHigh) rowBgClass = 'bg-rose-50/20';
                    if (isManual) rowBgClass = 'bg-[#f0f4ff]/20';
                    if (isHighlighted) rowBgClass = 'bg-amber-100 animate-pulse';

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors hover:bg-slate-50/80 group ${rowBgClass}`}
                      >
                        <td className="p-3 pl-5 text-center shrink-0">
                          {isHigh && (
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block shadow-sm ring-2 ring-rose-100"></span>
                          )}
                          {isManual && (
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block shadow-sm ring-2 ring-indigo-150"></span>
                          )}
                          {item.status === 'standard' && (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm ring-2 ring-emerald-100"></span>
                          )}
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-700">{item.code}</td>
                        <td className="p-3 font-bold text-slate-800 tracking-tight">
                          {item.description}
                        </td>
                        <td className={`p-3 text-right font-mono font-bold ${isManual ? 'border-r-2 border-l-2 border-indigo-500 border-dashed bg-indigo-50/20' : ''}`}>
                          {item.quantity}
                        </td>
                        <td className="p-3 text-right font-mono text-slate-500">{item.efValue}</td>
                        <td className={`p-3 text-right font-mono font-bold ${isHigh ? 'text-rose-600 text-sm' : 'text-slate-800'}`}>
                          {item.totalKgCo2.toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          <button
                             onClick={() => handleStartEdit(item)}
                             className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-all cursor-pointer inline-flex items-center"
                             title="手動覆核修改係數"
                           >
                            <FileEdit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex justify-center">
              <span className="text-[10px] text-slate-400 font-bold tracking-wider">
                檢視第 1 - {filteredBOM.length} 筆工項 • 臺北市政府工務局碳排核定評估平台
              </span>
            </div>
          </section>

          {/* Audit trail comments */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-left">
            <h3 className="text-slate-900 font-bold text-sm tracking-wide border-b border-slate-200 pb-3 mb-5 flex items-center gap-1.5">
              <History className="w-4.5 h-4.5 text-indigo-600" />
              <span>本案稽核意見與操作軌跡</span>
            </h3>

            {/* Live interactive Comment timelines */}
            <div className="space-y-4 max-h-76 overflow-y-auto pr-2 scrollbar-none mb-6">
              {comments.map((comm) => {
                return (
                  <div key={comm.id} className="flex gap-3">
                    {/* Avatar circle bubble */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                      comm.isSystem
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-gradient-to-tr from-[#00356a] to-indigo-600 text-white'
                    }`}>
                      {comm.avatarText}
                    </div>

                    {/* Content text */}
                    <div className={`flex-1 p-3.5 rounded-xl rounded-tl-none border ${
                      comm.isSystem
                        ? 'bg-slate-50 border-slate-200 text-slate-500 font-mono text-[11px]'
                        : 'bg-indigo-50/40 border-indigo-100 text-slate-800 text-xs'
                    }`}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-extrabold text-slate-800">{comm.author}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-medium">
                          {comm.timestamp}
                        </span>
                      </div>
                      <p className="leading-relaxed font-medium">{comm.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input submission Form */}
            <form onSubmit={handlePostComment} className="flex gap-3 pt-4 border-t border-slate-200">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-xs select-none">
                AD
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
                  placeholder="輸入盤查指令、追問意見或核准備忘錄..."
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-slate-200/50 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>

      {/* Row Edit Modal Dialog block */}
      {editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 transition-opacity">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 text-left">
            <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                <span>手動修訂材料盤查係數與數量</span>
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded px-2 py-1 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                <span className="text-[10px] text-indigo-700 font-extrabold uppercase tracking-wide block">目前修改項目</span>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                  [{editingItem.code}] {editingItem.description}
                </p>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                  盤查數量 (輸入格式如: 12,500 m³ 或 850 t)
                </label>
                <input
                  type="text"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                  碳排放係數 (kgCO₂e/單位)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editEf}
                  onChange={(e) => setEditEf(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSaveEditItem}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                套用人工修訂並重新計算
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
