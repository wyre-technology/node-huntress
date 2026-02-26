import type { HttpClient } from '../http.js';
import type { BillingReport, BillingReportListParams, Pagination } from '../types/index.js';

export class BillingReportsResource {
  constructor(private readonly http: HttpClient) {}

  async list(params?: BillingReportListParams): Promise<{ billing_reports: BillingReport[]; pagination: Pagination }> {
    return this.http.request('/v1/billing_reports', { params: params as Record<string, unknown> });
  }

  async get(id: number): Promise<BillingReport> {
    const res = await this.http.request<{ billing_report: BillingReport }>(`/v1/billing_reports/${id}`);
    return res.billing_report;
  }
}
