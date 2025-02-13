import ITokenService from '@application/contracts/IToken.service';
import TokenPayload from '@application/models/TokenPayload.model';
import EnvironmentConfig from '@config/enviromentConfig';
import TYPES from '@config/identifiers';
import { injectable, inject } from 'inversify';
import * as jwt from 'jsonwebtoken';

@injectable()
class TokenService implements ITokenService {
  constructor(
    @inject(TYPES.EnvironmentConfig) private readonly _env: EnvironmentConfig
  ) {}

  public async generateToken(payload: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this._env.jwtSecret,
        { expiresIn: this._env.jwtExpireAccessToken },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token as string);
          }
        }
      );
    });
  }

  public async verifyToken(token: string): Promise<TokenPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this._env.jwtSecret, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as TokenPayload);
        }
      });
    });
  }
}

export default TokenService;
