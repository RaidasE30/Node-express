import { RowDataPacket } from 'mysql2';

type UserEntity = {
  id: number,
  email: string,
  first_name: string,
  last_name: string,
  password: string,
  role: 'ADMIN' | 'USER',
};

export type RegistrationData = {
  email: string,
  first_name: string,
  last_name: string,
  password: string,
  passwordConfirmation: string,
};

export type UserEntityRow = UserEntity & RowDataPacket;

export type UserViewModel = Omit<UserEntity, 'password'>;

export type Credentials = {
  email: string,
  password: string,
};

export type CredentialsPartial = Partial<Credentials>;

export type AuthSuccessResponse = {
  token: string,
  user: UserViewModel
};
