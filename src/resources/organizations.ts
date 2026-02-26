import type { HttpClient } from '../http.js';
import type { Organization, OrganizationCreateParams, OrganizationUpdateParams, PaginationParams, Pagination } from '../types/index.js';

export class OrganizationsResource {
  constructor(private readonly http: HttpClient) {}

  async list(params?: PaginationParams): Promise<{ organizations: Organization[]; pagination: Pagination }> {
    return this.http.request('/v1/organizations', { params: params as Record<string, unknown> });
  }

  async get(id: number): Promise<Organization> {
    const res = await this.http.request<{ organization: Organization }>(`/v1/organizations/${id}`);
    return res.organization;
  }

  async create(data: OrganizationCreateParams): Promise<Organization> {
    const res = await this.http.request<{ organization: Organization }>('/v1/organizations', {
      method: 'POST',
      body: data,
    });
    return res.organization;
  }

  async update(id: number, data: OrganizationUpdateParams): Promise<Organization> {
    const res = await this.http.request<{ organization: Organization }>(`/v1/organizations/${id}`, {
      method: 'PATCH',
      body: data,
    });
    return res.organization;
  }

  async delete(id: number): Promise<void> {
    await this.http.request(`/v1/organizations/${id}`, { method: 'DELETE' });
  }
}
