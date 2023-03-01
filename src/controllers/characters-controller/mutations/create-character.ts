import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import mysql from 'mysql2/promise';
import characterDataValidationSchema from '../../validation-schemas/character-data-validation-schema';
import { CharacterModel } from '../types';
import config from '../../../config';

type CreateCharacterQueryResult = [
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  CharacterModel[],
];

export const createCharacter: RequestHandler<
{},
CharacterModel | ResponseError,
CharacterData,
{}
> = async (req, res) => {
  try {
    const characterData = characterDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

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

    res.status(201).json(createdCharacter);
  } catch (err) {
    if (err instanceof ValidationError) {
      const manyErrors = err.errors.length > 1;
      res.status(400).json({
        error: manyErrors ? 'Validation errors' : err.errors[0],
        errors: manyErrors ? err.errors : undefined,
      });
    } else if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: 'Request error' });
    }
  }
};
