import type { HuntressClientConfig } from './types/index.js';
import { HttpClient } from './http.js';
import { RateLimiter } from './rate-limiter.js';
import { AccountsResource } from './resources/accounts.js';
import { ActorResource } from './resources/actor.js';
import { AgentsResource } from './resources/agents.js';
import { OrganizationsResource } from './resources/organizations.js';
import { IncidentReportsResource } from './resources/incident-reports.js';
import { EscalationsResource } from './resources/escalations.js';
import { BillingReportsResource } from './resources/billing-reports.js';
import { SummaryReportsResource } from './resources/summary-reports.js';
import { SignalsResource } from './resources/signals.js';
import { MembershipsResource } from './resources/memberships.js';

export class HuntressClient {
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

  constructor(config: HuntressClientConfig) {
    const rateLimiter = new RateLimiter(config.rateLimitPerMinute ?? 60);
    const http = new HttpClient({
      baseUrl: config.baseUrl ?? 'https://api.huntress.io',
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      maxRetries: config.maxRetries ?? 3,
      rateLimiter,
    });

    this.accounts = new AccountsResource(http);
    this.actor = new ActorResource(http);
    this.agents = new AgentsResource(http);
    this.organizations = new OrganizationsResource(http);
    this.incidentReports = new IncidentReportsResource(http);
    this.escalations = new EscalationsResource(http);
    this.billingReports = new BillingReportsResource(http);
    this.summaryReports = new SummaryReportsResource(http);
    this.signals = new SignalsResource(http);
    this.memberships = new MembershipsResource(http);
  }
}
