import { AuthSuccessResponse, UserViewModel, UserEntityRow } from '../types';
import TokenService from '../../services/token-service';

const createAuthSuccessResponse = (user: UserEntityRow):AuthSuccessResponse => {
  const token = TokenService.createToken(user.email, user.role);
  const userViewModel: UserViewModel = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  };
  return {
    token,
    user: userViewModel,
  };
};

export default createAuthSuccessResponse;
