import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import { CharacterModel, PartialCharacterData } from '../types';
import partialCharacterDataValidationSchema from '../../validation-schemas/partial-character-data-validation-schema';
import CharacterService from '../../../services/character-service';

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
