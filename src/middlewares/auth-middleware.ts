import { RequestHandler } from 'express';
import TokenService from '../services/token-service';
import ErrorService, { AuthorizationError, ExpiredError } from '../services/error-service';

const authMiddleware: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (authorization === undefined) throw new AuthorizationError();

    const token = authorization.split(' ')[1];
    if (token === undefined) throw new AuthorizationError();

    const authData = TokenService.decodeToken(token);
    if (authData === null) throw new AuthorizationError();

    const timeStampNow = Math.round(new Date().valueOf() / 1000);
    if (authData.exp < timeStampNow) throw new ExpiredError();

    req.authData = authData;
    next();
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};

export default authMiddleware;
