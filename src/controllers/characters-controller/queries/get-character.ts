import { RequestHandler } from 'express';
import { CharacterModel } from '../types';
import CharacterService from '../../../services/character-service';
import ErrorService from '../../../services/error-service';

export const getCharacter: RequestHandler<
{ id: string | undefined },
CharacterModel | ResponseError,
{},
{}
> = async (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    res.status(400).json({ error: 'server setup error' });
    return;
  }
  try {
    const character = await CharacterService.getCharacter(id);
    res.status(200).json(character);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
