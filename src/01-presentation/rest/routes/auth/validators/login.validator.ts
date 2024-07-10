import messagesValidator from '@rest/helpers/messages-validator';
import regularExps from '@domain/helpers/regular-exp';
import { body } from 'express-validator';

const LoginValidation = [
  body('email').isEmail().withMessage(messagesValidator.emailRequired),
  body('password')
    .exists()
    .withMessage(messagesValidator.required)
    .matches(regularExps.passwordRegex)
    .withMessage(messagesValidator.passwordRequirements),
];
export default LoginValidation;
