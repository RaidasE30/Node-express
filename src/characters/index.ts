import express, { RequestHandler } from 'express';
import authMiddleware from '../middlewares/auth-middleware';
import { getCharacters } from './queries/get-characters';
import { getCharacter } from './queries/get-character';
import { createCharacter } from './mutations/create-character';
import { updateCharacter } from './mutations/update-character';
import { deleteCharacter } from './mutations/delete-character';

const charactersRouter = express.Router();

charactersRouter.get('/', getCharacters);
charactersRouter.get('/:id', getCharacter);

charactersRouter.post('/', authMiddleware, createCharacter);
charactersRouter.patch('/:id', authMiddleware, updateCharacter as RequestHandler);
charactersRouter.delete('/:id', authMiddleware, deleteCharacter as RequestHandler);

export default charactersRouter;
