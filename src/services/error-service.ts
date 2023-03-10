import { ValidationError } from 'yup';

export class NotFoundError extends Error { }
export class ServerSetupError extends Error {
  constructor() {
    super('Server setup error');
  }
}
export class AuthorizationError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super('Insufficient privileges');
  }
}

export class ExpiredError extends Error {
  constructor() {
    super('Session expired');
  }
}

const handleError = (err: unknown): [number, ResponseError] => {
  let status = 400;
  const errorResponse: ResponseError = {
    error: err instanceof Error ? err.message : 'Request error',
  };

  if (err instanceof AuthorizationError || err instanceof ExpiredError) status = 401;
  if (err instanceof ForbiddenError) status = 403;
  if (err instanceof NotFoundError) status = 404;
  if (err instanceof ValidationError && err.errors.length > 1) errorResponse.errors = err.errors;

  return [status, errorResponse];
};
const ErrorService = {
  handleError,
};
export default ErrorService;
