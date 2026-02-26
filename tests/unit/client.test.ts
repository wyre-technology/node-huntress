import { describe, it, expect } from 'vitest';
import { HuntressClient } from '../../src/index.js';

const client = new HuntressClient({ apiKey: 'test-key', apiSecret: 'test-secret' });

describe('HuntressClient', () => {
  describe('accounts', () => {
    it('should get account', async () => {
      const account = await client.accounts.get();
      expect(account.id).toBe(1);
      expect(account.name).toBe('Test Account');
    });
  });

  describe('actor', () => {
    it('should get actor', async () => {
      const actor = await client.actor.get();
      expect(actor.user?.email).toBe('test@example.com');
    });
  });

  describe('agents', () => {
    it('should list agents', async () => {
      const result = await client.agents.list();
      expect(result.agents).toHaveLength(2);
      expect(result.agents[0].hostname).toBe('WORKSTATION-1');
    });

    it('should get agent by id', async () => {
      const agent = await client.agents.get(1);
      expect(agent.id).toBe(1);
    });
  });

  describe('organizations', () => {
    it('should list organizations', async () => {
      const result = await client.organizations.list();
      expect(result.organizations).toHaveLength(1);
    });

    it('should get organization by id', async () => {
      const org = await client.organizations.get(1);
      expect(org.name).toBe('Test Org');
    });

    it('should create organization', async () => {
      const org = await client.organizations.create({ name: 'New Org', key: 'new-org' });
      expect(org.id).toBe(99);
    });

    it('should delete organization', async () => {
      await expect(client.organizations.delete(1)).resolves.not.toThrow();
    });
  });

  describe('incident reports', () => {
    it('should list incident reports', async () => {
      const result = await client.incidentReports.list();
      expect(result.incident_reports).toHaveLength(1);
    });

    it('should get incident report by id', async () => {
      const report = await client.incidentReports.get(1);
      expect(report.severity).toBe('high');
    });
  });

  describe('escalations', () => {
    it('should list escalations', async () => {
      const result = await client.escalations.list();
      expect(result.escalations).toHaveLength(1);
    });
  });

  describe('billing reports', () => {
    it('should list billing reports', async () => {
      const result = await client.billingReports.list();
      expect(result.billing_reports).toHaveLength(1);
    });
  });

  describe('summary reports', () => {
    it('should list summary reports', async () => {
      const result = await client.summaryReports.list();
      expect(result.reports).toHaveLength(1);
    });
  });

  describe('signals', () => {
    it('should list signals', async () => {
      const result = await client.signals.list();
      expect(result.signals).toHaveLength(1);
    });
  });

  describe('memberships', () => {
    it('should list memberships', async () => {
      const result = await client.memberships.list();
      expect(result.memberships).toHaveLength(1);
    });
  });
});
