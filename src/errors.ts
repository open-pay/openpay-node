// ── Custom Error Classes ───────────────────────────────────────────

export class OpenpayError extends Error {
  public readonly statusCode: number;
  public readonly body: unknown;
  public readonly category?: string | undefined;
  public readonly description?: string | undefined;
  public readonly requestId?: string | undefined;

  constructor(
    message: string,
    statusCode: number,
    body: unknown,
    cause?: Error,
  ) {
    super(message, { cause });
    this.name = 'OpenpayError';
    this.statusCode = statusCode;

    // Extract details from the Openpay error body if possible
    if (body !== null && typeof body === 'object') {
      const b = body as Record<string, unknown>;
      this.body = body;
      const cat = b['category'];
      const desc = b['description'];
      const reqId = b['request_id'];
      if (typeof cat === 'string') this.category = cat;
      if (typeof desc === 'string') this.description = desc;
      if (typeof reqId === 'string') this.requestId = reqId;
    } else {
      this.body = body;
    }
  }

  /** Whether this is a client error (4xx). */
  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /** Whether this is a server error (5xx). */
  get isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

export class NetworkError extends OpenpayError {
  constructor(cause: Error) {
    super(`Network error: ${cause.message}`, 0, null, cause);
    this.name = 'NetworkError';
  }
}
