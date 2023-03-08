import { RequestHandler } from 'express';
import { CharacterViewModel } from '../types';
import ErrorService from '../../services/error-service';
import CharactersModel from '../model';

export const getCharacter: RequestHandler<
{ id: string | undefined },
CharacterViewModel | ResponseError,
{},
{}
> = async (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    res.status(400).json({ error: 'server setup error' });
    return;
  }
  try {
    const character = await CharactersModel.getCharacter(id);
    res.status(200).json(character);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
