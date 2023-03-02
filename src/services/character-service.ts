import mysql from 'mysql2/promise';
import { CharacterData, CharacterModel, PartialCharacterData } from '../controllers/characters-controller/types';
import config from '../config';
import { colonObjectQueryFormat } from './my-sql';

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

const updateCharacter = async (
  id: string,
  characterData: PartialCharacterData,
): Promise<CharacterModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);
  mySqlConnection.config.queryFormat = colonObjectQueryFormat;

  const inventoryBindings = characterData
    .inventory?.reduce((prevBindings: any, img: string, i: number) => ({
      ...prevBindings,
      [`img${i + 1}`]: img,
    }), {} as Record<string, string>) ?? null;
  const shouldAddNewImages = characterData
    .inventory !== undefined && characterData.inventory.length > 0;
  const imagesUpdatePreparedSql = inventoryBindings !== null
    ? `
  DELETE FROM inventory
  WHERE inventory.character_id = :id;
  
  ${shouldAddNewImages ? `INSERT INTO inventory (src, character_id) VALUES
    ${Object.keys(inventoryBindings).map((invBinding) => `(:${invBinding}, :id)`).join(',\n')};`
    : ''}
  ` : '';

  const buildExist = characterData.builds !== undefined;
  const buildInsertSql = buildExist ? `
  INSERT INTO builds (beginner, end_game) VALUES
  (:beginner, :end_game);` : '';

  const characterSetPropsSql = [
    characterData.lvl !== undefined ? 'lvl = :lvl' : null,
    characterData.sex !== undefined ? 'sex = :sex' : null,
    characterData.price !== undefined ? 'price = :price' : null,
    characterData.faction !== undefined ? 'faction = :faction' : null,
    buildExist ? 'build_id = LAST_INSERT_ID()' : null,
  ].filter((setPropSql) => setPropSql !== null).join(',\n');

  const preparedSql = `
  ${imagesUpdatePreparedSql}
  ${buildInsertSql}
  
  ${characterSetPropsSql.length > 0 ? `
  UPDATE characters SET
    ${characterSetPropsSql}
    WHERE characters.id = :id;
  ` : ''}
  
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
      `.trim();

  const bindings = {
    id,
    ...inventoryBindings,
    ...characterData.builds,
    lvl: characterData.lvl,
    sex: characterData.sex,
    faction: characterData.faction,
    price: characterData.price,
  };

  const [queryResultArr] = await mySqlConnection.query<CharacterModel[]>(preparedSql, bindings);
  const updatedCharacter = queryResultArr.at(-1) as CharacterModel;

  await mySqlConnection.end();

  return updatedCharacter;
};

const deleteCharacter = async (id: string): Promise<void> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
  DELETE FROM inventory WHERE character_id = ?;
  DELETE FROM characters WHERE id = ?;
  DELETE FROM builds WHERE id = ?;
  `;
  const preparedSqlData = [id, id, id];

  await mySqlConnection.query<CharacterModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();
};

const CharacterService = {
  getCharacter,
  getCharacters,
  createCharacter,
  deleteCharacter,
  updateCharacter,
};

export default CharacterService;
