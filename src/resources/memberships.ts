import type { HttpClient } from '../http.js';
import type { Membership, MembershipCreateParams, MembershipUpdateParams, PaginationParams, Pagination } from '../types/index.js';

export class MembershipsResource {
  constructor(private readonly http: HttpClient) {}

  async list(params?: PaginationParams & { organization_id?: number }): Promise<{ memberships: Membership[]; pagination: Pagination }> {
    return this.http.request('/v1/memberships', { params: params as Record<string, unknown> });
  }

  async get(id: number): Promise<Membership> {
    const res = await this.http.request<{ membership: Membership }>(`/v1/memberships/${id}`);
    return res.membership;
  }

  async create(data: MembershipCreateParams): Promise<Membership> {
    const res = await this.http.request<{ membership: Membership }>('/v1/memberships', {
      method: 'POST',
      body: data,
    });
    return res.membership;
  }

  async update(id: number, data: MembershipUpdateParams): Promise<Membership> {
    const res = await this.http.request<{ membership: Membership }>(`/v1/memberships/${id}`, {
      method: 'PATCH',
      body: data,
    });
    return res.membership;
  }

  async delete(id: number): Promise<void> {
    await this.http.request(`/v1/memberships/${id}`, { method: 'DELETE' });
  }
}
