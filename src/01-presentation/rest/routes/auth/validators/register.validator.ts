import messagesValidator from '@rest/helpers/messages-validator';
import regularExps from '@domain/helpers/regular-exp';
import { body } from 'express-validator';

const RegisterValidation = [
  body('email').isEmail().withMessage(messagesValidator.emailRequired),

  body('password')
    .matches(regularExps.passwordRegex)
    .withMessage(messagesValidator.passwordRequirements),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage(messagesValidator.passwordMismatch),
];

export default RegisterValidation;
