import jwt from 'jsonwebtoken';
import config from '../config';

type Data = {
  email: UserEntity['email'],
  role: UserEntity['role'],
};

type DecodedData = Data & { iat: number };

const createToken = (data: Data) => jwt.sign(data, config.secret.jwtTokenKey);

const decodeToken = (token: string) => jwt.decode(token) as (DecodedData | null);

const TokenService = {
  createToken,
  decodeToken,
};

export default TokenService;