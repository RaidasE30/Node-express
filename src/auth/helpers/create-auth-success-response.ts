import { AuthSuccessResponse } from '../types';
import TokenService from '../../services/token-service';

export const createAuthSuccessResponse = ({
  password,
  ...user
}: UserEntity):AuthSuccessResponse => {
  const token = TokenService.createToken({ email: user.email, role: user.role });

  return {
    token,
    user,
  };
};

export default createAuthSuccessResponse;
