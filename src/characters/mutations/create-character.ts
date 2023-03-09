import { RequestHandler } from 'express';
import characterDataValidationSchema from '../validation-schemas/character-data-validation-schema';
import { CharacterViewModel, PartialCharacterBody } from '../types';
import ErrorService, { ServerSetupError } from '../../services/error-service';
import CharactersModel from '../model';
import UserModel from '../../models/user-model/model';

export const createCharacter: RequestHandler<
{},
CharacterViewModel | ResponseError,
PartialCharacterBody,
{}
> = async (req, res) => {
  try {
    const characterData = characterDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    if (req.authData === undefined) throw new ServerSetupError();

    const user = await UserModel.getUserByEmail(req.authData.email);

    const createdCharacter = await CharactersModel
      .createCharacter({ ...characterData, user_id: user.id });
    res.status(201).json(createdCharacter);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
