import mysql from 'mysql2/promise';
import { CharacterViewModel } from '../types';
import config from '../../config';
import SQL from './sql';

export const getCharacters = async (): Promise<CharacterViewModel[]> => {
  const mySqlConnection = await mysql.createConnection(config.db);
  const sql = [SQL.SELECT, SQL.GROUP].join('\n');
  const [characters] = await mySqlConnection.query<CharacterViewModel[]>(sql);

  return characters;
};
