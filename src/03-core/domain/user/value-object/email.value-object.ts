import ResultT from '@domain/abstract/result/resultT';
import regularExps from '@domain/helpers/regular-exp';
import UserErrors from '../error/user.error';

class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value?: string | null): ResultT<Email | null> {
    if (!value) {
      return ResultT.Success<null>(null);
    }
    if (!this.validate(value)) {
      return ResultT.Failure<Email | null>(
        UserErrors.USER_INVALID_EMAIL(value)
      );
    }
    return ResultT.Success<Email>(new Email(value));
  }
  private static validate(value: string): boolean {
    return regularExps.email.test(value);
  }

  get value(): string {
    return this._value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}
export default Email;
