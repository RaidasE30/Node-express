import { RequestHandler } from 'express';
import { CharacterModel } from '../types';
import CharacterService from '../../../services/character-service';

export const getCharacters: RequestHandler<
{},
CharacterModel[],
{},
{}
> = async (req, res) => {
  const characters = await CharacterService.getCharacters();
  res.status(200).json(characters);
};
