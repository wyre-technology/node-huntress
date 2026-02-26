import type { HttpClient } from '../http.js';
import type { Escalation, EscalationWithEntities, EscalationResolutionParams, PaginationParams, Pagination } from '../types/index.js';

export class EscalationsResource {
  constructor(private readonly http: HttpClient) {}

  async list(params?: PaginationParams): Promise<{ escalations: Escalation[]; pagination: Pagination }> {
    return this.http.request('/v1/escalations', { params: params as Record<string, unknown> });
  }

  async get(id: number): Promise<EscalationWithEntities> {
    const res = await this.http.request<{ escalation: EscalationWithEntities }>(`/v1/escalations/${id}`);
    return res.escalation;
  }

  async resolve(id: number, params?: EscalationResolutionParams): Promise<void> {
    await this.http.request(`/v1/escalations/${id}/resolution`, {
      method: 'POST',
      body: params,
    });
  }
}
