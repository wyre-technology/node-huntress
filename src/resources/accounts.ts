import type { HttpClient } from '../http.js';
import type { Account } from '../types/index.js';

export class AccountsResource {
  constructor(private readonly http: HttpClient) {}

  async get(): Promise<Account> {
    const res = await this.http.request<{ account: Account }>('/v1/account');
    return res.account;
  }
}
