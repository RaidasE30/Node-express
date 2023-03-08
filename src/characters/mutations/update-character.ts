import { RequestHandler } from 'express';
import { CharacterViewModel, PartialCharacterDetails } from '../types';
import partialCharacterDataValidationSchema from '../validation-schemas/partial-character-data-validation-schema';
import ErrorService from '../../services/error-service';
import CharactersModel from '../model';

export const updateCharacter: RequestHandler<
{ id: string | undefined },
CharacterViewModel | ResponseError,
PartialCharacterDetails,
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
    const updatedCharacter = await CharactersModel.updateCharacter(id, partialCharacterData);
    res.status(200).json(updatedCharacter);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
