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
  price: number,
  owner: {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
  }
}

export type CharacterDetails = Omit<CharacterViewModel, 'id' | 'owner'> & { user_id: number };

export type CharacterBody = Omit<CharacterDetails, 'user_id'>;

export type PartialCharacterBody = Partial<CharacterBody>;
