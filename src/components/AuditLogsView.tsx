/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AuditLogItem } from '../types';
import { MODULE_DEFINITIONS } from '../constants/modules';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Download,
  Trash2,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface AuditLogsViewProps {
  auditLogs: AuditLogItem[];
  setAuditLogs: (logs: AuditLogItem[]) => void;
}

export default function AuditLogsView({ auditLogs, setAuditLogs }: AuditLogsViewProps) {
  const [operatorSearch, setOperatorSearch] = useState('');
  const [actionSearch, setActionSearch] = useState('');
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'fail'>('all');
  const [exportNotice, setExportNotice] = useState(false);

  // Handle clearing all logs (or resetting to original)
  const handleClearLogs = () => {
    setAuditLogs([]);
  };

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => {
      setExportNotice(false);
    }, 4000);
  };

  // Filter conditions
  const filteredLogs = auditLogs.filter((log) => {
    const matchesOperator =
      log.operator.toLowerCase().includes(operatorSearch.toLowerCase()) ||
      log.userId.toLowerCase().includes(operatorSearch.toLowerCase());
    const matchesAction = log.action.toLowerCase().includes(actionSearch.toLowerCase());
    const matchesDept = log.department.toLowerCase().includes(departmentSearch.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'success' && log.success) ||
      (statusFilter === 'fail' && !log.success);

    return matchesOperator && matchesAction && matchesDept && matchesStatus;
  });

  const meta = MODULE_DEFINITIONS.audit_logs;

  return (
    <div className="space-y-6 font-sans">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {meta.name}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1.5 tracking-wider">
            {meta.description}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>匯出稽核報表</span>
          </button>
          <button
            onClick={handleClearLogs}
            className="px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>清除當前日誌記錄</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>稽核報表已彙編成冊，並建立安全加密檔供市府政風與資安小組調閱。</span>
        </div>
      )}

      {/* Advanced Filter Panel widget */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-left">
        <h3 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Filter className="w-4 h-4" />
          <span>稽核條件進階篩選</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Operator */}
          <div>
            <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
              操作人員 / 帳號
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                value={operatorSearch}
                onChange={(e) => setOperatorSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                placeholder="林雅婷、USR-8821..."
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
              所屬局處 / 科室部門
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                value={departmentSearch}
                onChange={(e) => setDepartmentSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                placeholder="環境保護局、工務局..."
              />
            </div>
          </div>

          {/* Operation Action */}
          <div>
            <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
              操作動作說明
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                value={actionSearch}
                onChange={(e) => setActionSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                placeholder="匯出專案、手動配對、備份..."
              />
            </div>
          </div>

          {/* Completion status */}
          <div>
            <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
              執行結果狀態
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white cursor-pointer"
            >
              <option value="all">顯示全部日誌</option>
              <option value="success">限成功項目</option>
              <option value="fail">限失敗項目</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main logs list table */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-left flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-extrabold tracking-widest uppercase">
                <th className="p-4 pl-6 w-44">操作時間</th>
                <th className="p-4 w-40">操作人員與帳號</th>
                <th className="p-4 w-44">執行機關 / 科室部門</th>
                <th className="p-4">系統操作詳細歷程紀錄</th>
                <th className="p-3 w-36">來源 IP 位址</th>
                <th className="p-3 text-center w-28">檢定結果</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 text-slate-800">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 font-mono font-semibold text-slate-500 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {log.timestamp}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                        {log.operator}
                        <span className="block font-mono font-semibold text-[10px] text-slate-400 mt-0.5">
                          {log.userId}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-600 whitespace-nowrap">
                        {log.department}
                      </td>
                      <td className="p-4 font-semibold text-slate-800 break-words max-w-xs md:max-w-md lg:max-w-lg">
                        {log.action}
                        {!log.success && log.failReason && (
                          <span className="block text-[10px] text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-100 mt-1 inline-block">
                            錯誤原因：{log.failReason}
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-slate-500 whitespace-nowrap">{log.ip}</td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {log.success ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-100">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            成功
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-rose-100">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            失敗
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400 font-bold">
                    查無與此篩選條件相符之系統安全稽核日誌
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
          當前顯示軌跡： {filteredLogs.length} 筆 / 歷史積算共 {auditLogs.length} 筆日誌
        </div>
      </section>
    </div>
  );
}
