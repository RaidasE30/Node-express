import * as Yup from 'yup';
import { CharacterBody } from '../types';

const characterDataValidationSchema: Yup.ObjectSchema<CharacterBody> = Yup.object({
  lvl: Yup.number()
    .min(1, 'level can\'t be lower than 1')
    .max(1000, 'level can\'t be higher than 1000')
    .required('level is required'),

  sex: Yup.string()
    .matches(/(male|female)/, 'Must contain either "male" or "female"')
    .required('price is required'),

  inventory: Yup.array(Yup.string().required())
    .required('inventory images are required')
    .min(1, 'inventory must have at least one image')
    .required('inventory is required'),

  builds: Yup.object({
    beginner: Yup.string()
      .min(3, 'beginner build must be at least 3 characters')
      .max(32, 'beginner build can\'t be longer than 32 characters')
      .required('beginner build is required'),
    end_game: Yup.string()
      .min(3, 'end_game build must be at least 3 characters')
      .max(32, 'end_game build can\'t be longer than 32 characters')
      .required('end_game build is required'),
  }),

  faction: Yup.string()
    .min(3, 'faction must be at 3 characters')
    .max(32, 'faction can\'t be longer than 32 characters')
    .required('rating is required'),

  price: Yup.number()
    .min(1, 'price can\'t be lower than 1')
    .max(1000, 'price can\'t be higher than 1000')
    .required('level is required'),
}).strict(true);

export default characterDataValidationSchema;
