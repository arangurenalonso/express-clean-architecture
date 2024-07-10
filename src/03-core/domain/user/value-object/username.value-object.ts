import ResultT from '@domain/abstract/result/resultT';
import regularExps from '@domain/helpers/regular-exp';
import UserErrors from '../error/user.error';

class Username {
  private readonly _value: string;

  private constructor(value: string) {
    if (!Username.validate(value)) {
      throw new Error('The Username is not a valid Username.');
    }
    this._value = value;
  }

  public static create(value?: string | null): ResultT<Username | null> {
    if (!value) {
      return ResultT.Success<null>(null);
    }
    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return ResultT.Failure<Username | null>(
        UserErrors.USER_INVALID_USERNAME(validationResult.reasons)
      );
    }
    return ResultT.Success<Username>(new Username(value));
  }

  private static validate(value: string): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (value.length < 5 || value.length > 30) {
      reasons.push('Username must be between 5 and 30 characters long');
    }
    if (/[_\.]{2}/.test(value)) {
      reasons.push(
        'Username cannot have consecutive special characters like _ or .'
      );
    }
    if (/^[_.]/.test(value) || /[_.]$/.test(value)) {
      reasons.push(
        'Username cannot start or end with special characters like _ or .'
      );
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(value)) {
      reasons.push(
        'Username can only contain alphanumeric characters, underscores, and dots'
      );
    }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): string {
    return this._value;
  }

  public equals(other: Username): boolean {
    return this.value === other.value;
  }
}
export default Username;
