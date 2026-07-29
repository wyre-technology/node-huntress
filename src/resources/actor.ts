import type { HttpClient } from '../http.js';
import type { Actor } from '../types/index.js';

export class ActorResource {
  constructor(private readonly http: HttpClient) {}

  async get(): Promise<Actor> {
    // Unlike most Huntress endpoints, /v1/actor returns the actor shape at
    // the top level of the response — it is NOT wrapped in { actor: ... }.
    return this.http.request<Actor>('/v1/actor');
  }
}
