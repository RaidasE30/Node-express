export type CharacterModel = {
  id: number,
  lvl: number,
  sex: string,
  build: {
    beginner: string,
    end_game: string
  },
  inventory: string[],
  faction: string,
  price: number
};

export default CharacterModel;
