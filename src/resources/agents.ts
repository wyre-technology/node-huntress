import type { HttpClient } from '../http.js';
import type { Agent, AgentListParams, Pagination } from '../types/index.js';

export class AgentsResource {
  constructor(private readonly http: HttpClient) {}

  async list(params?: AgentListParams): Promise<{ agents: Agent[]; pagination: Pagination }> {
    return this.http.request('/v1/agents', { params: params as Record<string, unknown> });
  }

  async get(id: number): Promise<Agent> {
    const res = await this.http.request<{ agent: Agent }>(`/v1/agents/${id}`);
    return res.agent;
  }
}
