import * as Yup from 'yup';
import { PartialHouseData } from '../houses-controller/types';

const partialHouseDataValidationSchema: Yup.ObjectSchema<PartialHouseData> = Yup.object({
  title: Yup.string()
    .min(3, 'title mus be at least 3 characters')
    .max(32, 'title can\'t be longer than 32 characters'),

  price: Yup.string()
    .matches(/^[0-9]+€$/),

  rating: Yup.number()
    .min(1, 'rating must be at least 1')
    .max(5, 'rating must be at least 5'),

  images: Yup.array(Yup.string().required())
    .min(1, 'images must have at least one image'),

  location: Yup.object({
    city: Yup.string()
      .min(3, 'city must be at least 3 characters')
      .max(32, 'city can\'t be longer than 32 characters')
      .required('city is required'),
    country: Yup.string()
      .min(3, 'country must be at least 3 characters')
      .max(32, 'country can\'t be longer than 32 characters')
      .required('country is required'),
  }),
}).strict(true);

export default partialHouseDataValidationSchema;
