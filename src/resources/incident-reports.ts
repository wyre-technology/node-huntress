import type { HttpClient } from '../http.js';
import type {
  IncidentReport, IncidentReportListParams, Pagination,
  Remediation, RemediationListParams, RemediationBulkRejectionParams,
} from '../types/index.js';

export class IncidentReportsResource {
  constructor(private readonly http: HttpClient) {}

  async list(params?: IncidentReportListParams): Promise<{ incident_reports: IncidentReport[]; pagination: Pagination }> {
    return this.http.request('/v1/incident_reports', { params: params as Record<string, unknown> });
  }

  async get(id: number): Promise<IncidentReport> {
    const res = await this.http.request<{ incident_report: IncidentReport }>(`/v1/incident_reports/${id}`);
    return res.incident_report;
  }

  async resolve(id: number): Promise<void> {
    await this.http.request(`/v1/incident_reports/${id}/resolution`, { method: 'POST' });
  }

  async listRemediations(incidentReportId: number, params?: RemediationListParams): Promise<{ remediations: Remediation[]; pagination: Pagination }> {
    return this.http.request(`/v1/incident_reports/${incidentReportId}/remediations`, {
      params: params as Record<string, unknown>,
    });
  }

  async getRemediation(incidentReportId: number, remediationId: number): Promise<Remediation> {
    const res = await this.http.request<{ remediation: Remediation }>(
      `/v1/incident_reports/${incidentReportId}/remediations/${remediationId}`
    );
    return res.remediation;
  }

  async bulkApproveRemediations(incidentReportId: number): Promise<void> {
    await this.http.request(`/v1/incident_reports/${incidentReportId}/remediations/bulk_approval`, {
      method: 'POST',
    });
  }

  async bulkRejectRemediations(incidentReportId: number, params: RemediationBulkRejectionParams): Promise<void> {
    await this.http.request(`/v1/incident_reports/${incidentReportId}/remediations/bulk_rejection`, {
      method: 'POST',
      body: params,
    });
  }
}
