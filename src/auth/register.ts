import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import bcrypt from 'bcrypt';
import { AuthSuccessResponse, RegistrationData } from './types';
import registrationDataValidationSchema from '../controllers/validation-schemas/registration-data-validation-schema';
import UserModel from './model';
import config from '../config';
import createAuthSuccessResponse from './helpers/create-auth-success-response';

export const register: RequestHandler<
{},
AuthSuccessResponse | ResponseError,
Partial<RegistrationData>,
{}
> = async (req, res) => {
  try {
    const registrationData = registrationDataValidationSchema.validateSync(req.body, {
      abortEarly: false,
    });

    const user = await UserModel.createUser({
      email: registrationData.email,
      password: await bcrypt.hash(registrationData.password, config.secret.bcryptRounds),
      first_name: registrationData.first_name,
      last_name: registrationData.last_name,
    });

    res.status(200).json(createAuthSuccessResponse(user));
  } catch (err) {
    if (err instanceof ValidationError) {
      const manyErrors = err.errors.length > 1;
      res.status(400).json({
        error: manyErrors ? 'Validation errors' : err.errors[0],
        errors: manyErrors ? err.errors : undefined,
      });
    } else if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: 'Request error' });
    }
  }
};
