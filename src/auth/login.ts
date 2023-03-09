import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';

import { CredentialsPartial, AuthSuccessResponse } from './types';
import credentialsValidationSchema from '../characters/validation-schemas/credentials-validation-schema';
import UserModel from '../models/user-model/model';

import { createAuthSuccessResponse } from './helpers/create-auth-success-response';
import ErrorService from '../services/error-service';

export const login: RequestHandler<
{},
AuthSuccessResponse | ResponseError,
CredentialsPartial,
{}

> = async (req, res) => {
  try {
    const credentials = credentialsValidationSchema.validateSync(req.body, { abortEarly: false });
    const user = await UserModel.getUserByEmail(credentials.email);
    const validPassword = await bcrypt.compare(credentials.password, user.password);
    if (!validPassword) throw new Error('Incorrect password');

    res.status(200).json(createAuthSuccessResponse(user));
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
