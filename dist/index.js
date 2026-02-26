// src/errors.ts
var HuntressError = class extends Error {
  constructor(message, statusCode, response) {
    super(message);
    this.statusCode = statusCode;
    this.response = response;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};
var AuthenticationError = class extends HuntressError {
  constructor(message, response) {
    super(message, 401, response);
  }
};
var ForbiddenError = class extends HuntressError {
  constructor(message, response) {
    super(message, 403, response);
  }
};
var NotFoundError = class extends HuntressError {
  constructor(message, response) {
    super(message, 404, response);
  }
};
var ValidationError = class extends HuntressError {
  constructor(message, errors, response) {
    super(message, 400, response);
    this.errors = errors;
  }
};
var RateLimitError = class extends HuntressError {
  constructor(message, retryAfter, response) {
    super(message, 429, response);
    this.retryAfter = retryAfter;
  }
};
var ServerError = class extends HuntressError {
  constructor(message, response) {
    super(message, 500, response);
  }
};

// src/http.ts
var HttpClient = class {
  baseUrl;
  authHeader;
  maxRetries;
  rateLimiter;
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.authHeader = "Basic " + btoa(`${config.apiKey}:${config.apiSecret}`);
    this.maxRetries = config.maxRetries;
    this.rateLimiter = config.rateLimiter;
  }
  async request(path, options = {}) {
    const { method = "GET", params, body } = options;
    let url = `${this.baseUrl}${path}`;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== void 0 && value !== null) {
          if (Array.isArray(value)) {
            for (const v of value) {
              searchParams.append(`${key}[]`, String(v));
            }
          } else {
            searchParams.set(key, String(value));
          }
        }
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }
    let lastError = null;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(1e3 * 2 ** (attempt - 1), 3e4);
        await new Promise((r) => setTimeout(r, delay));
      }
      await this.rateLimiter.acquire();
      const headers = {
        "Authorization": this.authHeader,
        "Accept": "application/json"
      };
      if (body) headers["Content-Type"] = "application/json";
      let response;
      try {
        response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : void 0
        });
      } catch (err) {
        lastError = err;
        continue;
      }
      if (response.ok) {
        if (response.status === 204) return {};
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) return response.json();
        return {};
      }
      let responseBody;
      const rawText = await response.text();
      try {
        responseBody = JSON.parse(rawText);
      } catch {
        responseBody = rawText;
      }
      switch (response.status) {
        case 400:
          throw new ValidationError("Bad request", [], responseBody);
        case 401:
          throw new AuthenticationError("Authentication failed", responseBody);
        case 403:
          throw new ForbiddenError("Forbidden", responseBody);
        case 404:
          throw new NotFoundError("Resource not found", responseBody);
        case 429: {
          const retryAfter = parseInt(response.headers.get("retry-after") || "60", 10);
          if (attempt < this.maxRetries) {
            await new Promise((r) => setTimeout(r, retryAfter * 1e3));
            continue;
          }
          throw new RateLimitError("Rate limit exceeded", retryAfter, responseBody);
        }
        default:
          if (response.status >= 500) {
            lastError = new ServerError(`Server error: ${response.status}`, responseBody);
            if (attempt < this.maxRetries) continue;
            throw lastError;
          }
          throw new HuntressError(`HTTP ${response.status}`, response.status, responseBody);
      }
    }
    throw lastError || new Error("Request failed after retries");
  }
};

// src/rate-limiter.ts
var RateLimiter = class {
  timestamps = [];
  maxRequests;
  windowMs;
  constructor(maxRequests = 60, windowMs = 6e4) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  async acquire() {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);
    if (this.timestamps.length >= this.maxRequests) {
      const oldest = this.timestamps[0];
      const waitMs = this.windowMs - (now - oldest) + 50;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      return this.acquire();
    }
    this.timestamps.push(now);
  }
};

// src/resources/accounts.ts
var AccountsResource = class {
  constructor(http) {
    this.http = http;
  }
  async get() {
    const res = await this.http.request("/v1/account");
    return res.account;
  }
};

// src/resources/actor.ts
var ActorResource = class {
  constructor(http) {
    this.http = http;
  }
  async get() {
    const res = await this.http.request("/v1/actor");
    return res.actor;
  }
};

// src/resources/agents.ts
var AgentsResource = class {
  constructor(http) {
    this.http = http;
  }
  async list(params) {
    return this.http.request("/v1/agents", { params });
  }
  async get(id) {
    const res = await this.http.request(`/v1/agents/${id}`);
    return res.agent;
  }
};

// src/resources/organizations.ts
var OrganizationsResource = class {
  constructor(http) {
    this.http = http;
  }
  async list(params) {
    return this.http.request("/v1/organizations", { params });
  }
  async get(id) {
    const res = await this.http.request(`/v1/organizations/${id}`);
    return res.organization;
  }
  async create(data) {
    const res = await this.http.request("/v1/organizations", {
      method: "POST",
      body: data
    });
    return res.organization;
  }
  async update(id, data) {
    const res = await this.http.request(`/v1/organizations/${id}`, {
      method: "PATCH",
      body: data
    });
    return res.organization;
  }
  async delete(id) {
    await this.http.request(`/v1/organizations/${id}`, { method: "DELETE" });
  }
};

// src/resources/incident-reports.ts
var IncidentReportsResource = class {
  constructor(http) {
    this.http = http;
  }
  async list(params) {
    return this.http.request("/v1/incident_reports", { params });
  }
  async get(id) {
    const res = await this.http.request(`/v1/incident_reports/${id}`);
    return res.incident_report;
  }
  async resolve(id) {
    await this.http.request(`/v1/incident_reports/${id}/resolution`, { method: "POST" });
  }
  async listRemediations(incidentReportId, params) {
    return this.http.request(`/v1/incident_reports/${incidentReportId}/remediations`, {
      params
    });
  }
  async getRemediation(incidentReportId, remediationId) {
    const res = await this.http.request(
      `/v1/incident_reports/${incidentReportId}/remediations/${remediationId}`
    );
    return res.remediation;
  }
  async bulkApproveRemediations(incidentReportId) {
    await this.http.request(`/v1/incident_reports/${incidentReportId}/remediations/bulk_approval`, {
      method: "POST"
    });
  }
  async bulkRejectRemediations(incidentReportId, params) {
    await this.http.request(`/v1/incident_reports/${incidentReportId}/remediations/bulk_rejection`, {
      method: "POST",
      body: params
    });
  }
};

// src/resources/escalations.ts
var EscalationsResource = class {
  constructor(http) {
    this.http = http;
  }
  async list(params) {
    return this.http.request("/v1/escalations", { params });
  }
  async get(id) {
    const res = await this.http.request(`/v1/escalations/${id}`);
    return res.escalation;
  }
  async resolve(id, params) {
    await this.http.request(`/v1/escalations/${id}/resolution`, {
      method: "POST",
      body: params
    });
  }
};

// src/resources/billing-reports.ts
var BillingReportsResource = class {
  constructor(http) {
    this.http = http;
  }
  async list(params) {
    return this.http.request("/v1/billing_reports", { params });
  }
  async get(id) {
    const res = await this.http.request(`/v1/billing_reports/${id}`);
    return res.billing_report;
  }
};

// src/resources/summary-reports.ts
var SummaryReportsResource = class {
  constructor(http) {
    this.http = http;
  }
  async list(params) {
    return this.http.request("/v1/reports", { params });
  }
  async get(id) {
    const res = await this.http.request(`/v1/reports/${id}`);
    return res.report;
  }
};

// src/resources/signals.ts
var SignalsResource = class {
  constructor(http) {
    this.http = http;
  }
  async list(params) {
    return this.http.request("/v1/signals", { params });
  }
  async get(id) {
    const res = await this.http.request(`/v1/signals/${id}`);
    return res.signal;
  }
};

// src/resources/memberships.ts
var MembershipsResource = class {
  constructor(http) {
    this.http = http;
  }
  async list(params) {
    return this.http.request("/v1/memberships", { params });
  }
  async get(id) {
    const res = await this.http.request(`/v1/memberships/${id}`);
    return res.membership;
  }
  async create(data) {
    const res = await this.http.request("/v1/memberships", {
      method: "POST",
      body: data
    });
    return res.membership;
  }
  async update(id, data) {
    const res = await this.http.request(`/v1/memberships/${id}`, {
      method: "PATCH",
      body: data
    });
    return res.membership;
  }
  async delete(id) {
    await this.http.request(`/v1/memberships/${id}`, { method: "DELETE" });
  }
};

// src/client.ts
var HuntressClient = class {
  accounts;
  actor;
  agents;
  organizations;
  incidentReports;
  escalations;
  billingReports;
  summaryReports;
  signals;
  memberships;
  constructor(config) {
    const rateLimiter = new RateLimiter(config.rateLimitPerMinute ?? 60);
    const http = new HttpClient({
      baseUrl: config.baseUrl ?? "https://api.huntress.io",
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      maxRetries: config.maxRetries ?? 3,
      rateLimiter
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
};
export {
  AuthenticationError,
  ForbiddenError,
  HuntressClient,
  HuntressError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError
};
//# sourceMappingURL=index.js.map