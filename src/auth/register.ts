import { RequestHandler } from 'express';
import { AuthSuccessResponse, RegistrationData } from './types';
import registrationDataValidationSchema from '../characters/validation-schemas/registration-data-validation-schema';
import UserModel from './model';

import { createAuthSuccessResponse } from './helpers/create-auth-success-response';
import ErrorService from '../services/error-service';

export const register: RequestHandler<
{},
AuthSuccessResponse | ResponseError,
Partial<RegistrationData>,
{}
> = async (req, res) => {
  try {
    const { passwordConfirmation, ...registrationData } = registrationDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    const emailAvailable = await UserModel.emailAvailable(registrationData.email);
    if (!emailAvailable) throw new Error(`Email ${registrationData.email} is already taken`);
    const user = await UserModel.createUser(registrationData);

    res.status(200).json(createAuthSuccessResponse(user));
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
