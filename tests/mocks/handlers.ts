import { http, HttpResponse } from 'msw';

const BASE_URL = 'https://api.huntress.io';

export const handlers = [
  http.get(`${BASE_URL}/v1/account`, () =>
    HttpResponse.json({
      account: { id: 1, name: 'Test Account', subdomain: 'test', status: 'active', support_type: 'huntress_supported' },
    })
  ),

  http.get(`${BASE_URL}/v1/actor`, () =>
    HttpResponse.json({
      actor: { reseller: null, account: { id: 1, name: 'Test Account' }, user: { id: 1, email: 'test@example.com', name: 'Test User' } },
    })
  ),

  http.get(`${BASE_URL}/v1/agents`, () =>
    HttpResponse.json({
      agents: [
        { id: 1, hostname: 'WORKSTATION-1', platform: 'windows', organization_id: 1, account_id: 1 },
        { id: 2, hostname: 'MAC-1', platform: 'darwin', organization_id: 1, account_id: 1 },
      ],
      pagination: { next_page_token: null, next_page_url: null },
    })
  ),

  http.get(`${BASE_URL}/v1/agents/:id`, ({ params }) =>
    HttpResponse.json({
      agent: { id: Number(params.id), hostname: 'WORKSTATION-1', platform: 'windows', organization_id: 1, account_id: 1 },
    })
  ),

  http.get(`${BASE_URL}/v1/organizations`, () =>
    HttpResponse.json({
      organizations: [
        { id: 1, name: 'Test Org', key: 'test-org', account_id: 1, agents_count: 5 },
      ],
      pagination: { next_page_token: null },
    })
  ),

  http.get(`${BASE_URL}/v1/organizations/:id`, ({ params }) =>
    HttpResponse.json({
      organization: { id: Number(params.id), name: 'Test Org', key: 'test-org', account_id: 1, agents_count: 5 },
    })
  ),

  http.post(`${BASE_URL}/v1/organizations`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      organization: { id: 99, name: body.name, key: body.key, account_id: 1, agents_count: 0 },
    }, { status: 201 });
  }),

  http.patch(`${BASE_URL}/v1/organizations/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      organization: { id: Number(params.id), name: body.name || 'Test Org', key: body.key || 'test-org', account_id: 1 },
    });
  }),

  http.delete(`${BASE_URL}/v1/organizations/:id`, () => new HttpResponse(null, { status: 204 })),

  http.get(`${BASE_URL}/v1/incident_reports`, () =>
    HttpResponse.json({
      incident_reports: [
        { id: 1, status: 'open', severity: 'high', subject: 'Malware detected', account_id: 1 },
      ],
      pagination: {},
    })
  ),

  http.get(`${BASE_URL}/v1/incident_reports/:id`, ({ params }) =>
    HttpResponse.json({
      incident_report: { id: Number(params.id), status: 'open', severity: 'high', subject: 'Malware detected', account_id: 1 },
    })
  ),

  http.get(`${BASE_URL}/v1/escalations`, () =>
    HttpResponse.json({
      escalations: [{ id: 1, status: 'open', severity: 'critical', type: 'unwanted_access' }],
      pagination: {},
    })
  ),

  http.get(`${BASE_URL}/v1/escalations/:id`, ({ params }) =>
    HttpResponse.json({
      escalation: { id: Number(params.id), status: 'open', severity: 'critical', type: 'unwanted_access', entities: [] },
    })
  ),

  http.get(`${BASE_URL}/v1/billing_reports`, () =>
    HttpResponse.json({
      billing_reports: [{ id: 1, amount: 100, status: 'paid', currency_type: 'usd' }],
      pagination: {},
    })
  ),

  http.get(`${BASE_URL}/v1/billing_reports/:id`, ({ params }) =>
    HttpResponse.json({
      billing_report: { id: Number(params.id), amount: 100, status: 'paid', currency_type: 'usd' },
    })
  ),

  http.get(`${BASE_URL}/v1/reports`, () =>
    HttpResponse.json({
      reports: [{ id: 1, type: 'monthly', period: '2024-01', agents_count: 50 }],
      pagination: {},
    })
  ),

  http.get(`${BASE_URL}/v1/reports/:id`, ({ params }) =>
    HttpResponse.json({
      report: { id: Number(params.id), type: 'monthly', period: '2024-01', agents_count: 50 },
    })
  ),

  http.get(`${BASE_URL}/v1/signals`, () =>
    HttpResponse.json({
      signals: [{ id: 1, name: 'Suspicious process', status: 'open', type: 'process' }],
      pagination: {},
    })
  ),

  http.get(`${BASE_URL}/v1/signals/:id`, ({ params }) =>
    HttpResponse.json({
      signal: { id: Number(params.id), name: 'Suspicious process', status: 'open', type: 'process' },
    })
  ),

  http.get(`${BASE_URL}/v1/memberships`, () =>
    HttpResponse.json({
      memberships: [{ id: 1, permissions: 'Admin', user: { id: 1, email: 'test@example.com', name: 'Test' } }],
      pagination: {},
    })
  ),

  http.get(`${BASE_URL}/v1/memberships/:id`, ({ params }) =>
    HttpResponse.json({
      membership: { id: Number(params.id), permissions: 'Admin', user: { id: 1, email: 'test@example.com', name: 'Test' } },
    })
  ),
];
