import AuthenticationResult from '@application/models/authentication-result.model';
import ResultT from '@domain/abstract/result/resultT';
import { IRequest } from 'mediatr-ts';

class RegisterCommand implements IRequest<ResultT<AuthenticationResult>> {
  constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly password: string
  ) {}
}

export default RegisterCommand;
