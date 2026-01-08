export interface LogContext {
  requestId?: string;
  userId?: string;
  method?: string;
  path?: string;
  ip?: string;
  statusCode?: number;
  durationMs?: number;

  [key: string]: any;
}
