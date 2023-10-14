export default class AppError extends Error {
  code;

  source;

  metadata;

  constructor(code: string, options: { message?: string; source?: unknown; metadata?: unknown }) {
    const { message, source, metadata } = options;
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.code = code;
    this.name = 'AppError';
    this.source = source;
    this.metadata = metadata;
  }
}

export const throwError = (
  message: string,
  options: { code: string; metadata?: unknown; source?: unknown; err?: Error } = {
    code: 'APP_ERR',
  }
): void => {
  throw new AppError(options.code, {
    message,
    metadata: options.metadata,
    source: options.source,
  });
};
