import ResultT from '@domain/abstract/result/resultT';
import regularExps from '@domain/helpers/regular-exp';
import UserErrors from '../error/user.error';

class PasswordHash {
  private readonly _value: string;

  private constructor(value: string) {
    if (!value || value.length === 0) {
      throw new Error('Password hash cannot be empty.');
    }
    this._value = value;
  }

  public static create(value: string): ResultT<PasswordHash> {
    // const validationResult = this.validate(value);
    // if (!validationResult.isValid) {
    //   return ResultT.Failure<PasswordHash>(
    //     UserErrors.USER_INVALID_PASSWORD(validationResult.reasons)
    //   );
    // }
    return ResultT.Success<PasswordHash>(new PasswordHash(value));
  }
  private static validate(value: string): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (!value.match(/.{6,}/)) {
      reasons.push('Password must be at least 6 characters long');
    }
    if (!value.match(/(?=.*[a-z])/)) {
      reasons.push('Password must contain at least one lowercase letter');
    }
    if (!value.match(/(?=.*[A-Z])/)) {
      reasons.push('Password must contain at least one uppercase letter');
    }
    if (!value.match(/(?=.*\d)/)) {
      reasons.push('Password must contain at least one number');
    }
    if (!value.match(/(?=.*[@$!%*?&])/)) {
      reasons.push(
        'Password must contain at least one special character (@$!%*?&)'
      );
    }

    return { isValid: reasons.length === 0, reasons };
  }
  get value(): string {
    return this._value;
  }

  public equals(other: PasswordHash): boolean {
    return this.value === other.value;
  }
}
export default PasswordHash;
