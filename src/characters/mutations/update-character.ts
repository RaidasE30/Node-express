import { RequestHandler } from 'express';
import { CharacterViewModel, PartialCharacterBody } from '../types';
import partialCharacterDataValidationSchema from '../validation-schemas/partial-character-data-validation-schema';
import ErrorService, { ForbiddenError, ServerSetupError } from '../../services/error-service';
import CharactersModel from '../model';
import UserModel from '../../models/user-model/model';

export const updateCharacter: RequestHandler<
{ id: string | undefined },
CharacterViewModel | ResponseError,
PartialCharacterBody,
{}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    if (req.authData === undefined) throw new ServerSetupError();
    const partialCharacterData = partialCharacterDataValidationSchema.validateSync(
      req.body,
      { abortEarly: false },
    );

    const user = await UserModel.getUserByEmail(req.authData.email);
    const character = await CharactersModel.getCharacter(id);
    if (user.role !== 'ADMIN' && user.id !== character.owner.id) throw new ForbiddenError();

    const updatedCharacter = await CharactersModel.updateCharacter(id, partialCharacterData);
    res.status(200).json(updatedCharacter);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
