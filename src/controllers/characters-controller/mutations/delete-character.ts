// import { RequestHandler } from 'express';
// import { CharacterModel } from '../types';
//
//
// export const deleteCharacter: RequestHandler<
// { id: string | undefined },
// CharacterModel | ResponseError,
// {},
// {}
// > = (req, res) => {
//   const { id } = req.params;
//
//   if (id === undefined) {
//     res.status(400).json({ error: 'server setup error' });
//     return;
//   }
//
//   const foundHouseIndex = houses.findIndex((house) => house.id === id);
//
//   if (foundHouseIndex === -1) {
//     res.status(400).json({ error: `house was not found with id '${id}'` });
//     return;
//   }
//
//   const [deletedHouse] = houses.splice(foundHouseIndex, 1);
//
//   res.status(200).json(deletedHouse);
// };
