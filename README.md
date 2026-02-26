# node-huntress

Node.js client library for the [Huntress](https://www.huntress.com) REST API. Zero production dependencies — uses native `fetch` (Node 18+).

## Installation

```bash
npm install node-huntress
```

## Usage

```typescript
import { HuntressClient } from 'node-huntress';

const client = new HuntressClient({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
});

// Get account info
const account = await client.accounts.get();

// List agents
const { agents, pagination } = await client.agents.list({ limit: 50 });

// List organizations
const { organizations } = await client.organizations.list();

// Create organization
const org = await client.organizations.create({ name: 'Acme Corp', key: 'acme' });

// List incident reports
const { incident_reports } = await client.incidentReports.list({ status: 'open' });

// List escalations
const { escalations } = await client.escalations.list();

// List signals
const { signals } = await client.signals.list();

// Get current user (actor)
const actor = await client.actor.get();
```

## Authentication

The Huntress API uses HTTP Basic Auth. Generate your API key and secret at `<your_account_subdomain>.huntress.io` under API Credentials.

## Pagination

All list endpoints return a `pagination` object with `next_page_token` and `next_page_url`. Pass `page_token` to get the next page:

```typescript
let pageToken: string | undefined;
do {
  const result = await client.agents.list({ limit: 100, page_token: pageToken });
  // process result.agents
  pageToken = result.pagination.next_page_token;
} while (pageToken);
```

## Rate Limiting

Built-in rate limiter respects the Huntress API limit of 60 requests per minute. Configurable via `rateLimitPerMinute` option.

## Resources

| Resource | Methods |
|----------|---------|
| `accounts` | `get()` |
| `actor` | `get()` |
| `agents` | `list()`, `get(id)` |
| `organizations` | `list()`, `get(id)`, `create()`, `update(id)`, `delete(id)` |
| `incidentReports` | `list()`, `get(id)`, `resolve(id)`, `listRemediations()`, `getRemediation()`, `bulkApproveRemediations()`, `bulkRejectRemediations()` |
| `escalations` | `list()`, `get(id)`, `resolve(id)` |
| `billingReports` | `list()`, `get(id)` |
| `summaryReports` | `list()`, `get(id)` |
| `signals` | `list()`, `get(id)` |
| `memberships` | `list()`, `get(id)`, `create()`, `update(id)`, `delete(id)` |

## License

Apache 2.0 — Copyright WYRE Technology
