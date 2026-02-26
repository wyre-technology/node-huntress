export * from './common.js';
import type { PaginationParams } from './common.js';

// Account
export interface Account {
  id: number;
  name: string;
  subdomain: string;
  status: string;
  support_type: string;
}

// Actor
export interface Actor {
  reseller: { id: number; name: string } | null;
  account: { id: number; name: string } | null;
  user: User | null;
}

// User
export interface User {
  id: number;
  email: string;
  name: string;
}

// Agent
export interface Agent {
  id: number;
  account_id: number;
  arch: string;
  created_at: string;
  domain_name: string;
  edr_version: string;
  external_ip: string;
  hostname: string;
  defender_policy_status: string;
  defender_status: string;
  defender_substatus: string;
  firewall_status: string;
  ipv4_address: string;
  last_callback_at: string;
  last_survey_at: string;
  mac_addresses: string[];
  service_pack_major: number;
  service_pack_minor: number;
  organization_id: number;
  os: string;
  os_build_version: string;
  os_major: number;
  os_minor: number;
  os_patch: number;
  platform: string;
  serial_number: string;
  tags: string[];
  updated_at: string;
  version: string;
  version_number: string;
  win_build_number: number;
}

// Organization
export interface Organization {
  id: number;
  agents_count: number;
  account_id: number;
  created_at: string;
  incident_reports_count: number;
  key: string;
  logs_sources_count: number;
  identity_provider_tenant_id: string;
  billable_identity_count: number;
  name: string;
  report_recipients: string[];
  sat_learner_count: number;
  updated_at: string;
}

export interface OrganizationCreateParams {
  name: string;
  key: string;
}

export interface OrganizationUpdateParams {
  name?: string;
  key?: string;
  report_recipients?: string[];
}

// Incident Report
export interface IncidentReport {
  id: number;
  account_id: number;
  agent_id: number;
  body: string;
  closed_at: string | null;
  indicator_counts: Record<string, number>;
  indicator_types: string[];
  organization_id: number;
  platform: string;
  remediations: unknown[];
  sent_at: string;
  severity: string;
  status: string;
  status_updated_at: string;
  subject: string;
  summary: string;
  updated_at: string;
}

export interface IncidentReportListParams extends PaginationParams {
  indicator_type?: string;
  status?: string;
  severity?: string;
  platform?: string;
  organization_id?: number;
  agent_id?: number;
}

// Remediation
export interface Remediation {
  id: number;
  type: string;
  action: string;
  parameters: Record<string, unknown>;
  status: string;
  approved_at: string | null;
  approved_by: string | null;
  completed_at: string | null;
}

export interface RemediationListParams extends PaginationParams {
  types?: string[];
  statuses?: string[];
}

export interface RemediationBulkRejectionParams {
  comment: string;
  useful?: boolean;
  name?: string;
  phone_number?: string;
  email?: string;
}

// Escalation
export interface Escalation {
  id: number;
  account: { id: number; name: string };
  organizations: Array<{ id: number; name: string }>;
  created_at: string;
  resolved_at: string | null;
  severity: string;
  status: string;
  type: string;
  updated_at: string;
}

export interface EscalationWithEntities extends Escalation {
  entities: unknown[];
}

export interface EscalationResolutionParams {
  determination?: 'expected' | 'unauthorized';
  scope?: 'account' | 'organization' | 'identity';
}

// Billing Report
export interface BillingReport {
  id: number;
  amount: number;
  created_at: string;
  currency_type: string;
  plan: string;
  quantity: number;
  receipt: string;
  status: string;
  updated_at: string;
}

export interface BillingReportListParams extends PaginationParams {
  status?: string;
}

// Summary Report
export interface SummaryReport {
  id: number;
  agents_count: number;
  analyst_note: string;
  created_at: string;
  incidents_reported: number;
  incidents_resolved: number;
  investigations_completed: number;
  organization_id: number;
  period: string;
  type: string;
  updated_at: string;
  url: string;
  [key: string]: unknown; // Many additional fields
}

export interface SummaryReportListParams extends PaginationParams {
  period_min?: string;
  period_max?: string;
  organization_id?: number;
  type?: string;
}

// Signal
export interface Signal {
  id: number;
  created_at: string;
  details: Record<string, unknown>;
  entity: Record<string, unknown>;
  investigated_at: string | null;
  investigation_context: string | null;
  name: string;
  organization: { id: number; name: string };
  status: string;
  type: string;
  updated_at: string;
}

export interface SignalListParams extends PaginationParams {
  investigated_at_min?: string;
  investigated_at_max?: string;
  entity_type?: string;
  entity_id?: string;
  organization_id?: number;
  types?: string;
  statuses?: string;
}

// Membership
export interface Membership {
  id: number;
  permissions: string;
  account: { id: number; name: string };
  organization: { id: number; name: string } | null;
  user: User;
  created_at: string;
  updated_at: string;
}

export interface MembershipCreateParams {
  email: string;
  first_name: string;
  last_name: string;
  permissions: 'Admin' | 'Security Engineer' | 'User' | 'Read-only' | 'Finance' | 'Marketing';
  organization_id?: number;
}

export interface MembershipUpdateParams {
  permissions: 'Admin' | 'Security Engineer' | 'User' | 'Read-only' | 'Finance' | 'Marketing';
}

// Agent list params
export interface AgentListParams extends PaginationParams {
  organization_id?: number;
  platform?: 'windows' | 'darwin' | 'linux';
}
