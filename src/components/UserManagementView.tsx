/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserAccountItem } from '../types';
import { MODULE_DEFINITIONS } from '../constants/modules';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  UserCheck,
  XOctagon,
  Trash2,
  Mail,
  Check,
} from 'lucide-react';

interface UserManagementViewProps {
  users: UserAccountItem[];
  setUsers: (users: UserAccountItem[]) => void;
  showAddUserModal: boolean;
  setShowAddUserModal: (show: boolean) => void;
}

export default function UserManagementView({
  users,
  setUsers,
  showAddUserModal,
  setShowAddUserModal,
}: UserManagementViewProps) {
  const [searchWord, setSearchWord] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserDept, setNewUserDept] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserStatus, setNewUserStatus] = useState<'Active' | 'Pending' | 'Disabled'>('Active');

  // Calculates sub-totals of accounts dynamically
  const numTotal = users.length;
  const numGov = users.filter((u) => u.email.endsWith('.gov.tw')).length;
  const numExternal = users.filter((u) => !u.email.endsWith('.gov.tw')).length;
  const numPending = users.filter((u) => u.status === 'Pending').length;

  // Handles adding new user account dynamically
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: UserAccountItem = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      dept: newUserDept || '申報代填約聘商',
      role: newUserRole || '填報經辦員',
      status: newUserStatus,
      lastLogin: '-',
    };

    setUsers([newUser, ...users]);

    // Resets Modal Form state
    setNewUserName('');
    setNewUserEmail('');
    setNewUserDept('');
    setNewUserRole('');
    setNewUserStatus('Active');
    setShowAddUserModal(false);
  };

  // Switch status of account instantly
  const handleToggleStatus = (userId: string, nextStatus: 'Active' | 'Pending' | 'Disabled') => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updated);
  };

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Remove account safely without window.confirm
  const handleDeleteUser = (userId: string, userName: string) => {
    setUsers(users.filter((u) => u.id !== userId));
    setActionNotice(`已移除使用者「${userName}」的專案申報與稽查授權。`);
    setTimeout(() => {
      setActionNotice(null);
    }, 4000);
  };

  // Filter accounts
  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchWord.toLowerCase()) ||
      u.email.toLowerCase().includes(searchWord.toLowerCase()) ||
      u.dept.toLowerCase().includes(searchWord.toLowerCase()) ||
      u.role.toLowerCase().includes(searchWord.toLowerCase())
    );
  });

  const meta = MODULE_DEFINITIONS.user_management;

  return (
    <div className="space-y-6 font-sans">
      {/* Title Controls Header */}
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
          onClick={() => setShowAddUserModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>建立新帳號</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-lg flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top micro bento indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 relative overflow-hidden text-left flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">經管總帳號數</span>
            <span className="text-2xl font-mono font-black text-slate-950 mt-1 block">
              {numTotal} <span className="text-xs font-semibold text-slate-400">個</span>
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 shrink-0">
            <Users className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 relative overflow-hidden text-left flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">市府機關帳號</span>
            <span className="text-2xl font-mono font-black text-indigo-600 mt-1 block">
              {numGov} <span className="text-xs font-semibold text-slate-400">個</span>
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100 shrink-0">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 relative overflow-hidden text-left flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">外部特約申報</span>
            <span className="text-2xl font-mono font-black text-indigo-600 mt-1 block">
              {numExternal} <span className="text-xs font-semibold text-slate-400">個</span>
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
            <UserCheck className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 relative overflow-hidden text-left flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">等待核准起用</span>
            <span className="text-2xl font-mono font-black text-amber-600 mt-1 block">
              {numPending} <span className="text-xs font-semibold text-slate-400">處</span>
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
            <XOctagon className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* Main split user cards list and table */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden text-left flex flex-col">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-slate-900 font-bold text-sm tracking-wide">使用者權限核可狀態與控制清單</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">管理臺北市公共工程碳盤查填報、審計監造、終審主管帳號之白名單授權。</p>
          </div>

          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
              placeholder="搜尋姓名、信箱、科室部門..."
            />
          </div>
        </div>

        {/* User raw tables */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-extrabold tracking-widest uppercase">
                <th className="p-4 pl-6">使用者姓名</th>
                <th className="p-4">公務電子郵件 / 帳號</th>
                <th className="p-4">所屬機關與科室</th>
                <th className="p-4">角色權限</th>
                <th className="p-4">最後登入時間</th>
                <th className="p-3 text-center">狀態</th>
                <th className="p-4 text-center w-28">操作管理</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 text-slate-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name with initials bubble avatar */}
                      <td className="p-4 pl-6 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm border border-indigo-100">
                            {u.name.substring(0, 1)}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 font-mono font-medium text-indigo-600 md:max-w-xs truncate">
                        <span className="inline-flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {u.email}
                        </span>
                      </td>

                      {/* Bureau / department */}
                      <td className="p-4 font-semibold text-slate-700">{u.dept}</td>

                      {/* Role code */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded text-[10px]">
                          {u.role}
                        </span>
                      </td>

                      {/* Last Login timestamp */}
                      <td className="p-4 font-mono text-slate-400 font-semibold">{u.lastLogin}</td>

                      {/* Status dot feedback */}
                      <td className="p-3 text-center">
                        {u.status === 'Active' && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-150">
                            啟用中
                          </span>
                        )}
                        {u.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-150 animate-pulse">
                            待審核
                          </span>
                        )}
                        {u.status === 'Disabled' && (
                          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 px-2 py-0.5 rounded text-[10px] font-bold border border-rose-150">
                            已停用
                          </span>
                        )}
                      </td>

                      {/* Toggle status gates buttons layout */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {u.status !== 'Active' ? (
                            <button
                              onClick={() => handleToggleStatus(u.id, 'Active')}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded border border-emerald-250 cursor-pointer"
                              title="批准啟用"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(u.id, 'Disabled')}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded border border-rose-250 cursor-pointer"
                              title="中止權限"
                            >
                              <XOctagon className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded cursor-pointer"
                            title="移除帳號"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400 font-bold">
                    沒有符合篩選詞的使用者帳號
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-150 bg-slate-50 flex justify-center text-[10px] text-slate-400 font-extrabold tracking-wider">
          已連線市府全域 API 與目錄服務之登錄帳號共 {filteredUsers.length} / {users.length} 筆
        </div>
      </section>

      {/* Show Add User Modal Dialogue block */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 transition-opacity">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 text-left">
            <form onSubmit={handleCreateUser}>
              <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
                <h3 className="text-sm font-extrabold flex items-center gap-2">
                  <UserCheck className="w-4.5 h-4.5" />
                  <span>新增盤查使用者與申報管理員帳戶</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded px-2 py-1 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    使用者真實姓名
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800 placeholder-slate-400"
                    placeholder="請輸入中文姓名"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    公務電子郵件 / 帳號 (機關單位請使用 .gov.tw 結尾)
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                    placeholder="name@gov.taipei 或 external@corp.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                      所屬機關 / 局處科室名稱
                    </label>
                    <input
                      type="text"
                      value={newUserDept}
                      onChange={(e) => setNewUserDept(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                      placeholder="工務局 - 管理科..."
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                      系統職責角色
                    </label>
                    <input
                      type="text"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                      placeholder="市府稽核工程師..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    初始帳號狀態
                  </label>
                  <select
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value as any)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white cursor-pointer text-slate-800"
                  >
                    <option value="Active">直接啟用 (寄發系統憑證)</option>
                    <option value="Pending">待主管審核 (待二次批覆)</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer"
                >
                  確認建立帳號
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
