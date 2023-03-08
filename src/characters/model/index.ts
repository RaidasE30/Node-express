import { getCharacter } from './get-character';
import { getCharacters } from './get-characters';
import { createCharacter } from './create-character';
import { updateCharacter } from './update-character';
import { deleteCharacter } from './delete-character';

const CharactersModel = {
  getCharacter,
  getCharacters,

  createCharacter,
  updateCharacter,
  deleteCharacter,
};

export default CharactersModel;
