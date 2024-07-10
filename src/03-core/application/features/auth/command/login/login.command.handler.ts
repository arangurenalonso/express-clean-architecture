import TYPES from 'src/00-config/identifiers';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import LoginCommand from './login.command';
import IUserRepository from '@domain/repositories/IUser.repository';
import UserDomain from '@domain/user/User.domain';
import AuthenticationResult from '@application/models/authentication-result.model';
import ITokenService from '@application/contracts/IToken.service';
import IPasswordService from '@application/contracts/Ipassword.service';

@injectable()
@requestHandler(LoginCommand)
class LoginCommandHandler
  implements IRequestHandler<LoginCommand, AuthenticationResult>
{
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IPasswordService) private _passwordService: IPasswordService
  ) {}
  async handle(command: LoginCommand): Promise<AuthenticationResult> {
    this.validate(command.email, command.username);
    const user = await this.getUser(command.email, command.username);
    const isValidPassword = await this._passwordService.decrypt(
      command.password,
      user.properties.passwordHash
    );
    if (!isValidPassword) {
      return new AuthenticationResult('', false, 'password incorrecto');
    }

    const token = await this._tokenService.generateToken({
      userId: user.properties.id!,
      username: user.properties.username,
      email: user.properties.email,
    });
    return new AuthenticationResult(token, true, '');
  }
  private validate(email: string, username: string): void {
    if (!email && !username) {
      throw new Error('Email or username is required.');
    }
  }
  private async getUser(email: string, username: string): Promise<UserDomain> {
    let user: UserDomain | null = null;
    if (email) {
      user = await this._userRepository.getUserByEmail(email);
    }
    if (!user && username) {
      user = await this._userRepository.getUserByUsername(username);
    }
    if (!user) {
      throw new Error('user not found.');
    }
    return user;
  }
}
export default LoginCommandHandler;
