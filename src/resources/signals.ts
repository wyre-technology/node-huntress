import type { HttpClient } from '../http.js';
import type { Signal, SignalListParams, Pagination } from '../types/index.js';

export class SignalsResource {
  constructor(private readonly http: HttpClient) {}

  async list(params?: SignalListParams): Promise<{ signals: Signal[]; pagination: Pagination }> {
    return this.http.request('/v1/signals', { params: params as Record<string, unknown> });
  }

  async get(id: number): Promise<Signal> {
    const res = await this.http.request<{ signal: Signal }>(`/v1/signals/${id}`);
    return res.signal;
  }
}
