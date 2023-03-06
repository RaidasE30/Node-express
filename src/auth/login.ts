import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CredentialsPartial, AuthSuccessResponse, UserViewModel } from './types';
import credentialsValidationSchema from '../controllers/validation-schemas/credentials-validation-schema';
import UserModel from './model';
import config from '../config';

export const login: RequestHandler<
{},
AuthSuccessResponse | ResponseError,
CredentialsPartial,
{}

> = async (req, res) => {
  try {
    const credentials = credentialsValidationSchema.validateSync(req.body, { abortEarly: false });
    const user = await UserModel.getUser(credentials.email);
    const validPassword = await bcrypt.compare(credentials.password, user.password);
    if (!validPassword) throw new Error('Incorrect password');
    const token = jwt.sign({ email: user.email, role: user.role }, config.secret.jwtTokenKey);

    const userViewModel: UserViewModel = {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      role: user.role,
    };

    res.status(200).json({
      token,
      user: userViewModel,
    });
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
