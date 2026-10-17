/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TabType } from '../types';
import {
  MODULE_DEFINITIONS,
  CORE_MODULES,
  MANAGEMENT_MODULES,
  SYSTEM_MODULES,
} from '../constants/modules';
import {
  UserCheck,
  LogOut,
  Layers,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAddUser: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenAddUser,
  isOpenMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const handleItemClick = (key: TabType) => {
    setActiveTab(key);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleOpenAddUser = () => {
    onOpenAddUser();
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderNavContent = (isMobile: boolean) => (
    <>
      <div className="flex flex-col min-h-0 flex-1">
        {/* Branding header section */}
        <div className="flex items-center justify-between mb-4 px-2 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[15px] font-black leading-tight text-slate-900 tracking-tight">
                臺北市政府工程碳管理系統
              </h1>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5 tracking-wider">
                公共工程碳盤查平台 • 115年度
              </p>
            </div>
          </div>
          {isMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="關閉選單"
              aria-label="關閉選單"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dynamic CTA button */}
        <button
          onClick={handleOpenAddUser}
          className="mx-1 mb-4 bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 transition-all duration-150 rounded-lg py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>新增盤查使用者帳號</span>
        </button>

        {/* Navigation list grouped cleanly by civic responsibility */}
        <nav className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none text-left">
          {/* Group 1: 核心作業模組 */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              核心作業模組
            </div>
            <div className="flex flex-col gap-0.5">
              {CORE_MODULES.map((key) => {
                const item = MODULE_DEFINITIONS[key];
                const Icon = item.icon;
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleItemClick(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs translate-x-1'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50 font-semibold'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 2: 單位與帳號管理 */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              單位與帳號管理
            </div>
            <div className="flex flex-col gap-0.5">
              {MANAGEMENT_MODULES.map((key) => {
                const item = MODULE_DEFINITIONS[key];
                const Icon = item.icon;
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleItemClick(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs translate-x-1'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50 font-semibold'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 3: 系統維運與支援 */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              系統維運與支援
            </div>
            <div className="flex flex-col gap-0.5">
              {SYSTEM_MODULES.map((key) => {
                const item = MODULE_DEFINITIONS[key];
                const Icon = item.icon;
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleItemClick(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs translate-x-1'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50 font-semibold'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Footer Nav and Logged-in admin card */}
      <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 shrink-0">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-sm">
            <img
              alt="公務登錄使用者頭像"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1PP9odyGm-wTRWLRkpIaGZxUFKEzM_YxQK5My2PCKkHHzTJPgHiQSPerlL20oLu5UV0hFs2dd8HdoNhoWMJydqh9gapB8AsR37QW6Ekopyi6EhUtW6cA2UKZSupqP5Xa9Mg-yosw4LTH_YO1QWaXu_DJXg28F4TZtO0RCwf1bycVMG_uMmU-O086iiGzs15hAeXMyrIkbVz7mMtcSaMZjsJVH-hATfvmqC0FTHYBV4JhGJ4wu4pNNB4kru59elgXSqNqDiYcVTgQJ"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-800 leading-none truncate">
              林科長
            </span>
            <span className="text-[10px] text-slate-500 font-semibold leading-none mt-1 truncate">
              臺北市工務局管理科
            </span>
          </div>
          <button className="ml-auto text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-1 rounded-md transition-colors" title="安全登出系統">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen w-76 fixed left-0 top-0 bg-white border-r border-slate-200 p-4 text-[#1e293b] select-none z-20 shadow-sm justify-between font-sans">
        {renderNavContent(false)}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 flex flex-col p-4 text-[#1e293b] select-none shadow-2xl justify-between font-sans transition-transform duration-300 ease-in-out lg:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="行動版功能選單"
      >
        {renderNavContent(true)}
      </aside>
    </>
  );
}

