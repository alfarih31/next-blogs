import AppError from './app-error';

export class HttpError extends AppError {
  readonly name = 'HttpError';

  constructor(
    readonly code: string,
    readonly message: string,
    readonly status: number
  ) {
    super(code, { message });
  }
}
