import TYPES from '@config/identifiers';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import LoginCommand from './login.command';
import IUserRepository from '@domain/repositories/IUser.repository';
import UserDomain from '@domain/user/User.domain';
import AuthenticationResult from '@application/models/authentication-result.model';
import ITokenService from '@application/contracts/IToken.service';
import IPasswordService from '@application/contracts/Ipassword.service';
import ResultT from '@domain/abstract/result/resultT';
import UserErrors from '@domain/user/error/user.error';
import AuthApplicationErrors from '@application/errors/auth.application.error';

@injectable()
@requestHandler(LoginCommand)
class LoginCommandHandler
  implements IRequestHandler<LoginCommand, ResultT<AuthenticationResult>>
{
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IPasswordService) private _passwordService: IPasswordService
  ) {}
  async handle(command: LoginCommand): Promise<ResultT<AuthenticationResult>> {
    this.validate(command.email, command.username);
    const userResult = await this.getUser(command.email, command.username);

    if (userResult.isFailure) {
      return ResultT.Failure<AuthenticationResult>(userResult.error);
    }

    const user = userResult.value;

    const isValidPassword = await this._passwordService.decrypt(
      command.password,
      user.properties.passwordHash
    );
    if (!isValidPassword) {
      return ResultT.Failure<AuthenticationResult>(
        AuthApplicationErrors.CREDENTIAL_INCORRECT
      );
    }

    const token = await this._tokenService.generateToken({
      userId: user.properties.id!,
      username: user.properties.username,
      email: user.properties.email,
    });
    return ResultT.Success<AuthenticationResult>(
      new AuthenticationResult(token, true, '')
    );
  }
  private validate(email: string, username: string): void {
    if (!email && !username) {
      throw new Error('Email or username is required.');
    }
  }
  private async getUser(
    email: string,
    username: string
  ): Promise<ResultT<UserDomain>> {
    let user: UserDomain | null = null;
    if (email) {
      const userEmailResult = await this._userRepository.getUserByEmail(email);
      if (userEmailResult.isFailure) {
        return ResultT.Failure<UserDomain>(userEmailResult.error);
      }
      if (userEmailResult.value) {
        user = userEmailResult.value;
      }
    }
    if (!user && username) {
      const userUsername = await this._userRepository.getUserByUsername(
        username
      );
      if (userUsername.isFailure) {
        return ResultT.Failure<UserDomain>(userUsername.error);
      }
      if (userUsername.value) {
        user = userUsername.value;
      }
    }
    if (!user) {
      return ResultT.Failure<UserDomain>(UserErrors.USER_NOT_FOUND);
    }
    return ResultT.Success<UserDomain>(user);
  }
}
export default LoginCommandHandler;
