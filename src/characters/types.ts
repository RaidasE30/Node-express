import { RowDataPacket } from 'mysql2';

export interface CharacterViewModel extends RowDataPacket {
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

export type CharacterDetails = Omit<CharacterViewModel, 'id'>;

export type PartialCharacterDetails = Partial<CharacterDetails>;
