import * as yup from 'yup';
import { badEmail, badPassword } from '../modules/register/errorMessages';

export const registerSchema = yup.object({
  email: yup
    .string()
    .email(badEmail)
    .required(),
  password: yup
    .string()
    .min(6, badPassword)
    .max(255)
    .required(),
});