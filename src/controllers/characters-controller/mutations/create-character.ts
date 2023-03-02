import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import characterDataValidationSchema from '../../validation-schemas/character-data-validation-schema';
import { CharacterModel } from '../types';
import CharacterService from '../../../services/character-service';

export const createCharacter: RequestHandler<
{},
CharacterModel | ResponseError,
CharacterData,
{}
> = async (req, res) => {
  try {
    const characterData = characterDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    const createdCharacter = await CharacterService.createCharacter(characterData);

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
