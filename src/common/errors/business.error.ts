export class BusinessError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: any,
  ) {
    super(message);
  }
}
