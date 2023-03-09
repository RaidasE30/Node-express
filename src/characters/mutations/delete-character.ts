import { RequestHandler } from 'express';
import { CharacterViewModel } from '../types';
import ErrorService, { ForbiddenError, ServerSetupError } from '../../services/error-service';
import CharactersModel from '../model';
import UserModel from '../../models/user-model/model';

export const deleteCharacter: RequestHandler<
{ id: string | undefined },
CharacterViewModel | ResponseError,
{},
{}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    if (req.authData === undefined) throw new ServerSetupError();
    const user = await UserModel.getUserByEmail(req.authData.email);
    const character = await CharactersModel.getCharacter(id);

    if (user.role !== 'ADMIN' && user.id !== character.owner.id) throw new ForbiddenError();

    await CharactersModel.deleteCharacter(id);

    res.status(200).json(character);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
