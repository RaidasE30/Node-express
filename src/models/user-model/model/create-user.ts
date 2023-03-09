import mysql from 'mysql2/promise';
import config from '../../../config';
import { RegistrationData, UserEntityRow } from '../../../auth/types';
import SQL from './sql';
import BcryptService from '../../../services/bcrypt-service';

export const createUser = async ({
  email,
  password,
  first_name,
  last_name,
}: RegistrationData): Promise<UserEntityRow> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    INSERT INTO users (email, password, first_name, last_name) VALUES 
    (?, ?, ?, ?);
    ${SQL.SELECT}
    WHERE users.id = LAST_INSERT_ID();
  `;

  const hashedPassword = BcryptService.hash(password);
  const preparedSqlData = [email, hashedPassword, first_name, last_name];
  const [queryResultsArr] = await mySqlConnection.query(
    preparedSql,
    preparedSqlData,
  );

  const [createdUser] = (queryResultsArr as UserEntityRow[][])[1];

  mySqlConnection.end();

  return createdUser;
};
