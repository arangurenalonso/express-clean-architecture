import IPasswordService from '@application/contracts/Ipassword.service';
import EnvironmentConfig from '@config/enviromentConfig';
import TYPES from '@config/identifiers';
import * as bcrypt from 'bcryptjs';
import { inject, injectable } from 'inversify';

@injectable()
class PasswordService implements IPasswordService {
  constructor(
    @inject(TYPES.EnvironmentConfig) private readonly _env: EnvironmentConfig
  ) {}

  public async encrypt(password: string): Promise<string> {
    return bcrypt.hash(password, this._env.saltRounds);
  }

  public async decrypt(password: string, textHashed: string): Promise<boolean> {
    return bcrypt.compare(password, textHashed);
  }
}
export default PasswordService;
