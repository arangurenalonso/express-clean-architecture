import IEmailService from '@application/contracts/IEmail.service';
import ITokenService from '@application/contracts/IToken.service';
import EnvironmentConfig from '@config/enviromentConfig';
import TYPES from '@config/identifiers';
import IUserRepository from '@domain/repositories/IUser.repository';
import UserCreatedDomainEvent from '@domain/user/events/user-created.domain-event';
import UserDomain from '@domain/user/User.domain';
import { inject, injectable } from 'inversify';
import { notificationHandler, INotificationHandler } from 'mediatr-ts';

@notificationHandler(UserCreatedDomainEvent)
@injectable()
class UserCreatedDomainEventHandler
  implements INotificationHandler<UserCreatedDomainEvent>
{
  constructor(
    @inject(TYPES.EnvironmentConfig) private _envs: EnvironmentConfig,
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IEmailService) private _emailService: IEmailService
  ) {}
  async handle(notification: UserCreatedDomainEvent): Promise<void> {
    const user = await this.getUser(notification.value);

    await this.sendEmailValidationLink(user);
  }
  private async getUser(id?: string): Promise<UserDomain> {
    let user: UserDomain | null = null;
    if (id) {
      const userResult = await this._userRepository.getUserById(id);
      if (userResult.isFailure) {
        throw new Error(userResult.error.toString());
      }
      user = userResult.value;
    }
    if (!user) {
      throw new Error(`user not found. id: '${id}'`);
    }
    return user;
  }
  private sendEmailValidationLink = async (userDomain: UserDomain) => {
    const token = await this._tokenService.generateToken({
      userId: userDomain.properties.id!,
      email: userDomain.properties.email,
      username: userDomain.properties.username,
    });

    const link = `${this._envs.webserviceUrl}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${userDomain.properties.email}</a>
    `;

    const isSent = await this._emailService.sendEmail(
      userDomain.properties.email!,
      'Validate your email',
      html
    );
    console.log('email sent', isSent);

    return true;
  };
}
export default UserCreatedDomainEventHandler;
