interface PaginationParams {
    limit?: number;
    page_token?: string;
}
interface Pagination {
    next_page_token?: string;
    next_page_url?: string;
}
interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
}
interface HuntressClientConfig {
    apiKey: string;
    apiSecret: string;
    baseUrl?: string;
    maxRetries?: number;
    rateLimitPerMinute?: number;
}

interface Account {
    id: number;
    name: string;
    subdomain: string;
    status: string;
    support_type: string;
}
interface Actor {
    reseller: {
        id: number;
        name: string;
    } | null;
    account: {
        id: number;
        name: string;
    } | null;
    user: User | null;
}
interface User {
    id: number;
    email: string;
    name: string;
}
interface Agent {
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
interface Organization {
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
interface OrganizationCreateParams {
    name: string;
    key: string;
}
interface OrganizationUpdateParams {
    name?: string;
    key?: string;
    report_recipients?: string[];
}
interface IncidentReport {
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
interface IncidentReportListParams extends PaginationParams {
    indicator_type?: string;
    status?: string;
    severity?: string;
    platform?: string;
    organization_id?: number;
    agent_id?: number;
}
interface Remediation {
    id: number;
    type: string;
    action: string;
    parameters: Record<string, unknown>;
    status: string;
    approved_at: string | null;
    approved_by: string | null;
    completed_at: string | null;
}
interface RemediationListParams extends PaginationParams {
    types?: string[];
    statuses?: string[];
}
interface RemediationBulkRejectionParams {
    comment: string;
    useful?: boolean;
    name?: string;
    phone_number?: string;
    email?: string;
}
interface Escalation {
    id: number;
    account: {
        id: number;
        name: string;
    };
    organizations: Array<{
        id: number;
        name: string;
    }>;
    created_at: string;
    resolved_at: string | null;
    severity: string;
    status: string;
    type: string;
    updated_at: string;
}
interface EscalationWithEntities extends Escalation {
    entities: unknown[];
}
interface EscalationResolutionParams {
    determination?: 'expected' | 'unauthorized';
    scope?: 'account' | 'organization' | 'identity';
}
interface BillingReport {
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
interface BillingReportListParams extends PaginationParams {
    status?: string;
}
interface SummaryReport {
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
    [key: string]: unknown;
}
interface SummaryReportListParams extends PaginationParams {
    period_min?: string;
    period_max?: string;
    organization_id?: number;
    type?: string;
}
interface Signal {
    id: number;
    created_at: string;
    details: Record<string, unknown>;
    entity: Record<string, unknown>;
    investigated_at: string | null;
    investigation_context: string | null;
    name: string;
    organization: {
        id: number;
        name: string;
    };
    status: string;
    type: string;
    updated_at: string;
}
interface SignalListParams extends PaginationParams {
    investigated_at_min?: string;
    investigated_at_max?: string;
    entity_type?: string;
    entity_id?: string;
    organization_id?: number;
    types?: string;
    statuses?: string;
}
interface Membership {
    id: number;
    permissions: string;
    account: {
        id: number;
        name: string;
    };
    organization: {
        id: number;
        name: string;
    } | null;
    user: User;
    created_at: string;
    updated_at: string;
}
interface MembershipCreateParams {
    email: string;
    first_name: string;
    last_name: string;
    permissions: 'Admin' | 'Security Engineer' | 'User' | 'Read-only' | 'Finance' | 'Marketing';
    organization_id?: number;
}
interface MembershipUpdateParams {
    permissions: 'Admin' | 'Security Engineer' | 'User' | 'Read-only' | 'Finance' | 'Marketing';
}
interface AgentListParams extends PaginationParams {
    organization_id?: number;
    platform?: 'windows' | 'darwin' | 'linux';
}

declare class RateLimiter {
    private timestamps;
    private readonly maxRequests;
    private readonly windowMs;
    constructor(maxRequests?: number, windowMs?: number);
    acquire(): Promise<void>;
}

interface HttpClientConfig {
    baseUrl: string;
    apiKey: string;
    apiSecret: string;
    maxRetries: number;
    rateLimiter: RateLimiter;
}
interface RequestOptions {
    method?: string;
    params?: Record<string, unknown>;
    body?: unknown;
}
declare class HttpClient {
    private readonly baseUrl;
    private readonly authHeader;
    private readonly maxRetries;
    private readonly rateLimiter;
    constructor(config: HttpClientConfig);
    request<T>(path: string, options?: RequestOptions): Promise<T>;
}

declare class AccountsResource {
    private readonly http;
    constructor(http: HttpClient);
    get(): Promise<Account>;
}

declare class ActorResource {
    private readonly http;
    constructor(http: HttpClient);
    get(): Promise<Actor>;
}

declare class AgentsResource {
    private readonly http;
    constructor(http: HttpClient);
    list(params?: AgentListParams): Promise<{
        agents: Agent[];
        pagination: Pagination;
    }>;
    get(id: number): Promise<Agent>;
}

declare class OrganizationsResource {
    private readonly http;
    constructor(http: HttpClient);
    list(params?: PaginationParams): Promise<{
        organizations: Organization[];
        pagination: Pagination;
    }>;
    get(id: number): Promise<Organization>;
    create(data: OrganizationCreateParams): Promise<Organization>;
    update(id: number, data: OrganizationUpdateParams): Promise<Organization>;
    delete(id: number): Promise<void>;
}

declare class IncidentReportsResource {
    private readonly http;
    constructor(http: HttpClient);
    list(params?: IncidentReportListParams): Promise<{
        incident_reports: IncidentReport[];
        pagination: Pagination;
    }>;
    get(id: number): Promise<IncidentReport>;
    resolve(id: number): Promise<void>;
    listRemediations(incidentReportId: number, params?: RemediationListParams): Promise<{
        remediations: Remediation[];
        pagination: Pagination;
    }>;
    getRemediation(incidentReportId: number, remediationId: number): Promise<Remediation>;
    bulkApproveRemediations(incidentReportId: number): Promise<void>;
    bulkRejectRemediations(incidentReportId: number, params: RemediationBulkRejectionParams): Promise<void>;
}

declare class EscalationsResource {
    private readonly http;
    constructor(http: HttpClient);
    list(params?: PaginationParams): Promise<{
        escalations: Escalation[];
        pagination: Pagination;
    }>;
    get(id: number): Promise<EscalationWithEntities>;
    resolve(id: number, params?: EscalationResolutionParams): Promise<void>;
}

declare class BillingReportsResource {
    private readonly http;
    constructor(http: HttpClient);
    list(params?: BillingReportListParams): Promise<{
        billing_reports: BillingReport[];
        pagination: Pagination;
    }>;
    get(id: number): Promise<BillingReport>;
}

declare class SummaryReportsResource {
    private readonly http;
    constructor(http: HttpClient);
    list(params?: SummaryReportListParams): Promise<{
        reports: SummaryReport[];
        pagination: Pagination;
    }>;
    get(id: number): Promise<SummaryReport>;
}

declare class SignalsResource {
    private readonly http;
    constructor(http: HttpClient);
    list(params?: SignalListParams): Promise<{
        signals: Signal[];
        pagination: Pagination;
    }>;
    get(id: number): Promise<Signal>;
}

declare class MembershipsResource {
    private readonly http;
    constructor(http: HttpClient);
    list(params?: PaginationParams & {
        organization_id?: number;
    }): Promise<{
        memberships: Membership[];
        pagination: Pagination;
    }>;
    get(id: number): Promise<Membership>;
    create(data: MembershipCreateParams): Promise<Membership>;
    update(id: number, data: MembershipUpdateParams): Promise<Membership>;
    delete(id: number): Promise<void>;
}

declare class HuntressClient {
    readonly accounts: AccountsResource;
    readonly actor: ActorResource;
    readonly agents: AgentsResource;
    readonly organizations: OrganizationsResource;
    readonly incidentReports: IncidentReportsResource;
    readonly escalations: EscalationsResource;
    readonly billingReports: BillingReportsResource;
    readonly summaryReports: SummaryReportsResource;
    readonly signals: SignalsResource;
    readonly memberships: MembershipsResource;
    constructor(config: HuntressClientConfig);
}

declare class HuntressError extends Error {
    statusCode: number;
    response: unknown;
    constructor(message: string, statusCode: number, response: unknown);
}
declare class AuthenticationError extends HuntressError {
    constructor(message: string, response: unknown);
}
declare class ForbiddenError extends HuntressError {
    constructor(message: string, response: unknown);
}
declare class NotFoundError extends HuntressError {
    constructor(message: string, response: unknown);
}
declare class ValidationError extends HuntressError {
    errors: Array<{
        field: string;
        message: string;
    }>;
    constructor(message: string, errors: Array<{
        field: string;
        message: string;
    }>, response: unknown);
}
declare class RateLimitError extends HuntressError {
    retryAfter: number;
    constructor(message: string, retryAfter: number, response: unknown);
}
declare class ServerError extends HuntressError {
    constructor(message: string, response: unknown);
}

export { type Account, type Actor, type Agent, type AgentListParams, AuthenticationError, type BillingReport, type BillingReportListParams, type Escalation, type EscalationResolutionParams, type EscalationWithEntities, ForbiddenError, HuntressClient, type HuntressClientConfig, HuntressError, type IncidentReport, type IncidentReportListParams, type Membership, type MembershipCreateParams, type MembershipUpdateParams, NotFoundError, type Organization, type OrganizationCreateParams, type OrganizationUpdateParams, type PaginatedResponse, type Pagination, type PaginationParams, RateLimitError, type Remediation, type RemediationBulkRejectionParams, type RemediationListParams, ServerError, type Signal, type SignalListParams, type SummaryReport, type SummaryReportListParams, type User, ValidationError };
