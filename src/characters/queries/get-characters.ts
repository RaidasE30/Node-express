import { RequestHandler } from 'express';
import { CharacterViewModel } from '../types';
import CharactersModel from '../model';

export const getCharacters: RequestHandler<
{},
CharacterViewModel[],
{},
{}
> = async (req, res) => {
  const characters = await CharactersModel.getCharacters();
  res.status(200).json(characters);
};
