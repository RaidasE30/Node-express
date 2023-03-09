import mysql from 'mysql2/promise';
import { CharacterViewModel, PartialCharacterBody } from '../types';
import config from '../../config';
import { colonObjectQueryFormat } from '../../services/my-sql';

export const updateCharacter = async (
  id: string,
  characterData: PartialCharacterBody,
): Promise<CharacterViewModel> => {
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
      WHERE c.id = :id
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

  const [queryResultArr] = await mySqlConnection.query<CharacterViewModel[]>(preparedSql, bindings);
  const updatedCharacter = queryResultArr.at(-1) as CharacterViewModel;

  await mySqlConnection.end();

  return updatedCharacter;
};
