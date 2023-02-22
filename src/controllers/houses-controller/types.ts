export type HouseModel = {
  id: string,
  title: string,
  location: {
    country: string,
    city: string
  },
  images: string[],
  price: string,
  rating: number
};

export type HouseData = Omit<HouseModel, 'id'>;

export type PartialHouseData = Partial<HouseData>;
