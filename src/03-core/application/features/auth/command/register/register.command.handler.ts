import TYPES from '@config/identifiers';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler, Mediator } from 'mediatr-ts';
import RegisterCommand from './register.command';
import IUserRepository from '@domain/repositories/IUser.repository';
import UserDomain from '@domain/user/User.domain';
import AuthenticationResult from '@application/models/authentication-result.model';
import IUnitOfWork from '@domain/repositories/commun/IUnitOfWork';
import IPasswordService from '@application/contracts/Ipassword.service';
import ITokenService from '@application/contracts/IToken.service';
import ResultT from '@domain/abstract/result/resultT';
import Result from '@domain/abstract/result/result';
import UserErrors from '@domain/user/error/user.error';
import UserApplicationErrors from '@application/errors/user.application.error';

@injectable()
@requestHandler(RegisterCommand)
class RegisterCommandHandler
  implements IRequestHandler<RegisterCommand, ResultT<AuthenticationResult>>
{
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IUnitOfWork) private readonly _unitOfWork: IUnitOfWork,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IPasswordService) private _passwordService: IPasswordService
  ) {}
  async handle(
    command: RegisterCommand
  ): Promise<ResultT<AuthenticationResult>> {
    // const validation = await this.validate(command.email, command.username);
    // if (validation.isFailure) {
    //   return ResultT.Failure<AuthenticationResult>(validation.error);
    // }

    const passwordHash = await this._passwordService.encrypt(command.password);

    const userResult = UserDomain.create({
      username: command.username,
      email: command.email,
      passwordHash: passwordHash,
    });
    if (userResult.isFailure) {
      return ResultT.Failure<AuthenticationResult>(userResult.error);
    }
    const user = userResult.value;
    try {
      await this._unitOfWork.startTransaction();

      await this._unitOfWork.userRepository.registerUser(user);

      this._unitOfWork.collectDomainEvents([user]);

      await this._unitOfWork.commit();
    } catch (error) {
      await this._unitOfWork.rollback();

      return ResultT.Failure<AuthenticationResult>(
        UserApplicationErrors.USER_CREATE_ERROR(`${error}`)
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
  private async validate(email: string, username: string): Promise<Result> {
    if (!email && !username) {
      return Result.Failure(UserErrors.USER_UNERNAME_EMAIL_REQUIRED);
    }
    const userEmail = await this._userRepository.getUserByEmail(email);
    if (userEmail.isFailure) {
      return Result.Failure(userEmail.error);
    }
    if (userEmail.value) {
      return Result.Failure(UserErrors.USER_ALREADY_EXISTS('email', email));
    }
    const userUsername = await this._userRepository.getUserByUsername(username);
    if (userUsername.isFailure) {
      return Result.Failure(userUsername.error);
    }
    if (userUsername.value) {
      return Result.Failure(
        UserErrors.USER_ALREADY_EXISTS('username', username)
      );
    }
    return Result.Success();
  }
}
export default RegisterCommandHandler;
