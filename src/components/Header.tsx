/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Bell, HelpCircle, Menu } from 'lucide-react';

interface HeaderProps {
  title?: string;
  categoryLabel?: string;
  searchWord: string;
  setSearchWord: (word: string) => void;
  placeholderText?: string;
  onOpenMobileMenu?: () => void;
}

export default function Header({
  title = '工程碳盤查儀表板',
  categoryLabel,
  searchWord,
  setSearchWord,
  placeholderText = '搜尋專案名稱、工項編碼、材料或承攬單位...',
  onOpenMobileMenu,
}: HeaderProps) {
  return (
    <header className="bg-white flex justify-between items-center w-full px-3 md:px-8 h-16 border-b border-slate-200 sticky top-0 z-10 shadow-xs font-sans shrink-0">
      {/* Title block with mobile hamburger button */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          title="開啟系統功能選單"
          aria-label="開啟系統功能選單"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 truncate">
          <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-900 leading-tight tracking-tight truncate">
            {title}
          </h2>
          {categoryLabel && (
            <span className="hidden sm:inline-block text-[11px] text-slate-400 font-bold">
              • {categoryLabel}
            </span>
          )}
        </div>
        <span className="hidden md:inline-block h-3.5 w-[1px] bg-slate-200"></span>
        <span className="hidden md:inline-block text-[11px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-100 shrink-0">
          臺北市公共工程 • 115年度適用
        </span>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-sm mx-4 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-100 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white border border-slate-200 transition-all"
            placeholder={placeholderText}
          />
        </div>
      </div>

      {/* Right icons & profile snapshot */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notifications */}
        <button className="relative text-slate-500 hover:bg-slate-50 rounded-full p-2 hover:text-indigo-600 transition-all cursor-pointer" title="系統訊息通知">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
        </button>

        {/* Support help */}
        <button className="text-slate-500 hover:bg-slate-50 rounded-full p-2 hover:text-indigo-600 transition-all cursor-pointer sm:block hidden" title="申報作業說明與常見問題">
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Little Divider */}
        <span className="h-5 w-[1px] bg-slate-200"></span>

        {/* Profile Snapshot circle */}
        <div className="flex items-center gap-2 pl-1 select-none">
          <img
            alt="公務人員頭像"
            className="w-8 h-8 rounded-full border border-slate-200 shadow-sm object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1PP9odyGm-wTRWLRkpIaGZxUFKEzM_YxQK5My2PCKkHHzTJPgHiQSPerlL20oLu5UV0hFs2dd8HdoNhoWMJydqh9gapB8AsR37QW6Ekopyi6EhUtW6cA2UKZSupqP5Xa9Mg-yosw4LTH_YO1QWaXu_DJXg28F4TZtO0RCwf1bycVMG_uMmU-O086iiGzs15hAeXMyrIkbVz7mMtcSaMZjsJVH-hATfvmqC0FTHYBV4JhGJ4wu4pNNB4kru59elgXSqNqDiYcVTgQJ"
          />
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-[11px] font-bold text-slate-800 leading-none">林科長</span>
            <span className="text-[9px] text-indigo-600 font-semibold mt-0.5">工務局管理科</span>
          </div>
        </div>
      </div>
    </header>
  );
}
