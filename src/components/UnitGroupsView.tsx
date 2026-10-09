/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { UnitGroupItem } from '../types';
import { MODULE_DEFINITIONS } from '../constants/modules';
import {
  Building,
  UserCheck,
  PhoneCall,
  Search,
  Plus,
  ShieldCheck,
  Building2Icon,
} from 'lucide-react';

interface UnitGroupsViewProps {
  unitGroups: UnitGroupItem[];
  setUnitGroups: (groups: UnitGroupItem[]) => void;
}

export default function UnitGroupsView({ unitGroups, setUnitGroups }: UnitGroupsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Government' | 'Consultant' | 'Construction'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New unit fields
  const [newName, setNewName] = useState('');
  const [newTaxId, setNewTaxId] = useState('');
  const [newCategory, setNewCategory] = useState<'Government' | 'Consultant' | 'Construction'>('Government');
  const [newContact, setNewContact] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newProjects, setNewProjects] = useState(0);

  // Stats computation dynamically of current database lists
  const countGov = unitGroups.filter((u) => u.category === 'Government').length;
  const countConsultant = unitGroups.filter((u) => u.category === 'Consultant').length;
  const countConstruction = unitGroups.filter((u) => u.category === 'Construction').length;

  // Add new unit organization block
  const handleAddNewUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTaxId.trim()) return;

    const newUnit: UnitGroupItem = {
      id: `unit-${Date.now()}`,
      name: newName,
      taxId: newTaxId,
      category: newCategory,
      contactPerson: newContact,
      phone: newPhone,
      activeProjects: Number(newProjects),
    };

    setUnitGroups([newUnit, ...unitGroups]);

    // Resets Form
    setNewName('');
    setNewTaxId('');
    setNewContact('');
    setNewPhone('');
    setNewProjects(0);
    setShowAddModal(false);
  };

  // Filter unit lists dynamically
  const filteredUnits = unitGroups.filter((unit) => {
    const matchesCategory = selectedCategory === 'all' || unit.category === selectedCategory;
    const matchesSearch =
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.taxId.includes(searchQuery) ||
      unit.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Platform Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {MODULE_DEFINITIONS.unit_groups.name}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1.5 tracking-wider">
            {MODULE_DEFINITIONS.unit_groups.description}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>註冊新申報單位</span>
        </button>
      </div>

      {/* Top 3 Metric widgets bento layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Gov */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition-all duration-300">
          <div className="text-left font-sans">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">機關監理單位</span>
            <span className="text-3xl font-mono font-black text-indigo-600 mt-1 block">
              {countGov} <span className="text-xs font-semibold text-slate-400">處</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">包含臺北市政府各局處工程單位</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm shrink-0">
            <Building className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Consultant */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition-all duration-300">
          <div className="text-left font-sans">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">顧問監造單位</span>
            <span className="text-3xl font-mono font-black text-indigo-600 mt-1 block">
              {countConsultant} <span className="text-xs font-semibold text-slate-400">所</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">涵蓋專業世曦、中興工程顧問機構</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#f5f3ff] text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Construction */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition-all duration-300">
          <div className="text-left font-sans">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">營造承攬廠商</span>
            <span className="text-3xl font-mono font-black text-rose-600 mt-1 block">
              {countConstruction} <span className="text-xs font-semibold text-slate-400">家</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">依標案登錄之施工承攬特約廠商</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm shrink-0">
            <Building2Icon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main split interactive lists with table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-left flex flex-col">
        {/* Controls Bar */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/55 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Category Tabs */}
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-lg">
            {(['all', 'Government', 'Consultant', 'Construction'] as const).map((cat) => {
              const labelMap = {
                all: '顯示全部',
                Government: '機關單位',
                Consultant: '顧問監造',
                Construction: '營造廠商',
              };
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {labelMap[cat]}
                </button>
              );
            })}
          </div>

          {/* Table Search query layout */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
              placeholder="搜尋單位名稱、統一編號、窗口..."
            />
          </div>
        </div>

        {/* Units structural list table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-extrabold tracking-widest uppercase">
                <th className="p-4 pl-6">參與機構 / 單位名稱</th>
                <th className="p-4">統一編號</th>
                <th className="p-4">群組類別</th>
                <th className="p-4">專案負責窗口</th>
                <th className="p-3.5">聯絡專線</th>
                <th className="p-4 text-center">承攬進行中專案</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 text-slate-800">
              {filteredUnits.length > 0 ? (
                filteredUnits.map((unit) => {
                  const getCatBadge = () => {
                    switch (unit.category) {
                      case 'Government':
                        return 'bg-amber-100 text-amber-800 border border-amber-200';
                      case 'Consultant':
                        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
                      default:
                        return 'bg-rose-100 text-rose-800 border border-rose-200';
                    }
                  };

                  const getCatLabel = (category: string) => {
                    switch (category) {
                      case 'Government':
                        return '機關單位';
                      case 'Consultant':
                        return '顧問監造';
                      case 'Construction':
                        return '營造廠商';
                      default:
                        return category;
                    }
                  };

                  return (
                    <tr key={unit.id} className="hover:bg-[#f8f9ff]/80 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-900">{unit.name}</td>
                      <td className="p-4 font-mono font-semibold text-slate-600">{unit.taxId}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${getCatBadge()}`}>
                          {getCatLabel(unit.category)}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{unit.contactPerson}</td>
                      <td className="p-3.5 font-mono text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <PhoneCall className="w-3 h-3 text-slate-400" />
                          {unit.phone}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-slate-700 font-mono font-bold">
                          {unit.activeProjects} 件
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    查無符合此條件的註冊機關或單位組織
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-150 bg-slate-50 flex justify-center text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
          已註冊總部帳號之參與組織共 {filteredUnits.length} / {unitGroups.length} 家
        </div>
      </div>

      {/* Add New Unit Modal Dialogue Setup */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 transition-opacity">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 text-left">
            <form onSubmit={handleAddNewUnit}>
              <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
                <h3 className="text-sm font-extrabold flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span>註冊全新參與或承攬申報單位</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded px-2 py-1 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    機構或單位全稱
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800 placeholder-slate-400"
                    placeholder="例如: 臺北營造實業工程股份有限公司"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                      統一編號 (8 碼)
                    </label>
                    <input
                      type="text"
                      required
                      value={newTaxId}
                      onChange={(e) => setNewTaxId(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                      placeholder="8位數統編"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                      單位類別
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white cursor-pointer text-slate-800"
                    >
                      <option value="Government">機關單位 (政府局處)</option>
                      <option value="Consultant">顧問監造 (監造單位)</option>
                      <option value="Construction">營造廠商 (承攬合約商)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                      專案窗口主管
                    </label>
                    <input
                      type="text"
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                      placeholder="例如: 林建邦 經理"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                      聯絡專線 / 電話
                    </label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                      placeholder="02-2345-6789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    承攬中公共工程專案數量
                  </label>
                  <input
                    type="number"
                    value={newProjects}
                    onChange={(e) => setNewProjects(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer"
                >
                  送出登記
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
