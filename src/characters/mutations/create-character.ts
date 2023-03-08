import { RequestHandler } from 'express';
import characterDataValidationSchema from '../validation-schemas/character-data-validation-schema';
import { CharacterViewModel, PartialCharacterDetails } from '../types';
import ErrorService from '../../services/error-service';
import CharactersModel from '../model';

export const createCharacter: RequestHandler<
{},
CharacterViewModel | ResponseError,
PartialCharacterDetails,
{}
> = async (req, res) => {
  try {
    const characterData = characterDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    const createdCharacter = await CharactersModel.createCharacter(characterData);

    res.status(201).json(createdCharacter);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
