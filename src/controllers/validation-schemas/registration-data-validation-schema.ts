import * as yup from 'yup';
import { RegistrationData } from '../../auth/types';

const registrationDataValidationSchema: yup.ObjectSchema<RegistrationData> = yup.object({
  email: yup.string()
    .required('email is required')
    .email('incorrect email format'),

  password: yup.string()
    .required('password is required')
    .min(2, 'password must have at least 2 symbols')
    .max(32, 'password can\'t have more than 32 symbols')
    .matches(/[A-Z]{1}/, 'password must have at least one upper case letter')
    .matches(/[a-z]{1}/, 'password must have at least one lower case letter')
    .matches(/[0-9]{1}/, 'password must have at least one number')
    .matches(/[#?!@$%^&*-]{1}/, 'password must have at least special character'),

  passwordConfirmation: yup.string()
    .required('password must be confirmed')
    .oneOf([yup.ref('password')], 'passowords must match'),

  first_name: yup.string()
    .required('first name is required')
    .min(2, 'first name must have at least 2 symbols')
    .max(32, 'first name can\'t have more than 32 symbols'),

  last_name: yup.string()
    .required('last name is required')
    .min(2, 'last name must have at least 2 symbols')
    .max(32, 'last name can\'t have more than 32 symbols'),
}).strict(true);

export default registrationDataValidationSchema;
