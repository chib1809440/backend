/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export function sanitizeResponse(body: any) {
  if (body == null) return body;

  if (Buffer.isBuffer(body)) return '[Buffer]';
  if (typeof body === 'string' && body.length > 1000) {
    return body.slice(0, 1000) + '...[truncated]';
  }

  // Mask sensitive fields
  const SENSITIVE_KEYS = ['password', 'token', 'accessToken', 'refreshToken'];

  if (typeof body === 'object') {
    const clone = Array.isArray(body) ? [...body] : { ...body };

    for (const key of Object.keys(clone)) {
      if (SENSITIVE_KEYS.includes(key)) {
        clone[key] = '[REDACTED]';
      }
    }
    return clone;
  }

  return body;
}
