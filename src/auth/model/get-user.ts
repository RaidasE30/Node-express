import mysql from 'mysql2/promise';
import config from '../../config';
import { UserEntityRow } from '../types';

export const getUser = async (email: string): Promise<UserEntityRow> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    SELECT id, first_name, last_name, email, password, role
    FROM users
    WHERE users.email = ?;
  `;

  const preparedSqlData = [email];
  const [users] = await mySqlConnection.query<UserEntityRow[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();

  if (users.length === 0) throw new Error(`user with email '${email}' was not found`);

  return users[0];
};
