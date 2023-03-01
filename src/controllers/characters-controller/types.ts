import { RowDataPacket } from 'mysql2';

export interface CharacterModel extends RowDataPacket {
  id: number,
  lvl: number,
  sex: string,
  builds: {
    beginner: string,
    end_game: string
  },
  inventory: string[],
  faction: string,
  price: number
}

export type CharacterData = Omit<CharacterModel, 'id'>;

export type PartialCharacterData = Partial<CharacterData>;
