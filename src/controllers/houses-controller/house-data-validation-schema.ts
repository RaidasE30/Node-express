import * as Yup from 'yup';
import { HouseData } from './types';

const houseDataValidationSchema: Yup.ObjectSchema<HouseData> = Yup.object({
  title: Yup.string()
    .min(3, 'title mus be at least 3 characters')
    .max(32, 'title can\'t be longer than 32 characters')
    .required('title is required'),

  price: Yup.string()
    .matches(/^[0-9]+€$/)
    .required('price is required'),

  rating: Yup.number()
    .min(1, 'rating must be at least 1')
    .max(5, 'rating must be at least 5')
    .required('rating is required'),
  images: Yup.array(Yup.string().required())
    .required('images are required')
    .min(1, 'images must have at least one image'),

  location: Yup.object({
    city: Yup.string()
      .min(3, 'city must be at least 3 characters')
      .max(32, 'city can\'t be longer than 32 characters')
      .required('city is required'),
    country: Yup.string()
      .min(3, 'country must be at least 3 characters')
      .max(32, 'country can\'t be longer than 32 characters')
      .required(),
  }),
}).strict(true);

export default houseDataValidationSchema;
