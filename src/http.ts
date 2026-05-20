import { RateLimiter } from './rate-limiter.js';
import {
  HuntressError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
} from './errors.js';

export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
  maxRetries: number;
  rateLimiter: RateLimiter;
}

export interface RequestOptions {
  method?: string;
  params?: Record<string, unknown>;
  body?: unknown;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly authHeader: string;
  private readonly maxRetries: number;
  private readonly rateLimiter: RateLimiter;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.authHeader = 'Basic ' + btoa(`${config.apiKey}:${config.apiSecret}`);
    this.maxRetries = config.maxRetries;
    this.rateLimiter = config.rateLimiter;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', params, body } = options;

    let url = `${this.baseUrl}${path}`;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            for (const v of value) {
              searchParams.append(`${key}[]`, String(v));
            }
          } else {
            searchParams.set(key, String(value));
          }
        }
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    let lastError: Error | null = null;
    // When a 429 sets its own retry-after delay, skip the exponential
    // backoff sleep on the next iteration so only one delay applies.
    let skipBackoff = false;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0 && !skipBackoff) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 30_000);
        await new Promise(r => setTimeout(r, delay));
      }
      skipBackoff = false;

      await this.rateLimiter.acquire();

      const headers: Record<string, string> = {
        'Authorization': this.authHeader,
        'Accept': 'application/json',
      };
      if (body) headers['Content-Type'] = 'application/json';

      let response: Response;
      try {
        response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });
      } catch (err) {
        lastError = err as Error;
        continue;
      }

      if (response.ok) {
        if (response.status === 204) return {} as T;
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) return response.json() as Promise<T>;
        return {} as T;
      }

      // Read body safely (text first, then parse)
      let responseBody: unknown;
      const rawText = await response.text();
      try { responseBody = JSON.parse(rawText); }
      catch { responseBody = rawText; }

      switch (response.status) {
        case 400:
          throw new ValidationError('Bad request', extractValidationErrors(responseBody), responseBody);
        case 401:
          throw new AuthenticationError('Authentication failed', responseBody);
        case 403:
          throw new ForbiddenError('Forbidden', responseBody);
        case 404:
          throw new NotFoundError('Resource not found', responseBody);
        case 429: {
          const retryAfter = parseInt(response.headers.get('retry-after') || '60', 10);
          if (attempt < this.maxRetries) {
            await new Promise(r => setTimeout(r, retryAfter * 1000));
            skipBackoff = true;
            continue;
          }
          throw new RateLimitError('Rate limit exceeded', retryAfter, responseBody);
        }
        default:
          if (response.status >= 500) {
            lastError = new ServerError(`Server error: ${response.status}`, responseBody);
            if (attempt < this.maxRetries) continue;
            throw lastError;
          }
          throw new HuntressError(`HTTP ${response.status}`, response.status, responseBody);
      }
    }

    throw lastError || new Error('Request failed after retries');
  }
}

/**
 * Best-effort extraction of structured field errors from a 400 response body.
 * Handles the common shapes returned by the Huntress API:
 *   - { errors: [{ field, message }, ...] }
 *   - { errors: { field: "message" | ["message", ...] } }
 * Falls back to an empty array when no structured errors are present.
 */
function extractValidationErrors(body: unknown): Array<{ field: string; message: string }> {
  if (!body || typeof body !== 'object') return [];
  const errors = (body as { errors?: unknown }).errors;
  if (!errors) return [];

  if (Array.isArray(errors)) {
    return errors
      .map((e) => {
        if (e && typeof e === 'object') {
          const obj = e as Record<string, unknown>;
          return {
            field: String(obj.field ?? obj.name ?? ''),
            message: String(obj.message ?? obj.detail ?? e),
          };
        }
        return { field: '', message: String(e) };
      })
      .filter((e) => e.message.length > 0);
  }

  if (typeof errors === 'object') {
    return Object.entries(errors as Record<string, unknown>).flatMap(([field, value]) => {
      const messages = Array.isArray(value) ? value : [value];
      return messages.map((m) => ({ field, message: String(m) }));
    });
  }

  return [];
}
