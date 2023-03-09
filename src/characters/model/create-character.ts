import mysql from 'mysql2/promise';
import { CharacterDetails, CharacterViewModel } from '../types';
import config from '../../config';

type CreateCharacterQueryResult = [
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  CharacterViewModel[],
];

export const createCharacter = async (
  characterData: CharacterDetails,
): Promise<CharacterViewModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
      INSERT INTO builds (beginner, end_game) VALUES
      (?, ?);

      INSERT INTO characters (lvl, sex, faction, price, user_id, build_id) VALUES
      (?, ?, ?, ?, ?, LAST_INSERT_ID());
      SET @characterId = LAST_INSERT_ID();

      INSERT INTO inventory (src, character_id) VALUES
      ${characterData.inventory.map(() => '(?, @characterId)').join(',\n')};
      SELECT
      c.id,
      c.lvl,
      c.sex,
      JSON_OBJECT('beginner', b.beginner, 'end_game', b.end_game) as build,
      c.faction,
      c.price,
      IF (COUNT(i.id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(i.src)) as inventory
      FROM characters as c
      LEFT JOIN inventory as i
      ON i.character_id = c.id
      LEFT JOIN  builds as b
      ON c.build_id = b.id
      WHERE c.id = @characterId
      GROUP BY c.id;
    `;
  const preparedSqlData = [
    characterData.builds.beginner,
    characterData.builds.end_game,
    characterData.lvl,
    characterData.sex,
    characterData.faction,
    characterData.price,
    characterData.user_id,
    ...characterData.inventory,
  ];

  const [queryResultsArr] = await mySqlConnection.query(preparedSql, preparedSqlData);
  const [createdCharacter] = (queryResultsArr as CreateCharacterQueryResult)[4];

  await mySqlConnection.end();

  return createdCharacter;
};
