import ResultT from '@domain/abstract/result/resultT';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import UserErrors from '../error/user.error';

class UserId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value?: string): ResultT<UserId> {
    if (!value) {
      value = uuidv4();
    }
    if (!this.validate(value)) {
      return ResultT.Failure<UserId>(UserErrors.USER_INVALID_ID(value));
    }
    return ResultT.Success<UserId>(new UserId(value));
  }

  private static validate(value: string): boolean {
    if (!value) {
      return false;
    }
    if (!uuidValidate(value)) {
      return false;
    }
    return true;
  }

  get value(): string {
    return this._value;
  }

  public equals(other: UserId): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}
export default UserId;
