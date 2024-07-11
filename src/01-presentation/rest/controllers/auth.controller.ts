import LoginCommand from '@application/features/auth/command/login/login.command';
import RegisterCommand from '@application/features/auth/command/register/register.command';
import ValidateEmailCommand from '@application/features/auth/command/validate-email/validate-email.command';
import AuthenticationResult from '@application/models/authentication-result.model';
import TYPES from '@config/identifiers';
import ResultT from '@domain/abstract/result/resultT';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Mediator } from 'mediatr-ts';

@injectable()
class AuthController {
  constructor(@inject(TYPES.Mediator) private _mediator: Mediator) {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  public async login(req: Request, res: Response) {
    const { email, password, username } = req.body as {
      email: string;
      password: string;
      username: string;
    };
    const command = new LoginCommand(username, email, password);
    const tokenResult: ResultT<AuthenticationResult> =
      await this._mediator.send(command);
    return tokenResult;
  }
  public async register(req: Request, res: Response) {
    const { email, password, username } = req.body as {
      email: string;
      password: string;
      username: string;
    };
    const command = new RegisterCommand(username, email, password);
    const tokenResult = await this._mediator.send(command);
    return tokenResult;
  }
  public async validateEmail(req: Request, res: Response) {
    const { token } = req.params;

    const command = new ValidateEmailCommand(token);
    await this._mediator.send(command);
    return 'Email validated';
  }
}
export default AuthController;
