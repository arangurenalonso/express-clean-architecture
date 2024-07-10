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
import IOutboxMessageRepository from '@domain/repositories/IOutboxMessage.repository';

@injectable()
@requestHandler(RegisterCommand)
class RegisterCommandHandler
  implements IRequestHandler<RegisterCommand, AuthenticationResult>
{
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IUnitOfWork) private readonly _unitOfWork: IUnitOfWork,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IPasswordService) private _passwordService: IPasswordService
  ) {}
  async handle(command: RegisterCommand): Promise<AuthenticationResult> {
    await this.validate(command.email, command.username);

    const passwordHash = await this._passwordService.encrypt(command.password);

    const user = UserDomain.create({
      username: command.username,
      email: command.email,
      passwordHash: passwordHash,
    });

    try {
      await this._unitOfWork.startTransaction();
      await this._unitOfWork.userRepository.registerUser(user);
      this._unitOfWork.collectDomainEvents([user]);

      await this._unitOfWork.commit();
    } catch (error) {
      await this._unitOfWork.rollback();
      throw error;
    }
    const token = await this._tokenService.generateToken({
      userId: user.properties.id!,
      username: user.properties.username,
      email: user.properties.email,
    });
    return new AuthenticationResult(token, true, '');
  }
  private async validate(email: string, username: string): Promise<void> {
    if (!email && !username) {
      throw new Error('Email or username is required.');
    }
    const userEmail = await this._userRepository.getUserByEmail(email);
    if (userEmail) {
      throw new Error(`User with email ${email} already exist.`);
    }
    const userUsername = await this._userRepository.getUserByUsername(username);
    if (userUsername) {
      throw new Error(`User with username ${username} already exist.`);
    }
  }
}
export default RegisterCommandHandler;
