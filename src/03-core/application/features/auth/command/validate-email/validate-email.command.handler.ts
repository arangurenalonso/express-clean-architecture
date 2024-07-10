import TYPES from 'src/00-config/identifiers';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import IUserRepository from '@domain/repositories/IUser.repository';
import ITokenService from '@application/contracts/IToken.service';
import ValidateEmailCommand from './validate-email.command';

@injectable()
@requestHandler(ValidateEmailCommand)
class ValidateEmailCommandHandler
  implements IRequestHandler<ValidateEmailCommand, void>
{
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService
  ) {}
  async handle(command: ValidateEmailCommand): Promise<void> {
    const payload = await this._tokenService.verifyToken(command.token);
    await this._userRepository.validateEmail(payload.userId);
  }
}
export default ValidateEmailCommandHandler;
