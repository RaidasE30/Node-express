import { RequestHandler } from 'express';
import { CharacterModel } from '../types';
import CharacterService from '../../../services/character-service';

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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'request error';
    res.status(404).json({ error: message });
  }
};
