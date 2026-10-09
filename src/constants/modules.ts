/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TabType } from '../types';
import {
  LayoutDashboard,
  ClipboardCheck,
  Building2,
  History,
  Users,
  ShieldCheck,
  Settings,
  HelpCircle,
  Database,
  Flame,
  Calculator,
  BarChart3,
  LucideIcon,
} from 'lucide-react';

export interface ModuleConfig {
  id: TabType;
  name: string; // 統一功能模組名稱
  shortName: string; // 簡稱
  description: string; // 模組描述說明
  category: 'core' | 'management' | 'system';
  categoryLabel: string;
  icon: LucideIcon;
}

/**
 * 系統全域統一之功能模組定義清單
 * 依據《臺北市公共工程碳管理系統開發與實證推廣計畫 勞務採購需求說明書》規格全面對齊
 */
export const MODULE_DEFINITIONS: Record<TabType, ModuleConfig> = {
  dashboard: {
    id: 'dashboard',
    name: '工程碳盤查儀表板',
    shortName: '碳盤查儀表板',
    description: '落實2050淨零碳排•即時碳排進度與生命週期額度監控',
    category: 'core',
    categoryLabel: '核心作業模組',
    icon: LayoutDashboard,
  },
  import_mapping: {
    id: 'import_mapping',
    name: 'PCCES 數據智慧配對',
    shortName: 'PCCES 配對',
    description: 'PCCES 預算書批次解析與規則/關鍵字/AI 三模態語意媒合',
    category: 'core',
    categoryLabel: '核心作業模組',
    icon: Database,
  },
  fast_estimation: {
    id: 'fast_estimation',
    name: '快速估算模型驗證',
    shortName: '快速估算模型',
    description: '建築前5、道路前6、人行道前9因子及擴充工項快速計算與盲測校正',
    category: 'core',
    categoryLabel: '核心作業模組',
    icon: Calculator,
  },
  hotspot_analysis: {
    id: 'hotspot_analysis',
    name: '碳排放熱點分析',
    shortName: '碳排熱點分析',
    description: '重大碳排放材料工項排比與生命週期減碳熱點最佳化建議',
    category: 'core',
    categoryLabel: '核心作業模組',
    icon: Flame,
  },
  sop_declaration: {
    id: 'sop_declaration',
    name: '數位申報與審查',
    shortName: '數位申報審查',
    description: '工程材料清冊 (BOM) 線上申報、多角色審核流與3案示範工程試辦',
    category: 'core',
    categoryLabel: '核心作業模組',
    icon: ClipboardCheck,
  },
  unit_groups: {
    id: 'unit_groups',
    name: '參與單位群組管理',
    shortName: '單位群組管理',
    description: '新工處、水利處、公園處、大地處、監造單位與施工廠商名冊',
    category: 'management',
    categoryLabel: '單位與帳號管理',
    icon: Building2,
  },
  user_management: {
    id: 'user_management',
    name: '使用者帳號管理',
    shortName: '使用者帳號',
    description: '設計單位、施工廠商、監造顧問與府內工程單位帳號管理',
    category: 'management',
    categoryLabel: '單位與帳號管理',
    icon: Users,
  },
  role_permissions: {
    id: 'role_permissions',
    name: '角色與權限管理',
    shortName: '角色與權限',
    description: '設計單位申報、廠商填報、工務局/監造單位審查管考權限矩陣',
    category: 'management',
    categoryLabel: '單位與帳號管理',
    icon: ShieldCheck,
  },
  audit_logs: {
    id: 'audit_logs',
    name: '系統稽核日誌',
    shortName: '系統稽核日誌',
    description: '系統登入、資料調校、審核簽核與安全稽核軌跡歷程紀錄',
    category: 'management',
    categoryLabel: '單位與帳號管理',
    icon: History,
  },
  project_plan: {
    id: 'project_plan',
    name: '計畫期程與經費管考',
    shortName: '期程與經費管考',
    description: '600日曆天雙年度執行進度與450萬元五大經費項目配置管考',
    category: 'management',
    categoryLabel: '單位與帳號管理',
    icon: BarChart3,
  },
  settings: {
    id: 'settings',
    name: '系統參數設定',
    shortName: '系統參數設定',
    description: '本土化碳排係數庫動態更新維護、環境部/內政部同步與門檻設定',
    category: 'system',
    categoryLabel: '系統維運與支援',
    icon: Settings,
  },
  support: {
    id: 'support',
    name: '申報支援與諮詢',
    shortName: '支援與諮詢',
    description: '施工階段碳盤查申報 SOP、審查手冊、3 場教育訓練宣導與諮詢',
    category: 'system',
    categoryLabel: '系統維運與支援',
    icon: HelpCircle,
  },
};

export const CORE_MODULES: TabType[] = [
  'dashboard',
  'import_mapping',
  'fast_estimation',
  'hotspot_analysis',
  'sop_declaration',
];

export const MANAGEMENT_MODULES: TabType[] = [
  'unit_groups',
  'user_management',
  'role_permissions',
  'audit_logs',
  'project_plan',
];

export const SYSTEM_MODULES: TabType[] = [
  'settings',
  'support',
];
