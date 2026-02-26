import type { HttpClient } from '../http.js';
import type { Actor } from '../types/index.js';

export class ActorResource {
  constructor(private readonly http: HttpClient) {}

  async get(): Promise<Actor> {
    const res = await this.http.request<{ actor: Actor }>('/v1/actor');
    return res.actor;
  }
}
