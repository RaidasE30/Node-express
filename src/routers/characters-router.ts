import express from 'express';
import {
  getCharacters,
  getCharacter,
  createCharacter,
  // updateCharacter,
  // deleteCharacter,
} from '../controllers/characters-controller';

const charactersRouter = express.Router();

charactersRouter.get('/', getCharacters);
charactersRouter.get('/:id', getCharacter);
charactersRouter.post('/', createCharacter);
// charactersRouter.patch('/:id', updateCharacter);
// charactersRouter.delete('/:id', deleteCharacter);

export default charactersRouter;
