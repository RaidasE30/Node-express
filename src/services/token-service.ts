import jwt from 'jsonwebtoken';
import config from '../config';

type Data = {
  email: UserEntity['email'],
};

type DecodedData = Data & { iat?: number };

const createToken = (data: Data) => jwt.sign(data, config.secret.jwtTokenKey);

const decodeToken = (token: string): DecodedData | null => {
  const data = jwt.decode(token);

  if (data === null) return null;
  if (typeof data === 'string') return null;

  return {
    iat: data.iat,
    email: data.email,
  };
};

const TokenService = {
  createToken,
  decodeToken,
};

export default TokenService;
