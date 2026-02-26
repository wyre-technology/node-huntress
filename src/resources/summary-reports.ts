import type { HttpClient } from '../http.js';
import type { SummaryReport, SummaryReportListParams, Pagination } from '../types/index.js';

export class SummaryReportsResource {
  constructor(private readonly http: HttpClient) {}

  async list(params?: SummaryReportListParams): Promise<{ reports: SummaryReport[]; pagination: Pagination }> {
    return this.http.request('/v1/reports', { params: params as Record<string, unknown> });
  }

  async get(id: number): Promise<SummaryReport> {
    const res = await this.http.request<{ report: SummaryReport }>(`/v1/reports/${id}`);
    return res.report;
  }
}
