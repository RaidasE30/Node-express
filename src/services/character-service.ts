import mysql from 'mysql2/promise';
import { CharacterData, CharacterModel } from '../controllers/characters-controller/types';
import config from '../config';

type CreateCharacterQueryResult = [
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  CharacterModel[],
];

const CHARACTERS_QUERY_SQL_SELECT = `
SELECT 
  c.id, 
  c.sex, 
  JSON_OBJECT('beginner', b.beginner, 'End_game', b.end_game) as build, 
  c.price, 
  c.lvl, 
  JSON_ARRAYAGG(i.src) as inventory
  FROM inventory as i
  LEFT JOIN characters as c
  ON i.character_id = c.id
  LEFT JOIN builds as b
  ON c.build_id = b.id
`;
const CHARACTERS_QUERY_SQL_GROUP = 'GROUP BY c.id;';
const CHARACTERS_QUERY_SQL_WHERE_ID = 'WHERE c.id = ?';

const getCharacters = async (): Promise<CharacterModel[]> => {
  const mySqlConnection = await mysql.createConnection(config.db);
  const sql = [CHARACTERS_QUERY_SQL_SELECT, CHARACTERS_QUERY_SQL_GROUP].join('\n');
  const [characters] = await mySqlConnection.query<CharacterModel[]>(sql);

  return characters;
};

const getCharacter = async (id: string): Promise<CharacterModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = [CHARACTERS_QUERY_SQL_SELECT, CHARACTERS_QUERY_SQL_WHERE_ID, CHARACTERS_QUERY_SQL_GROUP].join('\n');
  const preparedSqlData = [id];
  const [characters] = await mySqlConnection.query<CharacterModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();

  if (characters.length === 0) {
    throw new Error(`character with id: ${id} does not exist`);
  }

  return characters[0];
};

const createCharacter = async (characterData: CharacterData): Promise<CharacterModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
      INSERT INTO builds (beginner, end_game) VALUES
      (?, ?);

      INSERT INTO characters (lvl, sex, faction, price, build_id) VALUES
      (?, ?, ?, ?, LAST_INSERT_ID());
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
    ...characterData.inventory,
  ];

  const [queryResultsArr] = await mySqlConnection.query(preparedSql, preparedSqlData);
  const [createdCharacter] = (queryResultsArr as CreateCharacterQueryResult)[4];

  await mySqlConnection.end();

  return createdCharacter;
};

const CharacterService = {
  getCharacter,
  getCharacters,
  createCharacter,
};

export default CharacterService;
