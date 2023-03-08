import mysql from 'mysql2/promise';
import config from '../../config';
import { CharacterViewModel } from '../types';

export const deleteCharacter = async (id: string): Promise<void> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
  DELETE FROM inventory WHERE character_id = ?;
  DELETE FROM characters WHERE id = ?;
  DELETE FROM builds WHERE id = ?;
  `;
  const preparedSqlData = [id, id, id];

  await mySqlConnection.query<CharacterViewModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();
};
