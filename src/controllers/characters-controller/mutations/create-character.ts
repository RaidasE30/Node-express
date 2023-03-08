import { RequestHandler } from 'express';
import characterDataValidationSchema from '../../validation-schemas/character-data-validation-schema';
import { CharacterModel } from '../types';
import CharacterService from '../../../services/character-service';
import ErrorService from '../../../services/error-service';

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
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
