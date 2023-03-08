import mysql from 'mysql2/promise';
import { CharacterViewModel } from '../types';
import config from '../../config';
import SQL from './sql';

export const getCharacter = async (id: string): Promise<CharacterViewModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = [SQL.SELECT, SQL.WHERE_ID, SQL.GROUP].join('\n');
  const preparedSqlData = [id];
  const [characters] = await mySqlConnection
    .query<CharacterViewModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();

  if (characters.length === 0) {
    throw new Error(`character with id: ${id} does not exist`);
  }

  return characters[0];
};
