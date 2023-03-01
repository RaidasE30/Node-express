import mysql from 'mysql2/promise';
import { CharacterModel } from '../controllers/characters-controller/types';
import config from '../config';

type CharactersQuerySettings = undefined | {
  characterId: string
};

type CharactersQueryResult<T extends CharactersQuerySettings> =
    T extends undefined ? CharacterModel[] : CharacterModel;

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

const charactersQuery = async <T extends CharactersQuerySettings = undefined>(
  settings?: T,
) => {
  const mySqlConnection = await mysql.createConnection(config.db);
  let result: CharacterModel | CharacterModel[];

  if (settings === undefined) {
    const [characters] = await mySqlConnection.query<CharacterModel[]>(
      [CHARACTERS_QUERY_SQL_SELECT, CHARACTERS_QUERY_SQL_GROUP].join('\n'),
    );

    result = characters;
  } else {
    const preparedSql = [
      CHARACTERS_QUERY_SQL_SELECT,
      CHARACTERS_QUERY_SQL_WHERE_ID,
      CHARACTERS_QUERY_SQL_GROUP,
    ].join('\n');
    const preparedSqlData = [settings.characterId];

    const [character] = await mySqlConnection.query<CharacterModel[]>(
      preparedSql,
      preparedSqlData,
    );

    if (character.length === 0) {
      throw new Error(`character with id: ${settings.characterId} does not exist`);
    }

    result = character;
  }

  await mySqlConnection.end();

  return result as CharactersQueryResult<T>;
};

const getCharacters = async (): Promise<CharacterModel[]> => charactersQuery();

const getCharacter = async (id: string): Promise<CharacterModel> => charactersQuery(
  { characterId: id },
);

const CharacterService = {
  getCharacter,
  getCharacters,
};

export default CharacterService;
