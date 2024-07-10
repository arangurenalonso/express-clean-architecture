import AuthenticationResult from '@application/models/authentication-result.model';
import { IRequest } from 'mediatr-ts';

class RegisterCommand implements IRequest<AuthenticationResult> {
  constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly password: string
  ) {}
}

export default RegisterCommand;
