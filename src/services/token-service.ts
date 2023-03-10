import jwt from 'jsonwebtoken';
import config from '../config';

const createToken = (data: AuthData) => jwt.sign(data, config.jwtToken.secret, {
  expiresIn: config.jwtToken.expiresIn,
});

const decodeToken = (token: string): DecodedAuthData | null => {
  const data = jwt.decode(token);

  if (data === null) return null;
  if (typeof data === 'string') return null;

  return {
    iat: data.iat as number,
    exp: data.exp as number,
    email: data.email,
  };
};

const TokenService = {
  createToken,
  decodeToken,
};

export default TokenService;
