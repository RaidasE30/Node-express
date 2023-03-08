import { RequestHandler } from 'express';
import { CharacterModel, PartialCharacterData } from '../types';
import partialCharacterDataValidationSchema from '../../validation-schemas/partial-character-data-validation-schema';
import CharacterService from '../../../services/character-service';
import ErrorService from '../../../services/error-service';

export const updateCharacter: RequestHandler<
{ id: string | undefined },
CharacterModel | ResponseError,
PartialCharacterData,
{}
> = async (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    res.status(400).json({ error: 'server setup error' });
    return;
  }

  try {
    const partialCharacterData = partialCharacterDataValidationSchema.validateSync(
      req.body,
      { abortEarly: false },
    );
    const updatedCharacter = await CharacterService.updateCharacter(id, partialCharacterData);
    res.status(200).json(updatedCharacter);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
