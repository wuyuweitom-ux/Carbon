/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TabType =
  | 'dashboard'
  | 'import_mapping'
  | 'fast_estimation'
  | 'hotspot_analysis'
  | 'sop_declaration'
  | 'unit_groups'
  | 'user_management'
  | 'role_permissions'
  | 'audit_logs'
  | 'project_plan'
  | 'settings'
  | 'support';

export interface FastEstimationFactor {
  id: string;
  name: string;
  unit: string;
  defaultEf: number;
  weight: number; // 碳排佔比權重 %
  inputQuantity: number;
  calculatedEmission: number;
}

export interface EstimationModel {
  category: 'building' | 'road' | 'sidewalk' | 'bridge' | 'water' | 'park' | 'sewer';
  name: string;
  stage: '前期已建置' | '本期深化擴充';
  factorCount: number;
  blindTestSamples: number;
  accuracyRate: number;
  description: string;
  factors: FastEstimationFactor[];
}

export interface BudgetExecutionItem {
  id: number;
  name: string;
  allocatedAmount: number;
  spentAmount: number;
  progressPercent: number;
  description: string;
}

export interface PilotProjectItem {
  id: string;
  name: string;
  agency: '新工處' | '水利處' | '公園處' | '大地處';
  status: '輔導填報中' | '模型盲測驗證' | '審查簽准核可';
  pccesImported: boolean;
  baselineCo2: number;
  reducedCo2: number;
  contractor: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  type: string;
  location: string;
  scaleSqm: number;
  status: 'In Progress' | 'Completed' | 'Pending';
  estimatedCo2: number;
  totalBudgetCo2: number;
}

export interface WorkflowStep {
  id: number;
  name: string;
  enName: string;
  status: 'done' | 'active' | 'pending';
  updatedAt?: string;
  operator?: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  type: 'nlp' | 'upload' | 'system' | 'edit' | 'download';
}

export interface AutomatedCheck {
  id: string;
  severity: 'critical' | 'deviation';
  title: string;
  description: string;
  bomLink?: boolean;
}

export interface CustomBOMItem {
  id: string;
  code: string;
  description: string;
  quantity: string;
  efValue: number;
  totalKgCo2: number;
  status: 'high_emission' | 'manually_adjusted' | 'standard';
  hasWarning?: boolean;
}

export interface CommentItem {
  id: string;
  author: string;
  avatarText: string;
  role: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface UnitGroupItem {
  id: string;
  name: string;
  taxId: string;
  category: 'Government' | 'Consultant' | 'Construction';
  contactPerson: string;
  phone: string;
  activeProjects: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  operator: string;
  userId: string;
  department: string;
  action: string;
  ip: string;
  success: boolean;
  failReason?: string;
}

export interface UserAccountItem {
  id: string;
  name: string;
  email: string;
  dept: string;
  role: string;
  status: 'Active' | 'Pending' | 'Disabled';
  lastLogin: string;
}
