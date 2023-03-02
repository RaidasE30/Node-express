import { RequestHandler } from 'express';
import { CharacterModel } from '../types';
import CharacterService from '../../../services/character-service';

export const deleteCharacter: RequestHandler<
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
    await CharacterService.deleteCharacter(id);
    res.status(200).json(character);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: 'Request error' });
    }
  }
};
